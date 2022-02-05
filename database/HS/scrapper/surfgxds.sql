-- --------------------------------------------------------
-- Хост:                         62.113.115.251
-- Версия сервера:               10.6.5-MariaDB-1:10.6.5+maria~focal-log - mariadb.org binary distribution
-- Операционная система:         debian-linux-gnu
-- HeidiSQL Версия:              11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Дамп структуры базы данных surfgxds
CREATE DATABASE IF NOT EXISTS `surfgxds` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `surfgxds`;

-- Дамп структуры для таблица surfgxds.completes
CREATE TABLE IF NOT EXISTS `completes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `player_id` int(11) DEFAULT NULL,
  `trick_id` int(11) DEFAULT NULL,
  `speed` smallint(6) DEFAULT NULL,
  `time` float DEFAULT NULL,
  `date_add` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `trick_id` (`trick_id`),
  KEY `player_id` (`player_id`),
  CONSTRAINT `FK_011d3ac0ff2eb8b6cda699eab81` FOREIGN KEY (`trick_id`) REFERENCES `tricks` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_f819ffd4781bd71fb4551b5d82a` FOREIGN KEY (`player_id`) REFERENCES `players` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=157755 DEFAULT CHARSET=utf8mb4;

-- Экспортируемые данные не выделены.

