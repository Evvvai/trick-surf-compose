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

-- Дамп структуры для процедура surfgxds.post_accepted_suggested_trick
DELIMITER //
CREATE PROCEDURE `post_accepted_suggested_trick`(
            IN p_suggest_id INT
        )
BEGIN

            DECLARE Leng INT DEFAULT NULL;
            DECLARE Route TEXT;
            DECLARE TrickId INT DEFAULT NULL;
            
            SELECT sstrv.route_str INTO Route
            FROM suggested_tricks_route_viewer sstrv 
            WHERE sstrv.id = p_suggest_id;

            SELECT sstrv.len INTO Leng
            FROM suggested_tricks_route_viewer sstrv 
            WHERE sstrv.id = p_suggest_id;
            
            INSERT 
            INTO tricks(name, point, velocity, author_id)
            SELECT sstrv.name, sstrv.point, sstrv.velocity, sstrv.author_id
            FROM suggested_tricks_route_viewer sstrv 
            WHERE sstrv.id = p_suggest_id;
            
            SELECT st.id INTO TrickId
            FROM tricks st 
            ORDER BY st.id DESC
            LIMIT 1;
            
            SET @LengLoop := 0;
            while @LengLoop < Leng do 
            
                SET @tr := SUBSTRING_INDEX(Route,',',1);
                SET @tr_id := (SELECT tst.id FROM triggers tst WHERE tst.name = @tr);
                INSERT INTO routes (trick_id,trigger_id) VALUES(TrickId,@tr_id);	                                                     	
                SET Route = SUBSTR(Route,LOCATE(',',Route)+1,LENGTH(Route));
            
            set @LengLoop:=@LengLoop+1; 
            end while;

        END//
DELIMITER ;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
