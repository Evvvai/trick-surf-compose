import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Routes } from 'src/shared/entities/Routes';
import { Tricks } from 'src/shared/entities/Tricks';
import { Triggers } from 'src/shared/entities/Triggers';
import { In, Repository } from 'typeorm';
import { TricksI } from '../entities/trick.interface';
import { Players } from 'src/shared/entities/Players';
import { SendTrickInput } from '../dto/send-trick.input';
import { SuggestedTricks, Status } from '../../shared/entities/SuggestedTricks';
import { SuggestedRoutes } from 'src/shared/entities/SuggestedRoutes';
import {
  Rate,
  SuggestedTricksRates,
} from '../../shared/entities/SuggestedTricksRate';
import { SuggestedTricksInput } from '../dto/suggested-tricks.input';
import { AmqpService } from '../../shared/services/amqp.service';

@Injectable()
export class SuggestedTricksService {
  constructor(
    @InjectRepository(Tricks)
    private tricksRepository: Repository<Tricks>,

    @InjectRepository(Routes)
    private routesRepository: Repository<Routes>,

    @InjectRepository(SuggestedTricks)
    private suggestedTricksRepository: Repository<SuggestedTricks>,

    @InjectRepository(SuggestedRoutes)
    private suggestedRoutesRepository: Repository<SuggestedRoutes>,

    @InjectRepository(SuggestedTricksRates)
    private suggestedTricksRatesRepository: Repository<SuggestedTricksRates>,

    public readonly amqpService: AmqpService,
  ) {}

  async getAll(input: SuggestedTricksInput): Promise<SuggestedTricks[]> {
    return this.suggestedTricksRepository.find({
      where: {
        mapId: input.mapId,
      },
      skip: input.offset,
      take: input.limit,
      order: { ['id']: 'DESC' },
    });
  }

  async sendTrick(player: Players, trick: SendTrickInput) {
    const createdTrick = await this.suggestedTricksRepository.create(trick);
    const suggestedTrick = await this.suggestedTricksRepository.save(
      createdTrick,
    );
    const routeIds = trick.route.split(',');
    await this.suggestedRoutesRepository.insert([
      ...routeIds.map((triggerId) => {
        return {
          trickId: suggestedTrick.id,
          triggerId: +triggerId,
        };
      }),
    ]);
    return suggestedTrick;
  }

  async getRouteByTrick(trick: TricksI): Promise<Triggers[]> {
    const query = await this.suggestedRoutesRepository
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.trigger', 'triggers')
      .where('t.trick_id = :trickId')
      .setParameters({ trickId: trick.id })
      .getMany();

    return query.map((x) => x.trigger);
  }

  async ratesForTrick(id: number) {
    const up = await this.suggestedTricksRatesRepository.count({
      where: {
        trickId: id,
        rate: Rate.up,
      },
    });

    const down = await this.suggestedTricksRatesRepository.count({
      where: {
        trickId: id,
        rate: Rate.down,
      },
    });

    return {
      up,
      down,
    };
  }

  async playerRateForTricks(player: Players, ids: number[]) {
    const tricks = await this.suggestedTricksRatesRepository.find({
      where: {
        playerId: player.id,
        trickId: In(ids),
      },
    });

    return tricks;
  }

  async rateTrick(player: Players, trickId: number, rate: Rate) {
    const trickRate = await this.suggestedTricksRatesRepository.findOne({
      where: {
        trickId,
        playerId: player.id,
      },
    });

    const trickUpdated = await this.suggestedTricksRatesRepository.save({
      ...trickRate,
      playerId: player.id,
      trickId,
      rate: rate,
      dateAdd: new Date(),
    });

    return trickUpdated;
  }

  async acceptTrick(id: number) {
    const trick = await this.suggestedTricksRepository.findOne({
      id,
    });
    if (trick.status !== 'pending') return trick;

    const trickUpdated = await this.suggestedTricksRepository.save({
      ...trick,
      status: Status.accepted,
      dateModify: new Date(),
    });

    const trickRoute = await this.suggestedRoutesRepository.find({
      where: {
        trickId: id,
      },
    });

    const newTrick = await this.tricksRepository.save({
      authorId: trick.authorId,
      mapId: trick.mapId,
      name: trick.name,
      point: trick.point,
      velocity: trick.velocity,
    });

    await this.routesRepository.insert(
      trickRoute.map((trigger) => {
        return {
          trickId: +newTrick.id,
          triggerId: +trigger.triggerId,
        };
      }),
    );

    const trickRaw = await this.tricksRepository.query(
      `
      SELECT t.id,
            t.name,
            t.point,
            t.velocity,
            p.steamid,
            p.steamid64,
            p.nick,
            m.id map_id,
            m.name map_name,
            t.route_str,
            if(ISNULL(p.avatarCustom), if(ISNULL(p.avatarfull), 'https://firebasestorage.googleapis.com/v0/b/csleague-2ecff.appspot.com/o/etc%2Fnot_invites.gif?alt=media&token=1b1d83e1-f6f4-4a48-85cb-5520663ced0a', p.avatarfull), p.avatarCustom) avatar

      FROM tricks_route_viewer t
      JOIN players p ON p.steamid64 = t.author_steamid
      JOIN maps m ON m.id = t.map_id
      WHERE t.id = ${newTrick.id};
      `,
    );

    this.amqpService.newTrick(
      'tricks',
      Buffer.from(JSON.stringify(trickRaw[0])),
    );

    return trickUpdated;
  }

  async declineTrick(id: number) {
    const trick = await this.suggestedTricksRepository.findOne({
      id,
    });
    if (trick.status !== 'pending') return trick;

    const trickUpdated = await this.suggestedTricksRepository.save({
      ...trick,
      status: Status.declined,
      dateModify: new Date(),
    });

    return trickUpdated;
  }
}