-- Дамп структуры для таблица surfgxds.friends_player
CREATE TABLE IF NOT EXISTS `friends_player` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `playerId` int(11) NOT NULL,
  `friendId` int(11) NOT NULL,
  `since` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  PRIMARY KEY (`id`),
  KEY `FK_friend_player_friend` (`friendId`),
  KEY `FK_friend_player_player` (`playerId`),
  CONSTRAINT `FK_1b08c8df288e9c4bf4e8286256e` FOREIGN KEY (`playerId`) REFERENCES `players` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_bbf9336d02627c811a749025573` FOREIGN KEY (`friendId`) REFERENCES `players` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=115 DEFAULT CHARSET=utf8mb4;

-- Экспортируемые данные не выделены.

-- Дамп структуры для процедура surfgxds.get_top_avg
DELIMITER //
CREATE PROCEDURE `get_top_avg`(
            IN p_map_id INT,
            IN p_limit INT,
            IN p_offset INT
        )
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
        OFFSET p_offset//
DELIMITER ;

-- Дамп структуры для процедура surfgxds.get_tricks
DELIMITER //
CREATE PROCEDURE `get_tricks`(
            IN p_map_id INT
        )
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

        END//
DELIMITER ;

-- Дамп структуры для процедура surfgxds.get_tricks_user
DELIMITER //
CREATE PROCEDURE `get_tricks_user`(
            IN p_map_id INT,
            IN p_steamid VARCHAR(50)
        )
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
            
        END//
DELIMITER ;

-- Дамп структуры для процедура surfgxds.get_tricks_user_compact
DELIMITER //
CREATE PROCEDURE `get_tricks_user_compact`(
            IN p_map_id INT,
            IN p_steamid VARCHAR(50)
        )
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
                    
        END//
DELIMITER ;

-- Дамп структуры для процедура surfgxds.get_trick_swr
DELIMITER //
CREATE PROCEDURE `get_trick_swr`(
            IN p_trick_id INT,
            IN p_steamid VARCHAR(50)
        )
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

        END//
DELIMITER ;

-- Дамп структуры для процедура surfgxds.get_trick_twr
DELIMITER //
CREATE PROCEDURE `get_trick_twr`(
            IN p_trick_id INT,
            IN p_steamid VARCHAR(50)
        )
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
            
        END//
DELIMITER ;

-- Дамп структуры для таблица surfgxds.hop_triggers
CREATE TABLE IF NOT EXISTS `hop_triggers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `trigger_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `trick_id` (`trigger_id`),
  CONSTRAINT `FK_a1914ce3a88ecbe7b9361b67343` FOREIGN KEY (`trigger_id`) REFERENCES `triggers` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4;

-- Экспортируемые данные не выделены.

-- Дамп структуры для таблица surfgxds.leaderboard_cached
CREATE TABLE IF NOT EXISTS `leaderboard_cached` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `steamid64` varchar(255) NOT NULL,
  `nick` varchar(255) NOT NULL,
  `ac` int(11) NOT NULL,
  `ap` int(11) NOT NULL,
  `up` int(11) NOT NULL,
  `uc` int(11) NOT NULL,
  `avg` varchar(255) NOT NULL,
  `place` int(11) NOT NULL,
  `map_id` int(11) NOT NULL,
  `player_id` int(11) NOT NULL,
  `ac_place` int(11) NOT NULL,
  `ap_place` int(11) NOT NULL,
  `up_place` int(11) NOT NULL,
  `uc_place` int(11) NOT NULL,
  `completes_percent` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=529 DEFAULT CHARSET=utf8mb4;

-- Экспортируемые данные не выделены.

-- Дамп структуры для таблица surfgxds.maps
CREATE TABLE IF NOT EXISTS `maps` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `alternative_name` text DEFAULT NULL,
  `src` text DEFAULT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `IDX_51136216a8ef0f392c868decd8` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;

-- Экспортируемые данные не выделены.

-- Дамп структуры для таблица surfgxds.migrations
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `timestamp` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;

-- Экспортируемые данные не выделены.

-- Дамп структуры для процедура surfgxds.patch_trick_route_parse
DELIMITER //
CREATE PROCEDURE `patch_trick_route_parse`(
	IN `p_id` INT,
	IN `p_route` TEXT
)
BEGIN
        DECLARE Leng INT DEFAULT NULL;
        DECLARE Route TEXT;

        DELETE FROM routes WHERE id IN (SELECT id FROM routes WHERE trick_id = p_id);

        SELECT ((LENGTH(replace(REGEXP_REPLACE(p_route, '[a-z 0-9 _]+', 'X' ), 'X','')) + 1)-1) ccc INTO Leng;
        SET Route = p_route;
        
        SET @LengLoop := 0;
        while @LengLoop <= Leng do 
        
            SET @tr := SUBSTRING_INDEX(Route,',',1);
            SET @tr_id := (SELECT tst.id FROM triggers tst WHERE tst.name = @tr);
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
        END//
DELIMITER ;

-- Дамп структуры для таблица surfgxds.players
CREATE TABLE IF NOT EXISTS `players` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `steamid` varchar(255) DEFAULT NULL,
  `steamid64` varchar(255) DEFAULT NULL,
  `nick` varchar(255) NOT NULL,
  `profileurl` text DEFAULT NULL,
  `avatarfull` text DEFAULT NULL,
  `avatarCustom` text DEFAULT NULL,
  `dashboard` text DEFAULT NULL,
  `date_joined` timestamp NULL DEFAULT current_timestamp(),
  `last_login_site` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `last_login_server` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `role` enum('player','premium','admin') NOT NULL DEFAULT 'player',
  PRIMARY KEY (`id`),
  UNIQUE KEY `steamid64` (`steamid64`),
  UNIQUE KEY `steamid` (`steamid`),
  UNIQUE KEY `IDX_4d5c6d5822db73a234f3c7000a` (`steamid`),
  UNIQUE KEY `IDX_ddcfdb3c5716388556da8e1482` (`steamid64`)
) ENGINE=InnoDB AUTO_INCREMENT=5811 DEFAULT CHARSET=utf8mb4;

-- Экспортируемые данные не выделены.

-- Дамп структуры для процедура surfgxds.post_accepted_suggested_trick
DELIMITER //
CREATE PROCEDURE `post_accepted_suggested_trick`(
            IN p_suggest_id INT
        )
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

        END//
DELIMITER ;

-- Дамп структуры для процедура surfgxds.post_suggested_trick
DELIMITER //
CREATE PROCEDURE `post_suggested_trick`(
            IN p_name VARCHAR(50),
            IN p_point INT,
            IN p_velocity INT,
            IN p_author_id INT,
            IN p_route TEXT,
            IN p_map_id INT
        )
BEGIN

            START TRANSACTION;

                INSERT INTO suggested_tricks(name, point, velocity, author_id, map_id) 
                VALUES(p_name, p_point, p_velocity, (SELECT u.player_id FROM users u WHERE u.id = p_author_id), p_map_id);
                
                CALL put_suggested_routes((SELECT LAST_INSERT_ID()), p_route);

            COMMIT;	
            
        END//
DELIMITER ;

-- Дамп структуры для процедура surfgxds.put_player_data
DELIMITER //
CREATE PROCEDURE `put_player_data`(
	IN `p_steamid2` VARCHAR(50),
	IN `p_steamid64` VARCHAR(50),
	IN `p_nick` VARCHAR(50)
)
BEGIN

            SELECT @msrp:=COUNT(*)
            FROM players p
            WHERE p.steamid = p_steamid2;
            
            # IF @msrp = 0
            # THEN INSERT INTO players(steamid, steamid64, nick) VALUES(p_steamid2, p_steamid64, p_nick);
            # END IF;
            
            IF @msrp > 0
            THEN UPDATE players p SET p.nick = p_nick, p.steamid64 = p_steamid64 WHERE p.steamid = p_steamid2;
            ELSE INSERT INTO players(steamid, steamid64, nick) VALUES(p_steamid2, p_steamid64, p_nick); 
            END IF;
            
        END//
DELIMITER ;

-- Дамп структуры для процедура surfgxds.put_suggested_routes
DELIMITER //
CREATE PROCEDURE `put_suggested_routes`(
            IN p_id INT,
            IN p_route TEXT
        )
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
        
        END//
DELIMITER ;

-- Дамп структуры для таблица surfgxds.routes
CREATE TABLE IF NOT EXISTS `routes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `trick_id` int(11) DEFAULT NULL,
  `trigger_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `trigger_id` (`trigger_id`),
  KEY `trick_id` (`trick_id`),
  CONSTRAINT `FK_ce5672ddfeb78d216000f96524c` FOREIGN KEY (`trigger_id`) REFERENCES `triggers` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_efea36299f2272cdc7373b79be7` FOREIGN KEY (`trick_id`) REFERENCES `tricks` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=48363 DEFAULT CHARSET=utf8mb4;

