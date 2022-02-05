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

-- Дамп структуры для таблица surfgxds.triggers_time_speed_touch
CREATE TABLE IF NOT EXISTS `triggers_time_speed_touch` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `complete_id` int(11) DEFAULT NULL,
  `trigger_before_id` int(11) DEFAULT NULL,
  `trigger_id` int(11) DEFAULT NULL,
  `speed_start` int(11) DEFAULT NULL,
  `speed_end` int(11) DEFAULT NULL,
  `speed_before_max` int(11) DEFAULT NULL,
  `speed_during_max` int(11) DEFAULT NULL,
  `time_before` float DEFAULT NULL,
  `time_during` float DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `trigger_id` (`trigger_id`),
  KEY `trigger_before_id` (`trigger_before_id`),
  KEY `complete_id` (`complete_id`),
  CONSTRAINT `FK_0221a27c17ba5bada48a91a1192` FOREIGN KEY (`complete_id`) REFERENCES `completes` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_3445081e5ee05613d69976dcfed` FOREIGN KEY (`trigger_id`) REFERENCES `triggers` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_43cf04605231afa1c227f184eb5` FOREIGN KEY (`trigger_before_id`) REFERENCES `triggers` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=327676 DEFAULT CHARSET=utf8mb4;

-- Экспортируемые данные не выделены.

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
