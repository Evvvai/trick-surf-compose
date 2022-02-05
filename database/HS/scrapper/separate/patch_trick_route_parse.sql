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

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
