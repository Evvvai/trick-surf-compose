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

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
