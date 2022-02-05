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

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
