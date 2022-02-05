import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TriggersResolver } from './triggers.resolver';
import { TriggersService } from './triggers.service';
import { Triggers } from 'src/shared/entities/Triggers';

@Module({
  imports: [TypeOrmModule.forFeature([Triggers])],
  providers: [TriggersResolver, TriggersService],
  exports: [TriggersService],
})
export class TriggersModule {}
