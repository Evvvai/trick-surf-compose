import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Maps } from 'src/shared/entities/Maps';
import { Not, Repository } from 'typeorm';

@Injectable()
export class MapsService {
  constructor(
    @InjectRepository(Maps)
    private mapsRepository: Repository<Maps>,
  ) {}

  async getAll(): Promise<Maps[]> {
    return this.mapsRepository.find({
      where: {
        id: Not(0),
      },
    });
  }

  async getOne(id: number): Promise<Maps> {
    return this.mapsRepository.findOne(id);
  }
}
