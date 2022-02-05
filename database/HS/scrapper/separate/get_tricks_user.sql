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

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
