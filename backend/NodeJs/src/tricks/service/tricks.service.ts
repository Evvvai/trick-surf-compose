import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Maps } from 'src/shared/entities/Maps';
import { Routes } from 'src/shared/entities/Routes';
import { Tricks } from 'src/shared/entities/Tricks';
import { Triggers } from 'src/shared/entities/Triggers';
import { Repository } from 'typeorm';
import { TricksStatsInput } from '../dto/tricks-stats.input';
import { TricksInput } from '../dto/tricks.input';
import { TricksStats } from '../entities/trick-stats.entity';
import { TricksI } from '../entities/trick.interface';
import { Players } from 'src/shared/entities/Players';
import { SendTrickInput } from '../dto/send-trick.input';
import { SuggestedTricks } from '../../shared/entities/SuggestedTricks';
import { SuggestedRoutes } from 'src/shared/entities/SuggestedRoutes';

@Injectable()
export class TricksService {
  constructor(
    @InjectRepository(Tricks)
    private tricksRepository: Repository<Tricks>,

    @InjectRepository(Routes)
    private routesRepository: Repository<Routes>,

    @InjectRepository(SuggestedTricks)
    private suggestedTricksRepository: Repository<SuggestedTricks>,

    @InjectRepository(SuggestedRoutes)
    private suggestedRoutesRepository: Repository<SuggestedRoutes>,
  ) {}

  async getOne(input: TricksInput, id: number): Promise<Tricks> {
    return this.tricksRepository.findOne({ where: { id, mapId: input.mapId } });
  }

  async getAll(input: TricksInput): Promise<Tricks[]> {
    return this.tricksRepository.find({
      where: {
        mapId: input.mapId,
      },
    });
  }

  async getTrickByName(name: string): Promise<Tricks> {
    return this.tricksRepository.findOne({
      where: {
        name: name,
      },
    });
  }

  async getSuggestedTrickByName(name: string) {
    return this.suggestedTricksRepository.findOne({
      where: {
        name: name,
      },
    });
  }

  async getAllWithStats(input: TricksStatsInput): Promise<TricksStats[]> {
    const tricks: TricksStats[] = await this.tricksRepository.query(
      `
        WITH player_id AS (
            SELECT p.id 
            FROM players p 
            WHERE p.steamid64 COLLATE utf8mb4_general_ci = '${
              input?.steamid || ''
            }'
        ),
        my_completes AS (
            SELECT *
            FROM completes c 
            WHERE c.player_id = (SELECT * FROM player_id)
        )
        
        SELECT ROW_NUMBER() over (PARTITION BY NULL) 'index',
                v.id, 
                v.name, 
                v.point, 
                v.velocity, 
                v.date_add, 
                v.route_id, 
                v.len,
                v.author_steamid,
                v.author,
                if(c.counts IS NULL, 0, c.counts) completes,
                (SELECT COUNT(*) FROM my_completes c WHERE c.trick_id = v.id) my_completes
                                    
        FROM tricks_route_viewer v
        LEFT JOIN (SELECT sc.trick_id, COUNT(sc.trick_id) counts FROM completes sc GROUP BY sc.trick_id) c ON c.trick_id = v.id
        WHERE v.map_id = ${input.mapId}
        ORDER BY completes DESC;
      
      `,
    );
    // or
    // `call get_tricks_user_compact(${input.mapId},'${input?.steamid || ''}')`);,
    // return tricks[0];

    return tricks;
  }

  async getRouteByTrick(trick: TricksI): Promise<Triggers[]> {
    const query = await this.routesRepository
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.trigger', 'triggers')
      .where('t.trick_id = :trickId')
      .setParameters({ trickId: trick.id })
      .getMany();

    return query.map((x) => x.trigger);
  }

  async getRouteByTrickStat(trick: TricksStats): Promise<Triggers[]> {
    const query = await this.routesRepository
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.trigger', 'triggers')
      .where('t.trick_id = :trickId')
      .setParameters({ trickId: trick.id })
      .getMany();

    return query.map((x) => x.trigger);
  }
}
