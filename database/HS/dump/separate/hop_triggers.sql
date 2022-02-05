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

-- Дамп структуры для таблица surfgxds.hop_triggers
CREATE TABLE IF NOT EXISTS `hop_triggers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `trigger_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `trick_id` (`trigger_id`),
  CONSTRAINT `FK_a1914ce3a88ecbe7b9361b67343` FOREIGN KEY (`trigger_id`) REFERENCES `triggers` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4;

-- Дамп данных таблицы surfgxds.hop_triggers: ~16 rows (приблизительно)
/*!40000 ALTER TABLE `hop_triggers` DISABLE KEYS */;
INSERT INTO `hop_triggers` (`id`, `trigger_id`) VALUES
	(5, 8),
	(14, 8),
	(11, 10),
	(15, 15),
	(9, 19),
	(1, 33),
	(7, 36),
	(8, 37),
	(13, 44),
	(4, 87),
	(10, 134),
	(16, 421),
	(12, 584),
	(3, 6669),
	(2, 66626),
	(6, 66633);
/*!40000 ALTER TABLE `hop_triggers` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