-- Экспортируемые данные не выделены.

-- Дамп структуры для таблица surfgxds.suggested_routes
CREATE TABLE IF NOT EXISTS `suggested_routes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `trick_id` int(11) DEFAULT NULL,
  `trigger_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `trick_id` (`trick_id`),
  KEY `trigger_id` (`trigger_id`),
  CONSTRAINT `FK_19cea1b3effb7bb3037307a1d4d` FOREIGN KEY (`trigger_id`) REFERENCES `triggers` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_a23d09bdc411fd994a827397398` FOREIGN KEY (`trick_id`) REFERENCES `suggested_tricks` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=321 DEFAULT CHARSET=utf8mb4;

-- Экспортируемые данные не выделены.

-- Дамп структуры для таблица surfgxds.suggested_tricks
CREATE TABLE IF NOT EXISTS `suggested_tricks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `point` int(11) NOT NULL,
  `velocity` int(11) NOT NULL,
  `date_add` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_modify` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('pending','accepted','declined') NOT NULL DEFAULT 'pending',
  `author_id` int(11) NOT NULL,
  `map_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `IDX_20c8407f70f1229f144f18d386` (`name`),
  KEY `map_id` (`map_id`),
  KEY `author_id` (`author_id`),
  CONSTRAINT `FK_34da9e6aa2afa88687df3fbd336` FOREIGN KEY (`author_id`) REFERENCES `players` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_5fd9ae7f93cbcd47a04061c70d5` FOREIGN KEY (`map_id`) REFERENCES `maps` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4;

-- Экспортируемые данные не выделены.

-- Дамп структуры для таблица surfgxds.suggested_tricks_rates
CREATE TABLE IF NOT EXISTS `suggested_tricks_rates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `trick_id` int(11) NOT NULL,
  `player_id` int(11) NOT NULL,
  `rate` enum('up','down') NOT NULL,
  `date_add` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `player_id` (`trick_id`),
  KEY `trick_id` (`player_id`),
  CONSTRAINT `FK_9cb0f4a8a26f6cc5bf55bde41ed` FOREIGN KEY (`player_id`) REFERENCES `players` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_a57a0055b9f5d60ef3e064fd8e6` FOREIGN KEY (`trick_id`) REFERENCES `suggested_tricks` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4;

-- Экспортируемые данные не выделены.

-- Дамп структуры для представление surfgxds.suggested_tricks_route_viewer
-- Создание временной таблицы для обработки ошибок зависимостей представлений
CREATE TABLE `suggested_tricks_route_viewer` (
	`status` ENUM('pending','accepted','declined') NOT NULL COLLATE 'utf8mb4_general_ci',
	`date_modify` TIMESTAMP NOT NULL,
	`id` INT(11) NOT NULL,
	`name` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_general_ci',
	`point` INT(11) NOT NULL,
	`velocity` INT(11) NOT NULL,
	`date_add` TIMESTAMP NOT NULL,
	`author_id` INT(11) NOT NULL,
	`author_steamid` VARCHAR(255) NULL COLLATE 'utf8mb4_general_ci',
	`author_nick` VARCHAR(255) NULL COLLATE 'utf8mb4_general_ci',
	`route_str` MEDIUMTEXT NULL COLLATE 'utf8mb4_general_ci',
	`route_id` MEDIUMTEXT NULL COLLATE 'utf8mb4_general_ci',
	`len` BIGINT(21) NULL,
	`map_id` INT(11) NOT NULL
) ENGINE=MyISAM;

-- Дамп структуры для таблица surfgxds.swr
CREATE TABLE IF NOT EXISTS `swr` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `trick_id` int(11) DEFAULT NULL,
  `complete_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `complete_id` (`complete_id`),
  KEY `trick_id` (`trick_id`),
  CONSTRAINT `FK_318f6f78bfcb77963f651c8b204` FOREIGN KEY (`trick_id`) REFERENCES `tricks` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_3cbdb1d21502c9b0581302a47a5` FOREIGN KEY (`complete_id`) REFERENCES `completes` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=742 DEFAULT CHARSET=utf8mb4;

-- Экспортируемые данные не выделены.

-- Дамп структуры для таблица surfgxds.swr_update
CREATE TABLE IF NOT EXISTS `swr_update` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `now_wr` int(11) DEFAULT NULL,
  `before_wr` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `before_wr` (`before_wr`),
  KEY `now_wr` (`now_wr`),
  CONSTRAINT `FK_22fa1b15611ff5bd680cab89bef` FOREIGN KEY (`before_wr`) REFERENCES `completes` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_a72dbebd84f5970c5b7c6964b28` FOREIGN KEY (`now_wr`) REFERENCES `completes` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=2766 DEFAULT CHARSET=utf8mb4;

