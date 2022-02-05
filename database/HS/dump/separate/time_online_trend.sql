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

-- Дамп структуры для представление surfgxds.time_online_trend
-- Удаление временной таблицы и создание окончательной структуры представления
DROP TABLE IF EXISTS `time_online_trend`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `time_online_trend` AS select cast(`t`.`time_join` as date) AS `d`,sec_to_time(sum(time_to_sec(`t`.`time`))) AS `t`,round(sum(time_to_sec(`t`.`time`)) * 100 / (select round(avg(`a`.`t`),0) from (select sum(time_to_sec(`t`.`time`)) AS `t` from `surfgxds`.`time_online` `t` group by cast(`t`.`time_join` as date)) `a`),0) AS `trend`,if((select round(avg(`a`.`t`),0) from (select sum(time_to_sec(`t`.`time`)) AS `t` from `surfgxds`.`time_online` `t` group by cast(`t`.`time_join` as date)) `a`) > sum(time_to_sec(`t`.`time`)),'down','up') AS `trendStatus` from `surfgxds`.`time_online` `t` group by cast(`t`.`time_join` as date) order by cast(`t`.`time_join` as date) desc;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
