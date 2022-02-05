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

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
