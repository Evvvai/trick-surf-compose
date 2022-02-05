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

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