-- Экспортируемые данные не выделены.

-- Дамп структуры для таблица surfgxds.time_online
CREATE TABLE IF NOT EXISTS `time_online` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `player_id` int(11) DEFAULT NULL,
  `time` time DEFAULT NULL,
  `time_join` timestamp NULL DEFAULT NULL,
  `time_left` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `player_id` (`player_id`),
  CONSTRAINT `FK_a07ff6710725b3af0e60a5dc26a` FOREIGN KEY (`player_id`) REFERENCES `players` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=106942 DEFAULT CHARSET=utf8mb4;

-- Экспортируемые данные не выделены.

-- Дамп структуры для таблица surfgxds.time_online_status
CREATE TABLE IF NOT EXISTS `time_online_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `player_id` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT 0,
  `timestamp` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `player_id` (`player_id`),
  CONSTRAINT `FK_3012a9e6027fdc6da6a01bbbc18` FOREIGN KEY (`player_id`) REFERENCES `players` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=5782 DEFAULT CHARSET=utf8mb4;

-- Экспортируемые данные не выделены.

-- Дамп структуры для представление surfgxds.time_online_trend
-- Создание временной таблицы для обработки ошибок зависимостей представлений
CREATE TABLE `time_online_trend` (
	`d` DATE NULL,
	`t` TIME NULL,
	`trend` DECIMAL(42,0) NULL,
	`trendStatus` VARCHAR(4) NULL COLLATE 'utf8mb4_general_ci'
) ENGINE=MyISAM;

-- Дамп структуры для таблица surfgxds.tricks
CREATE TABLE IF NOT EXISTS `tricks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `point` smallint(6) NOT NULL,
  `velocity` tinyint(4) NOT NULL,
  `date_add` timestamp NOT NULL DEFAULT current_timestamp(),
  `author_id` int(11) NOT NULL,
  `map_id` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `map_id` (`map_id`),
  KEY `author_id` (`author_id`),
  CONSTRAINT `FK_2b00e58fd1b5b499fc073df5288` FOREIGN KEY (`map_id`) REFERENCES `maps` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_9d01634ca664e52fd4642831bac` FOREIGN KEY (`author_id`) REFERENCES `players` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=66704 DEFAULT CHARSET=utf8mb4;

-- Экспортируемые данные не выделены.

-- Дамп структуры для представление surfgxds.tricks_route_viewer
-- Создание временной таблицы для обработки ошибок зависимостей представлений
CREATE TABLE `tricks_route_viewer` (
	`id` INT(11) NOT NULL,
	`name` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_general_ci',
	`point` SMALLINT(6) NOT NULL,
	`velocity` TINYINT(4) NOT NULL,
	`date_add` TIMESTAMP NOT NULL,
	`route_str` MEDIUMTEXT NULL COLLATE 'utf8mb4_general_ci',
	`route_id` MEDIUMTEXT NULL COLLATE 'utf8mb4_general_ci',
	`len` BIGINT(21) NULL,
	`author_steamid` VARCHAR(255) NULL COLLATE 'utf8mb4_general_ci',
	`author` VARCHAR(255) NULL COLLATE 'utf8mb4_general_ci',
	`map_id` INT(11) NOT NULL
) ENGINE=MyISAM;

-- Дамп структуры для таблица surfgxds.triggers
CREATE TABLE IF NOT EXISTS `triggers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `alternative_name` varchar(255) DEFAULT NULL,
  `x` float DEFAULT NULL,
  `y` float DEFAULT NULL,
  `z` float DEFAULT NULL,
  `map_id` int(11) NOT NULL DEFAULT 0,
  `src` text DEFAULT NULL,
  PRIMARY KEY (`id`,`name`,`map_id`),
  KEY `map_id` (`map_id`),
  CONSTRAINT `FK_d3bfcc4dc9a73c7f0ffd93fff94` FOREIGN KEY (`map_id`) REFERENCES `maps` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=66696 DEFAULT CHARSET=utf8mb4;

