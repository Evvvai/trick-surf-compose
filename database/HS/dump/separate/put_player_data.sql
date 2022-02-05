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

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
