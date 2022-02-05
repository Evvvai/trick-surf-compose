import { Resolver, Query, Args } from '@nestjs/graphql';
import { MapsService } from './maps.service';
import { Maps } from 'src/shared/entities/Maps';

@Resolver(() => Maps)
export class MapsResolver {
  constructor(private readonly mapsService: MapsService) {}

  @Query(() => [Maps])
  maps() {
    return this.mapsService.getAll();
  }

  @Query(() => Maps)
  map(@Args('id') id: number) {
    return this.mapsService.getOne(id);
  }
}
