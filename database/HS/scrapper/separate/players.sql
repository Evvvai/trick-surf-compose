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

-- Дамп структуры для таблица surfgxds.players
CREATE TABLE IF NOT EXISTS `players` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `steamid` varchar(255) DEFAULT NULL,
  `steamid64` varchar(255) DEFAULT NULL,
  `nick` varchar(255) NOT NULL,
  `profileurl` text DEFAULT NULL,
  `avatarfull` text DEFAULT NULL,
  `avatarCustom` text DEFAULT NULL,
  `dashboard` text DEFAULT NULL,
  `date_joined` timestamp NULL DEFAULT current_timestamp(),
  `last_login_site` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `last_login_server` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `role` enum('player','premium','admin') NOT NULL DEFAULT 'player',
  PRIMARY KEY (`id`),
  UNIQUE KEY `steamid64` (`steamid64`),
  UNIQUE KEY `steamid` (`steamid`),
  UNIQUE KEY `IDX_4d5c6d5822db73a234f3c7000a` (`steamid`),
  UNIQUE KEY `IDX_ddcfdb3c5716388556da8e1482` (`steamid64`)
) ENGINE=InnoDB AUTO_INCREMENT=5811 DEFAULT CHARSET=utf8mb4;

-- Экспортируемые данные не выделены.

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
