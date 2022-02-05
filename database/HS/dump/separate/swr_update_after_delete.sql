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

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