-- Экспортируемые данные не выделены.

-- Дамп структуры для таблица surfgxds.triggers_time_speed_routes
CREATE TABLE IF NOT EXISTS `triggers_time_speed_routes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `complete_id` int(11) DEFAULT NULL,
  `index` int(11) DEFAULT NULL,
  `route_ids` varchar(255) DEFAULT NULL,
  `summary_time` float DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `complete_id` (`complete_id`),
  CONSTRAINT `FK_231b70ebd4c33a9ad7a58a00ffc` FOREIGN KEY (`complete_id`) REFERENCES `completes` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=271446 DEFAULT CHARSET=utf8mb4;

-- Экспортируемые данные не выделены.

-- Дамп структуры для таблица surfgxds.triggers_time_speed_touch
CREATE TABLE IF NOT EXISTS `triggers_time_speed_touch` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `complete_id` int(11) DEFAULT NULL,
  `trigger_before_id` int(11) DEFAULT NULL,
  `trigger_id` int(11) DEFAULT NULL,
  `speed_start` int(11) DEFAULT NULL,
  `speed_end` int(11) DEFAULT NULL,
  `speed_before_max` int(11) DEFAULT NULL,
  `speed_during_max` int(11) DEFAULT NULL,
  `time_before` float DEFAULT NULL,
  `time_during` float DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `trigger_id` (`trigger_id`),
  KEY `trigger_before_id` (`trigger_before_id`),
  KEY `complete_id` (`complete_id`),
  CONSTRAINT `FK_0221a27c17ba5bada48a91a1192` FOREIGN KEY (`complete_id`) REFERENCES `completes` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_3445081e5ee05613d69976dcfed` FOREIGN KEY (`trigger_id`) REFERENCES `triggers` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_43cf04605231afa1c227f184eb5` FOREIGN KEY (`trigger_before_id`) REFERENCES `triggers` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=327676 DEFAULT CHARSET=utf8mb4;

-- Экспортируемые данные не выделены.

-- Дамп структуры для таблица surfgxds.twr
CREATE TABLE IF NOT EXISTS `twr` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `trick_id` int(11) DEFAULT NULL,
  `complete_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `complete_id` (`complete_id`),
  KEY `trick_id` (`trick_id`),
  CONSTRAINT `FK_5712c8138f539870437a0feebba` FOREIGN KEY (`complete_id`) REFERENCES `completes` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_8bafc2c11b175a8058ff361f3e9` FOREIGN KEY (`trick_id`) REFERENCES `tricks` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=742 DEFAULT CHARSET=utf8mb4;

-- Экспортируемые данные не выделены.

-- Дамп структуры для таблица surfgxds.twr_update
CREATE TABLE IF NOT EXISTS `twr_update` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `now_wr` int(11) DEFAULT NULL,
  `before_wr` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `before_wr` (`before_wr`),
  KEY `now_wr` (`now_wr`),
  CONSTRAINT `FK_b69ae6100f5858d641c48e0e50c` FOREIGN KEY (`now_wr`) REFERENCES `completes` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_d16a3e126031d4c74856c70a8a9` FOREIGN KEY (`before_wr`) REFERENCES `completes` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=3457 DEFAULT CHARSET=utf8mb4;

-- Экспортируемые данные не выделены.

-- Дамп структуры для событие surfgxds.worker_leaderboard_cached
DELIMITER //
CREATE EVENT `worker_leaderboard_cached` ON SCHEDULE EVERY 15 MINUTE STARTS '2022-01-26 16:24:51' ON COMPLETION PRESERVE ENABLE DO BEGIN

	START TRANSACTION;
	
		TRUNCATE leaderboard_cached;
		
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
			)
			
			SELECT  *
			FROM result
			ORDER BY place ASC;
			
		END FOR;
		
	COMMIT;
	
