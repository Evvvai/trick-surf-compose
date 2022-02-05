import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Players } from 'src/shared/entities/Players';
import { Triggers } from 'src/shared/entities/Triggers';
import { Repository } from 'typeorm';
import { TriggersUpdateInput } from './dto/triggers-update.input';
import { TriggersInput } from './dto/triggers.input';
import { TriggersI } from './entities/triggers.interface';

@Injectable()
export class TriggersService {
  constructor(
    @InjectRepository(Triggers)
    private triggerRepository: Repository<Triggers>,
  ) {}

  async getOne(input: TriggersInput, id: number): Promise<Triggers> {
    return this.triggerRepository.findOne({
      where: { id, mapId: input.mapId },
    });
  }

  async updatePhoto(
    player: Players,
    url: string,
    id: number,
  ): Promise<Triggers> {
    const trigger = await this.triggerRepository.findOne(id);
    return this.triggerRepository.save({ ...trigger, src: url });
  }

  async update(player: Players, input: TriggersUpdateInput): Promise<Triggers> {
    const trigger = await this.triggerRepository.findOne({
      where: {
        id: input.id,
      },
    });
    return this.triggerRepository.save({
      ...trigger,
      src: input.src,
      name: input.name,
    });
  }

  async getAll(input: TriggersInput): Promise<Triggers[]> {
    return this.triggerRepository.find({
      where: {
        mapId: input.mapId,
      },
    });
  }
}
