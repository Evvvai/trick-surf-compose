import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SwrLostNotify } from 'src/shared/entities/SwrLostNotify';
import { TwrLostNotify } from 'src/shared/entities/TwrLostNotify';
import { Repository } from 'typeorm';

@Injectable()
export class WRNotifyService {
  constructor(
    @InjectRepository(TwrLostNotify)
    private swrLostNotifyRepository: Repository<TwrLostNotify>,

    @InjectRepository(SwrLostNotify)
    private twrLostNotifyRepository: Repository<SwrLostNotify>,
  ) {}

  async getSwrNotifyNone(steamid64: string) {
    // const trick = await this.swrRepository.findOne({
    //   where: { trickId },
    // });
    // return this.completesRepository.findOne({
    //   where: { id: trick.completeId },
    // });
  }

  async getTwrNotifyNone(steamid64: string) {
    // const trick = await this.twrRepository.findOne({
    //   where: { trickId },
    // });
    // return this.completesRepository.findOne({
    //   where: { id: trick.completeId },
    // });
  }
}