END//
DELIMITER ;

-- Дамп структуры для триггер surfgxds.completes_after_insert
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
DELIMITER //
CREATE TRIGGER `completes_after_insert` AFTER INSERT ON `completes` FOR EACH ROW BEGIN 
 
 DECLARE TimeWR FLOAT DEFAULT NULL; 
 DECLARE SpeedWR FLOAT DEFAULT NULL; 
 
 SELECT sc.time  INTO TimeWR  FROM completes sc WHERE sc.id = (SELECT ts.complete_id FROM twr  AS ts WHERE ts.trick_id = NEW.trick_id); 
 SELECT sc.speed INTO SpeedWR FROM completes sc WHERE sc.id = (SELECT ts.complete_id FROM swr AS ts WHERE ts.trick_id = NEW.trick_id); 
 
 IF ISNULL(SpeedWR) THEN 
        INSERT INTO swr(complete_id, trick_id) VALUES(NEW.id, NEW.trick_id); 
        ELSE IF SpeedWR < NEW.speed THEN 
        UPDATE swr ss SET ss.complete_id = NEW.id WHERE ss.trick_id = NEW.trick_id; 
        END IF; 
 END IF; 
 
 IF ISNULL(TimeWR) THEN 
        INSERT INTO twr(complete_id, trick_id) VALUES(NEW.id, NEW.trick_id); 
        ELSE IF TimeWR > NEW.time THEN 
        UPDATE twr st SET st.complete_id = NEW.id WHERE st.trick_id = NEW.trick_id; 
        END IF; 
 END IF; 
 
 END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Дамп структуры для триггер surfgxds.players_after_insert
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
DELIMITER //
CREATE TRIGGER `players_after_insert` AFTER INSERT ON `players` FOR EACH ROW BEGIN 
     INSERT INTO time_online_status(player_id, status) 
     VALUES(NEW.id, 1); 
 END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Дамп структуры для триггер surfgxds.suggested_tricks_after_update
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
DELIMITER //
CREATE TRIGGER `suggested_tricks_after_update` AFTER UPDATE ON `suggested_tricks` FOR EACH ROW BEGIN 
 	#CASE NEW.status	 
 		#WHEN 'accepted' THEN CALL post_accepted_suggested_trick(NEW.id); 
 		#WHEN 'declined' 
 		#WHEN 'pending' 
 	#END CASE; 
 END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Дамп структуры для триггер surfgxds.swr_after_update
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
DELIMITER //
CREATE TRIGGER `swr_after_update` AFTER UPDATE ON `swr` FOR EACH ROW BEGIN 
   INSERT INTO swr_update(now_wr, before_wr)  
 	 VALUES(NEW.complete_id,  
 				(SELECT sc.id  
 				 FROM completes sc  
 				 WHERE sc.trick_id = NEW.trick_id 
 				 AND 
 				 sc.speed  
 				 <  
 				 (SELECT sc1.speed  
 				  FROM completes sc1  
 				  WHERE sc1.id = NEW.complete_id)  
 				  ORDER BY sc.speed DESC LIMIT 1)); 
 END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Дамп структуры для триггер surfgxds.swr_update_after_delete
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
DELIMITER //
CREATE TRIGGER `swr_update_after_delete` AFTER DELETE ON `swr_update` FOR EACH ROW BEGIN 
 	IF ((SELECT wr.trick_id FROM twr wr WHERE wr.trick_id = (SELECT c.trick_id FROM completes c WHERE c.id = OLD.now_wr)) IS NULL) 
 		THEN INSERT INTO twr(trick_id, complete_id) VALUES((SELECT c.trick_id FROM completes c WHERE c.id = OLD.now_wr), OLD.before_wr); 
 	END IF; 
 END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Дамп структуры для триггер surfgxds.swr_update_before_delete
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
DELIMITER //
CREATE TRIGGER `swr_update_before_delete` BEFORE DELETE ON `swr_update` FOR EACH ROW BEGIN 
 	IF ((SELECT c.id FROM completes c WHERE c.id = OLD.before_wr) IS NULL) 
 		THEN INSERT INTO swr_update(now_wr, before_wr) VALUES((SELECT uwr.before_wr FROM swr_update uwr WHERE uwr.now_wr = OLD.before_wr), OLD.now_wr); 
 	END IF; 
 END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Дамп структуры для триггер surfgxds.time_online_status_before_update
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
DELIMITER //
CREATE TRIGGER `time_online_status_before_update` BEFORE UPDATE ON `time_online_status` FOR EACH ROW BEGIN 
 	DECLARE time_stamp TIMESTAMP; 
 	IF (NEW.status = 0) THEN 
 		SELECT tos.timestamp INTO time_stamp 
 		FROM time_online_status AS tos  
 		WHERE tos.player_id = new.player_id && tos.status = 1  
 		ORDER BY tos.timestamp DESC  
 		LIMIT 1; 
 
 		INSERT INTO time_online(player_id,time,time_join,time_left)  
 		VALUES(new.player_id,SEC_TO_TIME(UNIX_TIMESTAMP(NEW.timestamp) - UNIX_TIMESTAMP(time_stamp)),time_stamp,NEW.timestamp); 
 	END IF; 
 END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Дамп структуры для триггер surfgxds.triggers_time_speed_touch_after_insert
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
DELIMITER //
CREATE TRIGGER `triggers_time_speed_touch_after_insert` AFTER INSERT ON `triggers_time_speed_touch` FOR EACH ROW BEGIN 
 	DECLARE before_route_ids TEXT DEFAULT NULL; 
 	DECLARE last_index INT DEFAULT NULL; 
 	DECLARE last_time FLOAT DEFAULT 0.0; 
 	#DECLARE last_speed INT DEFAULT 0; NOT IMPLEMENTED 
 
 	SELECT sttsr.route_ids INTO before_route_ids 
 	FROM triggers_time_speed_routes sttsr 
 	WHERE sttsr.complete_id = NEW.complete_id 
 	ORDER BY sttsr.route_ids DESC 
 	LIMIT 1; 
 
 	SELECT sttsr.index INTO last_index 
 	FROM triggers_time_speed_routes sttsr 
 	WHERE sttsr.complete_id = NEW.complete_id  
 	ORDER BY sttsr.route_ids DESC 
 	LIMIT 1; 
 
 	SELECT sttsr.summary_time INTO last_time 
 	FROM triggers_time_speed_routes sttsr 
 	WHERE sttsr.complete_id = NEW.complete_id 
 	ORDER BY sttsr.route_ids DESC 
 	LIMIT 1; 
 
 	#SELECT lc.summary_speed INTO last_speed; NOT IMPLEMENTED 
 
 	INSERT INTO triggers_time_speed_routes(complete_id,`index`,route_ids,summary_time) 
 	VALUES(NEW.complete_id, 
 		   if(last_index IS NULL,0,last_index + 1),  
 		   if(before_route_ids IS NULL,NEW.trigger_id,CONCAT(before_route_ids,',',NEW.trigger_id)), 
 	       last_time + NEW.time_before + NEW.time_during); 
 END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Дамп структуры для триггер surfgxds.twr_after_update
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
DELIMITER //
CREATE TRIGGER `twr_after_update` AFTER UPDATE ON `twr` FOR EACH ROW BEGIN 
 	INSERT INTO twr_update(now_wr,before_wr)  
 	VALUES(NEW.complete_id,  
 			(SELECT sc.id  
 			 FROM completes sc  
 			 WHERE sc.trick_id = NEW.trick_id 
 			 AND 
 			 sc.time 
 			 > 
 			 (SELECT sc1.time  
 			  FROM completes sc1  
 			  WHERE sc1.id = NEW.complete_id)  
 			   ORDER BY sc.time ASC LIMIT 1)); 
 END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Дамп структуры для триггер surfgxds.twr_update_after_delete
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
DELIMITER //
CREATE TRIGGER `twr_update_after_delete` AFTER DELETE ON `twr_update` FOR EACH ROW BEGIN 
 	IF ((SELECT wr.trick_id FROM twr wr WHERE wr.trick_id = (SELECT c.trick_id FROM completes c WHERE c.id = OLD.now_wr)) IS NULL) 
 		THEN INSERT INTO twr(trick_id, complete_id) VALUES((SELECT c.trick_id FROM completes c WHERE c.id = OLD.now_wr), OLD.before_wr); 
 	END IF; 
 END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Дамп структуры для триггер surfgxds.twr_update_before_delete
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
DELIMITER //
CREATE TRIGGER `twr_update_before_delete` BEFORE DELETE ON `twr_update` FOR EACH ROW BEGIN 
 		IF ((SELECT c.id FROM completes c WHERE c.id = OLD.before_wr) IS NULL) 
 			THEN INSERT INTO twr_update(now_wr, before_wr) VALUES((SELECT uwr.before_wr FROM twr_update uwr WHERE uwr.now_wr = OLD.before_wr), OLD.now_wr); 
 		END IF; 
 END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Дамп структуры для представление surfgxds.suggested_tricks_route_viewer
