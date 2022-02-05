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

-- Дамп структуры для таблица surfgxds.tricks
CREATE TABLE IF NOT EXISTS `tricks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `point` smallint(6) NOT NULL,
  `velocity` tinyint(4) NOT NULL,
  `date_add` timestamp NOT NULL DEFAULT current_timestamp(),
  `author_id` int(11) NOT NULL,
  `map_id` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `map_id` (`map_id`),
  KEY `author_id` (`author_id`),
  CONSTRAINT `FK_2b00e58fd1b5b499fc073df5288` FOREIGN KEY (`map_id`) REFERENCES `maps` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_9d01634ca664e52fd4642831bac` FOREIGN KEY (`author_id`) REFERENCES `players` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=66704 DEFAULT CHARSET=utf8mb4;

-- Экспортируемые данные не выделены.

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
