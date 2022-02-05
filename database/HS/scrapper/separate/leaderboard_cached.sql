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

-- Дамп структуры для таблица surfgxds.leaderboard_cached
CREATE TABLE IF NOT EXISTS `leaderboard_cached` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `steamid64` varchar(255) NOT NULL,
  `nick` varchar(255) NOT NULL,
  `ac` int(11) NOT NULL,
  `ap` int(11) NOT NULL,
  `up` int(11) NOT NULL,
  `uc` int(11) NOT NULL,
  `avg` varchar(255) NOT NULL,
  `place` int(11) NOT NULL,
  `map_id` int(11) NOT NULL,
  `player_id` int(11) NOT NULL,
  `ac_place` int(11) NOT NULL,
  `ap_place` int(11) NOT NULL,
  `up_place` int(11) NOT NULL,
  `uc_place` int(11) NOT NULL,
  `completes_percent` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=529 DEFAULT CHARSET=utf8mb4;

-- Экспортируемые данные не выделены.

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
