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

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
