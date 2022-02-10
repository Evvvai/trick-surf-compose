import { MigrationInterface, QueryRunner } from 'typeorm';

export class procedures1642259643783 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `
        CREATE PROCEDURE put_leaderboard_cached()
        LANGUAGE SQL
        NOT DETERMINISTIC
        CONTAINS SQL
        SQL SECURITY DEFINER
        COMMENT ''
        BEGIN

            START TRANSACTION;
            
                TRUNCATE leaderboard_cached;
                
                # Need select ammout of maps...but i dont know how to do it (9((
                FOR i IN 1..4
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
                    ORDER BY upuc.up, upuc.uc ASC
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
                            (SELECT uc * (100 / COUNT(*)) FROM tricks WHERE map_id = i) completes_percent,
                            i map_id
                    FROM apac
                    ORDER BY (SELECT uc * (100 / COUNT(*)) FROM tricks WHERE map_id = 4) ASC 
                    )
                    
                    SELECT  *
                    FROM result
                    ORDER BY place ASC;
                    
                END FOR;
                
            COMMIT;
            
        END;
    `,
    );

    queryRunner.query(
      `
        CREATE PROCEDURE get_player_record_breaks(
            IN p_steamid64 VARCHAR(50),
            IN p_map_id INT
        )
        LANGUAGE SQL
        NOT DETERMINISTIC
        CONTAINS SQL
        SQL SECURITY DEFINER
        COMMENT ''
        BEGIN

            WITH 
            playerId AS (
            SELECT p.id
            FROM players p
            WHERE p.steamid64 = p_steamid64
            ),
            map_completes AS (
                SELECT sc.id,
                            sc.trick_id,
                            t.name,
                            sc.speed,
                            sc.time,
                            sc.date_add,
                            sc.player_id
                FROM completes sc
                JOIN tricks t ON sc.trick_id = t.id
                WHERE t.map_id = p_map_id
            )
            
            SELECT *
            FROM 
            ((
                SELECT su.now_wr,
                        su.before_wr,
                        0 type_record,
                        0 type_beat,
                        sc.trick_id,
                        sc.name,
                        sc.speed res,
                        scc.speed res_before,
                        p.steamid,
                        p.nick,
                        sc.date_add,
                        (SELECT COUNT(wr.id) actual FROM swr wr WHERE wr.complete_id = su.now_wr) actual
                
                FROM swr_update su
                JOIN map_completes sc ON sc.id = su.now_wr
                JOIN map_completes scc ON scc.id = su.before_wr
                JOIN players p ON p.id = sc.player_id
                WHERE scc.player_id = (SELECT id FROM playerId)
                AND sc.player_id != (SELECT id FROM playerId)
            )
            UNION
            (
                SELECT su.now_wr,
                    su.before_wr,
                    0 type_record,
                    1 type_beat,
                    sc.trick_id,
                    sc.name,
                    sc.speed res,
                    scc.speed res_before,
                    p.steamid,
                    p.nick,
                    sc.date_add,
                    (SELECT COUNT(wr.id) actual FROM swr wr WHERE wr.complete_id = su.now_wr) actual
                
                FROM swr_update su
                JOIN map_completes sc ON sc.id = su.now_wr
                JOIN map_completes scc ON scc.id = su.before_wr
                JOIN players p ON p.id = scc.player_id
                WHERE sc.player_id = (SELECT id FROM playerId)
                AND scc.player_id != (SELECT id FROM playerId)
            )
            UNION
            (
                SELECT su.now_wr,
                    su.before_wr,
                    1 type_record,
                    1 type_beat,
                    sc.trick_id,
                    sc.name,
                    sc.time res,
                    scc.time res_before,
                    p.steamid,
                    p.nick,
                    sc.date_add,
                    (SELECT COUNT(wr.id) actual FROM twr wr WHERE wr.complete_id = su.now_wr) actual
                
                FROM twr_update su
                JOIN map_completes sc ON sc.id = su.now_wr
                JOIN map_completes scc ON scc.id = su.before_wr
                JOIN players p ON p.id = scc.player_id
                WHERE sc.player_id = (SELECT id FROM playerId)
                AND scc.player_id != (SELECT id FROM playerId)
            )
            UNION
            (
                SELECT su.now_wr,
                    su.before_wr,
                    1 type_record,
                    0 type_beat,
                    sc.trick_id,
                    sc.name,
                    sc.time res,
                    scc.time res_before,
                    p.steamid,
                    p.nick,
                    sc.date_add,
                    (SELECT COUNT(wr.id) actual FROM twr wr WHERE wr.complete_id = su.now_wr) actual
                
                FROM twr_update su
                JOIN map_completes sc ON sc.id = su.now_wr
                JOIN map_completes scc ON scc.id = su.before_wr
                JOIN players p ON p.id = sc.player_id
                WHERE scc.player_id = (SELECT id FROM playerId)
                AND sc.player_id != (SELECT id FROM playerId)
            )) rb
            ORDER BY rb.date_add DESC;

        END;
    `,
    );

    queryRunner.query(
      `
        CREATE PROCEDURE get_player_activity(
            IN p_steamid64 VARCHAR(50),
            IN p_limit INT,
            IN p_offset INT
        )
        LANGUAGE SQL
        NOT DETERMINISTIC
        CONTAINS SQL
        SQL SECURITY DEFINER
        COMMENT ''
        BEGIN

            SET @cur := -1;

            SELECT * 
            FROM(
            SELECT DATE_FORMAT(d.d,'%Y-%m-%d') origin_date, 
                    DATE_FORMAT(d.d,'%m.%d') sub_month_day, 
                    TIME_FORMAT(if(dd.t IS NULL, 0, dd.t),'%H:%i') time_played, 
                    if(time_to_sec(dd.t) > 43200, '100', if(time_to_sec(dd.t) IS NULL,0, ROUND((time_to_sec(dd.t)*100)/43200))) percent
                    
            FROM(	SELECT (DATE_SUB(CURDATE(), INTERVAL @cur:=@cur+1 DAY)) d
                    FROM time_online t
                    LIMIT p_limit
                    OFFSET p_offset) d
            LEFT JOIN (SELECT date(ton.time_join) d, sec_to_time(SUM(time_to_sec(ton.time))) t
                    FROM time_online ton
                    WHERE ton.player_id = (SELECT p.id FROM players p WHERE p.steamid64 = p_steamid64)
                    GROUP BY date(ton.time_join)) dd ON dd.d = d.d) res ORDER BY res.sub_month_day ASC;
        END;
    `,
    );

    queryRunner.query(
      `
        CREATE PROCEDURE get_top_avg(
            IN p_map_id INT,
            IN p_limit INT,
            IN p_offset INT
        )
        LANGUAGE SQL
        NOT DETERMINISTIC
        CONTAINS SQL
        SQL SECURITY DEFINER
        COMMENT ''
        WITH 
            map_completes AS (
                SELECT sc.id,
                        sc.player_id,
                        sc.trick_id
                FROM completes sc
                JOIN tricks t ON sc.trick_id = t.id
                WHERE t.map_id = p_map_id
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
                WHERE map_id = p_map_id
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
                WHERE map_id = p_map_id
                GROUP BY sc.player_id
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
                        (SELECT uc * (100 / COUNT(*)) FROM tricks WHERE map_id = p_map_id) completes_percent 
                FROM apac
            )

        SELECT  *
        FROM result
        LIMIT p_limit
        OFFSET p_offset;
        `,
    );

    queryRunner.query(
      `
        CREATE PROCEDURE get_tricks(
            IN p_map_id INT
        )
        LANGUAGE SQL
        NOT DETERMINISTIC
        CONTAINS SQL
        SQL SECURITY DEFINER
        COMMENT ''
        BEGIN

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
                    (SELECT round(c.time,2) FROM completes c WHERE c.id = st.complete_id) time_wr,	 	 
                    (SELECT c.speed FROM completes c WHERE c.id = ss.complete_id) speed_wr
                                        
            FROM tricks_route_viewer v
            LEFT JOIN ( SELECT sc.trick_id, COUNT(sc.trick_id) counts FROM completes sc GROUP BY sc.trick_id) c ON c.trick_id = v.id
            LEFT JOIN twr st ON st.trick_id = v.id
            LEFT JOIN swr ss ON ss.trick_id = v.id
            WHERE v.map_id = p_map_id
            ORDER BY compeletes DESC;

        END;
        `,
    );

    queryRunner.query(
      `
        CREATE PROCEDURE get_tricks_user(
            IN p_map_id INT,
            IN p_steamid VARCHAR(50)
        )
        LANGUAGE SQL
        NOT DETERMINISTIC
        CONTAINS SQL
        SQL SECURITY DEFINER
        COMMENT ''
        BEGIN

            WITH player_id AS (
                SELECT p.id 
                FROM players p 
                WHERE p.steamid64 COLLATE utf8mb4_general_ci = p_steamid
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
                    (SELECT round(c.time,2) FROM completes c WHERE c.id = st.complete_id) time_wr,	 	 
                    (SELECT c.speed FROM completes c WHERE c.id = ss.complete_id) speed_wr,
                    (SELECT MAX(c.speed) FROM my_completes c WHERE c.trick_id = v.id) my_best_speed,
                    (SELECT COUNT(*) FROM my_completes c WHERE c.trick_id = v.id) my_completes,
                    (SELECT round(MIN(c.time),2) FROM my_completes c WHERE c.trick_id = v.id) my_best_time
                    
                                        
            FROM tricks_route_viewer v
            LEFT JOIN (SELECT sc.trick_id, COUNT(sc.trick_id) counts FROM completes sc GROUP BY sc.trick_id) c ON c.trick_id = v.id
            LEFT JOIN twr st ON st.trick_id = v.id
            LEFT JOIN swr ss ON ss.trick_id = v.id
            WHERE v.map_id = p_map_id
            ORDER BY completes DESC;
            
        END;
        `,
    );

    queryRunner.query(
      `
        CREATE PROCEDURE get_tricks_user_compact(
            IN p_map_id INT,
            IN p_steamid VARCHAR(50)
        )
        LANGUAGE SQL
        NOT DETERMINISTIC
        CONTAINS SQL
        SQL SECURITY DEFINER
        COMMENT ''
        BEGIN

        WITH player_id AS (
            SELECT p.id 
            FROM players p 
            WHERE p.steamid64 COLLATE utf8mb4_general_ci = p_steamid
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
                v.author_stea   mid,
                v.author,
                if(c.counts IS NULL, 0, c.counts) completes,
                (SELECT COUNT(*) FROM my_completes c WHERE c.trick_id = v.id) my_completes
                                    
        FROM tricks_route_viewer v
        LEFT JOIN (SELECT sc.trick_id, COUNT(sc.trick_id) counts FROM completes sc GROUP BY sc.trick_id) c ON c.trick_id = v.id
        WHERE v.map_id = p_map_id
        ORDER BY completes DESC;
                    
        END
        `,
    );

    queryRunner.query(
      `
        CREATE PROCEDURE get_trick_swr(
            IN p_trick_id INT,
            IN p_steamid VARCHAR(50)
        )
        LANGUAGE SQL
        NOT DETERMINISTIC
        CONTAINS SQL
        SQL SECURITY DEFINER
        COMMENT ''
        BEGIN

            WITH 
            player_id AS (
                SELECT p.id
                FROM players p 
                WHERE p.steamid64 = p_steamid
            ),
            res AS (
                SELECT MAX(sc.speed)
                FROM completes sc
                WHERE sc.trick_id = p_trick_id AND sc.player_id = (SELECT * FROM player_id)
            )
            
            SELECT sc.id, 
                    p.steamid64, 
                    p.nick, 
                    sc.date_add, 
                    sc.speed res, 
                    (SELECT * FROM res) my_res, 
                    if(b.c IS NULL, if(p.id = (SELECT * FROM player_id),1,NULL), b.c) place
            FROM completes sc
            LEFT JOIN (SELECT sc.trick_id, count(distinct(sc.player_id)) c
                    FROM completes sc
                    WHERE sc.trick_id = p_trick_id AND sc.speed > (SELECT * FROM res)
                    GROUP BY sc.trick_id) b ON b.trick_id = sc.trick_id
            JOIN players p ON p.id = sc.player_id
            WHERE sc.id = (SELECT st.complete_id FROM swr st WHERE st.trick_id = p_trick_id);    

        END;
        `,
    );

    queryRunner.query(
      `
        CREATE PROCEDURE get_trick_twr(
            IN p_trick_id INT,
            IN p_steamid VARCHAR(50)
        )
        LANGUAGE SQL
        NOT DETERMINISTIC
        CONTAINS SQL
        SQL SECURITY DEFINER
        COMMENT ''
        BEGIN

            WITH 
            player_id AS (
                SELECT p.id
                FROM players p 
                WHERE p.steamid64 = p_steamid
            ),
            res AS (
                SELECT MIN(sc.time)
                FROM completes sc
                WHERE sc.trick_id = p_trick_id AND sc.player_id = (SELECT * FROM player_id)
            )
            
            SELECT sc.id, 
                p.steamid64, 
                p.nick, 
                sc.date_add, 
                ROUND(sc.time, 2) res, 
                ROUND((SELECT * FROM res), 2) my_res, 
                if(b.c IS NULL, if(p.id = (SELECT * FROM player_id),1,NULL), b.c) place
            FROM completes sc
            LEFT JOIN (    SELECT sc.trick_id, count(distinct(sc.player_id)) c
                        FROM completes sc
                        WHERE sc.trick_id = p_trick_id AND sc.time < (SELECT * FROM res)
                        GROUP BY sc.trick_id) b ON b.trick_id = sc.trick_id
            JOIN players p ON p.id = sc.player_id
            WHERE sc.id = (SELECT st.complete_id FROM twr st WHERE st.trick_id = p_trick_id);
            
        END;
        `,
    );

    queryRunner.query(
      `
    CREATE PROCEDURE patch_trick_route_parse(
            IN p_id INT,
            IN p_route TEXT,
            IN p_map_id INT
        )
        LANGUAGE SQL
        NOT DETERMINISTIC
        CONTAINS SQL
        SQL SECURITY DEFINER
        COMMENT ''
        BEGIN

        DECLARE Leng INT DEFAULT NULL;
        DECLARE Route TEXT;

        DELETE FROM routes WHERE id IN (SELECT id FROM routes WHERE trick_id = p_id);

        SELECT ((LENGTH(replace(REGEXP_REPLACE(p_route, '[a-z 0-9 _]+', 'X' ), 'X','')) + 1)-1) ccc INTO Leng;
        SET Route = p_route;
        
        SET @LengLoop := 0;
        while @LengLoop <= Leng do 
        
            SET @tr := SUBSTRING_INDEX(Route,',',1);
            SET @tr_id := (SELECT tst.id FROM triggers tst WHERE tst.name = @tr AND map_id = p_map_id);
            INSERT INTO routes(trick_id,trigger_id) VALUES(p_id,@tr_id);                                         	
            SET Route = SUBSTR(Route,LOCATE(',',Route)+1,LENGTH(Route));
        
        set @LengLoop:=@LengLoop+1; 
        end while;

        select trv.id,
            trv.name,
            trv.point,
            trv.velocity,
            trv.route_str,
            trv.route_id,
            trv.len
        FROM tricks_route_viewer trv
        where trv.id = p_id;
        
        END;
    `,
    );

    queryRunner.query(
      `
        CREATE PROCEDURE post_accepted_suggested_trick(
            IN p_suggest_id INT
        )
        LANGUAGE SQL
        NOT DETERMINISTIC
        CONTAINS SQL
        SQL SECURITY DEFINER
        COMMENT ''
        BEGIN

            DECLARE Leng INT DEFAULT NULL;
            DECLARE Route TEXT;
            DECLARE TrickId INT DEFAULT NULL;
            
            SELECT sstrv.route_str INTO Route
            FROM suggested_tricks_route_viewer sstrv 
            WHERE sstrv.id = p_suggest_id;

            SELECT sstrv.len INTO Leng
            FROM suggested_tricks_route_viewer sstrv 
            WHERE sstrv.id = p_suggest_id;
            
            INSERT 
            INTO tricks(name, point, velocity, author_id)
            SELECT sstrv.name, sstrv.point, sstrv.velocity, sstrv.author_id
            FROM suggested_tricks_route_viewer sstrv 
            WHERE sstrv.id = p_suggest_id;
            
            SELECT st.id INTO TrickId
            FROM tricks st 
            ORDER BY st.id DESC
            LIMIT 1;
            
            SET @LengLoop := 0;
            while @LengLoop < Leng do 
            
                SET @tr := SUBSTRING_INDEX(Route,',',1);
                SET @tr_id := (SELECT tst.id FROM triggers tst WHERE tst.name = @tr);
                INSERT INTO routes (trick_id,trigger_id) VALUES(TrickId,@tr_id);	                                                     	
                SET Route = SUBSTR(Route,LOCATE(',',Route)+1,LENGTH(Route));
            
            set @LengLoop:=@LengLoop+1; 
            end while;

        END;
        `,
    );

    queryRunner.query(
      `
        CREATE PROCEDURE post_suggested_trick(
            IN p_name VARCHAR(50),
            IN p_point INT,
            IN p_velocity INT,
            IN p_author_id INT,
            IN p_route TEXT,
            IN p_map_id INT
        )
        LANGUAGE SQL
        NOT DETERMINISTIC
        CONTAINS SQL
        SQL SECURITY DEFINER
        COMMENT ''
        BEGIN

            START TRANSACTION;

                INSERT INTO suggested_tricks(name, point, velocity, author_id, map_id) 
                VALUES(p_name, p_point, p_velocity, (SELECT u.player_id FROM users u WHERE u.id = p_author_id), p_map_id);
                
                CALL put_suggested_routes((SELECT LAST_INSERT_ID()), p_route);

            COMMIT;	
            
        END;
        `,
    );

    queryRunner.query(
      `
        CREATE PROCEDURE put_player_data(
            IN p_steamid2 VARCHAR(50),
            IN p_steamid64 VARCHAR(50),
            IN p_nick VARCHAR(50)
        )
        LANGUAGE SQL
        NOT DETERMINISTIC
        CONTAINS SQL
        SQL SECURITY DEFINER
        COMMENT ''
        BEGIN

            SELECT @msrp:=COUNT(*)
            FROM players p
            WHERE p.steamid = p_steamid2;
            
            IF @msrp = 0
            THEN INSERT INTO players(steamid, steamid64, nick) VALUES(p_steamid2, p_steamid64, p_nick);
            END IF;
            
            # IF @msrp > 0
            # THEN UPDATE players p SET p.nick = p_nick, p.steamid64 = p_steamid64 WHERE p.steamid = p_steamid2;
            # ELSE INSERT INTO players(steamid, steamid64, nick) VALUES(p_steamid2, p_steamid64, p_nick); 
            # END IF;
            
        END;
        `,
    );

    queryRunner.query(
      `
        CREATE PROCEDURE put_suggested_routes(
            IN p_id INT,
            IN p_route TEXT
        )
        LANGUAGE SQL
        NOT DETERMINISTIC
        CONTAINS SQL
        SQL SECURITY DEFINER
        COMMENT ''
        BEGIN

        DECLARE Leng INT DEFAULT NULL;
        DECLARE Route TEXT;

        SELECT ((LENGTH(replace(REGEXP_REPLACE(p_route, '[a-z 0-9 _]+', 'X' ), 'X','')) + 1)-1) ccc INTO Leng;
        SET Route = p_route;
        
        DELETE FROM suggested_routes WHERE id IN (SELECT id FROM suggested_routes WHERE trick_id = p_id);

        while @LengLoop <= Leng do 
        
            SET @tr := SUBSTRING_INDEX(Route,',',1);
        
            INSERT INTO suggested_routes (trick_id,trigger_id) VALUES(p_id,@tr);
                                                                    
            SET Route = SUBSTR(Route,LOCATE(',',Route)+1,LENGTH(Route));
        
        set @LengLoop:=@LengLoop+1; 
        end while;
        
        END
        `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query('DROP PROCEDURE if EXISTS put_leaderboard_cached;');
    queryRunner.query('DROP PROCEDURE if EXISTS get_player_record_breaks;');
    queryRunner.query('DROP PROCEDURE if EXISTS get_player_activity;');
    queryRunner.query('DROP PROCEDURE if EXISTS get_top_avg;');
    queryRunner.query('DROP PROCEDURE if EXISTS get_tricks;');
    queryRunner.query('DROP PROCEDURE if EXISTS get_tricks_user;');
    queryRunner.query('DROP PROCEDURE if EXISTS get_trick_swr;');
    queryRunner.query('DROP PROCEDURE if EXISTS get_trick_twr;');
    queryRunner.query('DROP PROCEDURE if EXISTS get_trick_twr;');
    queryRunner.query('DROP PROCEDURE if EXISTS patch_trick_route_parse;');
    queryRunner.query(
      'DROP PROCEDURE if EXISTS post_accepted_suggested_trick;',
    );
    queryRunner.query('DROP PROCEDURE if EXISTS post_suggested_trick;');
    queryRunner.query('DROP PROCEDURE if EXISTS put_player_data;');
    queryRunner.query('DROP PROCEDURE if EXISTS put_suggested_routes;');
    queryRunner.query('DROP PROCEDURE if EXISTS get_tricks_user_compact;');
  }
}
