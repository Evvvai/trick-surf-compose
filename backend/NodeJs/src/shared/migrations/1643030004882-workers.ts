import { MigrationInterface, QueryRunner } from 'typeorm';

export class workers1643030004882 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `
            CREATE EVENT worker_leaderboard_cached
                ON SCHEDULE
                    EVERY 1 HOUR STARTS (SELECT DATE_ADD(NOW(), INTERVAL 1 MINUTE))
                ON COMPLETION PRESERVE
                ENABLE
                COMMENT ''
                
                DO BEGIN

                TRUNCATE leaderboard_cached;

                # need remove hardcode...idk how
                FOR i IN 1..2
                DO
            
                INSERT 
                INTO leaderboard_cached(player_id,steamid64,nick,ac_place,ac,ap_place,ap,up_place,up,uc_place,uc,avg,place,completes_percent,map_id)
                WITH 
                map_completes AS (
                    SELECT sc.id,
                            sc.player_id,
                            sc.trick_id
                    FROM completes sc
                    JOIN tricks t ON sc.trick_id = t.id
                    WHERE t.map_id = i
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
                    WHERE map_id = i
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
                    WHERE map_id = i
                    GROUP BY sc.player_id
                    ORDER BY upuc.ucPlace, upuc.upPlace
                ),
                result AS (
                    SELECT  player_id,
                        steamid64,
                            nick,
                            acPlace as ac_place,
                            ac,
                            apPlace as ap_place,
                            ap,
                            upPlace as up_place,
                            up,
                            ucPlace as uc_place,
                            uc,
                            ROUND((((SUM(acPlace + apPlace + upPlace + ucPlace - 4) over (PARTITION BY player_id)) * (SELECT * FROM percent)) / 4), 2) avg,
                            ROW_NUMBER() over (ORDER BY (acPlace + apPlace + upPlace + ucPlace) ASC) place,
                            (SELECT uc * (100 / COUNT(*)) FROM tricks WHERE map_id = 1) completes_percent,
                            i map_id
                    FROM apac
                )
                
                SELECT  *
                FROM result
                ORDER BY place ASC;
                
                END FOR;

            END; 
          `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query('DROP EVENT if EXISTS worker_leaderboard_cached;');
  }
}
