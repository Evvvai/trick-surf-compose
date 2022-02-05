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

-- Дамп структуры для таблица surfgxds.swr_update
CREATE TABLE IF NOT EXISTS `swr_update` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `now_wr` int(11) DEFAULT NULL,
  `before_wr` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `before_wr` (`before_wr`),
  KEY `now_wr` (`now_wr`),
  CONSTRAINT `FK_22fa1b15611ff5bd680cab89bef` FOREIGN KEY (`before_wr`) REFERENCES `completes` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_a72dbebd84f5970c5b7c6964b28` FOREIGN KEY (`now_wr`) REFERENCES `completes` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=2766 DEFAULT CHARSET=utf8mb4;

-- Экспортируемые данные не выделены.

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
