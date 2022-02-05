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

-- Дамп структуры для представление surfgxds.tricks_route_viewer
-- Удаление временной таблицы и создание окончательной структуры представления
DROP TABLE IF EXISTS `tricks_route_viewer`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `tricks_route_viewer` AS select `st`.`id` AS `id`,`st`.`name` AS `name`,`st`.`point` AS `point`,`st`.`velocity` AS `velocity`,`st`.`date_add` AS `date_add`,(select group_concat(`str`.`name` separator ',') from ((`tricks` `ts` join `routes` `sr` on(`ts`.`id` = `sr`.`trick_id`)) join `triggers` `str` on(`str`.`id` = `sr`.`trigger_id`)) where `ts`.`id` = `st`.`id`) AS `route_str`,(select group_concat(`str`.`id` separator ',') from ((`tricks` `ts` join `routes` `sr` on(`ts`.`id` = `sr`.`trick_id`)) join `triggers` `str` on(`str`.`id` = `sr`.`trigger_id`)) where `ts`.`id` = `st`.`id`) AS `route_id`,(select count(`sr`.`id`) from (`tricks` `ts` join `routes` `sr` on(`ts`.`id` = `sr`.`trick_id`)) where `ts`.`id` = `st`.`id`) AS `len`,`p`.`steamid64` AS `author_steamid`,`p`.`nick` AS `author`,`st`.`map_id` AS `map_id` from (`tricks` `st` left join `players` `p` on(`p`.`id` = `st`.`author_id`));

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