-- Удаление временной таблицы и создание окончательной структуры представления
DROP TABLE IF EXISTS `suggested_tricks_route_viewer`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `suggested_tricks_route_viewer` AS select `st`.`status` AS `status`,`st`.`date_modify` AS `date_modify`,`st`.`id` AS `id`,`st`.`name` AS `name`,`st`.`point` AS `point`,`st`.`velocity` AS `velocity`,`st`.`date_add` AS `date_add`,`st`.`author_id` AS `author_id`,`p`.`steamid64` AS `author_steamid`,(select `p`.`nick` from `players` `p` where `p`.`id` = `st`.`author_id`) AS `author_nick`,(select group_concat(`str`.`name` separator ',') from ((`suggested_tricks` `ts` join `suggested_routes` `sr` on(`ts`.`id` = `sr`.`trick_id`)) join `triggers` `str` on(`str`.`id` = `sr`.`trigger_id`)) where `ts`.`id` = `st`.`id`) AS `route_str`,(select group_concat(`str`.`id` separator ',') from ((`suggested_tricks` `ts` join `suggested_routes` `sr` on(`ts`.`id` = `sr`.`trick_id`)) join `triggers` `str` on(`str`.`id` = `sr`.`trigger_id`)) where `ts`.`id` = `st`.`id`) AS `route_id`,(select count(`sr`.`id`) from (`suggested_tricks` `ts` join `suggested_routes` `sr` on(`ts`.`id` = `sr`.`trick_id`)) where `ts`.`id` = `st`.`id`) AS `len`,`st`.`map_id` AS `map_id` from (`suggested_tricks` `st` join `players` `p` on(`p`.`id` = `st`.`author_id`));

