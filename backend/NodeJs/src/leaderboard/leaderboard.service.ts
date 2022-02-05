import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Completes } from 'src/shared/entities/Completes';
import { LeaderboardInput } from './dto/leaderboard.input';
import { LeaderboardI } from './entities/leaderboard.interface';
import { LeaderboardCached } from '../shared/entities/LeaderboardCached';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectRepository(Completes)
    private leaderboardRepository: Repository<Completes>,

    @InjectRepository(LeaderboardCached)
    private leaderboardCachedRepository: Repository<LeaderboardCached>,
  ) {}

  async getAll(input: LeaderboardInput): Promise<LeaderboardI[]> {
    // const leaderboard = await this.leaderboardRepository.query(
    //   `
    //   call get_top_avg(${input.mapId},${input?.limit || 100}, ${
    //     input?.offset || 0
    //   })
    //   `,
    // );
    // or

    const top = await this.leaderboardRepository.query(
      `
      WITH 
        map_completes AS (
            SELECT sc.id,
                    sc.player_id,
                    sc.trick_id
            FROM completes sc
            JOIN tricks t ON sc.trick_id = t.id
            WHERE t.map_id = ${input.mapId}
        ),
        percent AS (
            SELECT 100 / COUNT(DISTINCT(player_id)) 
            FROM map_completes
        ),
        uc AS (
            SELECT sc.player_id,
                    sc.trick_id
            FROM map_completes sc
            GROUP BY sc.trick_id, sc.player_id
        ),
        upuc AS (
            SELECT ROW_NUMBER() over (ORDER BY SUM(st.point) DESC) upPlace,
                    SUM(st.point) up,
                    ROW_NUMBER() over (ORDER BY COUNT(1) DESC) ucPlace,
                    COUNT(1) uc,
                    uc.player_id
            FROM uc
            JOIN tricks st ON uc.trick_id = st.id
            WHERE map_id = ${input.mapId}
            GROUP BY uc.player_id
        ),
        apac AS (
            SELECT sc.player_id, 
                  p.steamid64,
                    p.nick,
                    ROW_NUMBER() over (ORDER BY COUNT(sc.id) DESC) acPlace,
                    COUNT(sc.id) ac,
                    ROW_NUMBER() over (ORDER BY SUM(st.point) DESC) apPlace,
                    SUM(st.point) ap,
                    upuc.upPlace,
                    upuc.up,
                    upuc.ucPlace,
                    upuc.uc
            FROM map_completes sc
            JOIN tricks st ON st.id = sc.trick_id 
            JOIN players p ON sc.player_id = p.id
            JOIN upuc ON upuc.player_id = sc.player_id
            WHERE map_id = ${input.mapId}
            GROUP BY sc.player_id
        ),
        result AS (
            SELECT  player_id playerId,
                    steamid64,
                    nick,
                    acPlace,
                    ac,
                    apPlace,
                    ap,
                    upPlace,
                    up,
                    ucPlace,
                    uc,
                    ROUND((((SUM(acPlace + apPlace + upPlace + ucPlace - 4) over (PARTITION BY player_id)) * (SELECT * FROM percent)) / 4), 2) avg,
                    ROW_NUMBER() over (ORDER BY (acPlace + apPlace + upPlace + ucPlace) ASC) place,
                    (SELECT uc * (100 / COUNT(*)) FROM tricks WHERE map_id = ${
                      input.mapId
                    }) completesPercent


            FROM apac
        )

      SELECT  *
      FROM result
      ORDER BY place ASC
      LIMIT ${input.limit || 100}
      OFFSET ${input.offset || 0};
      `,
    );

    return top;
  }

  async getAllCached(input: LeaderboardInput) {
    const top = await this.leaderboardCachedRepository.find({
      where: {
        mapId: input.mapId,
      },
      skip: input.offset,
      take: input.limit,
      order: { ['place']: 'ASC' },
    });
    return top;
  }
}
