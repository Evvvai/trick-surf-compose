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

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