-- Дамп структуры для представление surfgxds.time_online_trend
-- Удаление временной таблицы и создание окончательной структуры представления
DROP TABLE IF EXISTS `time_online_trend`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `time_online_trend` AS select cast(`t`.`time_join` as date) AS `d`,sec_to_time(sum(time_to_sec(`t`.`time`))) AS `t`,round(sum(time_to_sec(`t`.`time`)) * 100 / (select round(avg(`a`.`t`),0) from (select sum(time_to_sec(`t`.`time`)) AS `t` from `surfgxds`.`time_online` `t` group by cast(`t`.`time_join` as date)) `a`),0) AS `trend`,if((select round(avg(`a`.`t`),0) from (select sum(time_to_sec(`t`.`time`)) AS `t` from `surfgxds`.`time_online` `t` group by cast(`t`.`time_join` as date)) `a`) > sum(time_to_sec(`t`.`time`)),'down','up') AS `trendStatus` from `surfgxds`.`time_online` `t` group by cast(`t`.`time_join` as date) order by cast(`t`.`time_join` as date) desc;

-- Дамп структуры для представление surfgxds.tricks_route_viewer
-- Удаление временной таблицы и создание окончательной структуры представления
DROP TABLE IF EXISTS `tricks_route_viewer`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `tricks_route_viewer` AS select `st`.`id` AS `id`,`st`.`name` AS `name`,`st`.`point` AS `point`,`st`.`velocity` AS `velocity`,`st`.`date_add` AS `date_add`,(select group_concat(`str`.`name` separator ',') from ((`tricks` `ts` join `routes` `sr` on(`ts`.`id` = `sr`.`trick_id`)) join `triggers` `str` on(`str`.`id` = `sr`.`trigger_id`)) where `ts`.`id` = `st`.`id`) AS `route_str`,(select group_concat(`str`.`id` separator ',') from ((`tricks` `ts` join `routes` `sr` on(`ts`.`id` = `sr`.`trick_id`)) join `triggers` `str` on(`str`.`id` = `sr`.`trigger_id`)) where `ts`.`id` = `st`.`id`) AS `route_id`,(select count(`sr`.`id`) from (`tricks` `ts` join `routes` `sr` on(`ts`.`id` = `sr`.`trick_id`)) where `ts`.`id` = `st`.`id`) AS `len`,`p`.`steamid64` AS `author_steamid`,`p`.`nick` AS `author`,`st`.`map_id` AS `map_id` from (`tricks` `st` left join `players` `p` on(`p`.`id` = `st`.`author_id`));

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
