import { Module } from '@nestjs/common';
import { MapsService } from './maps.service';
import { MapsResolver } from './maps.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Maps } from 'src/shared/entities/Maps';

@Module({
  imports: [TypeOrmModule.forFeature([Maps])],
  providers: [MapsResolver, MapsService],
  exports: [MapsService],
})
export class MapsModule {}
