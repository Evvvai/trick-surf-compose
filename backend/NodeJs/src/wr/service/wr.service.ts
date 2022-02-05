import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Swr } from '../../shared/entities/Swr';
import { Twr } from '../../shared/entities/Twr';
import { Completes } from '../../shared/entities/Completes';

@Injectable()
export class WRService {
  constructor(
    @InjectRepository(Swr)
    private swrRepository: Repository<Swr>,

    @InjectRepository(Twr)
    private twrRepository: Repository<Twr>,

    @InjectRepository(Completes)
    private completesRepository: Repository<Completes>,
  ) {}

  async swr(trickId: number) {
    const trick = await this.swrRepository.findOne({
      where: { trickId },
    });

    return this.completesRepository.findOne({
      where: { id: trick.completeId },
    });
  }

  async twr(trickId: number) {
    const trick = await this.twrRepository.findOne({
      where: { trickId },
    });

    return this.completesRepository.findOne({
      where: { id: trick.completeId },
    });
  }
}
