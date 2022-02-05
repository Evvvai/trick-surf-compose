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

-- Дамп структуры для таблица surfgxds.suggested_tricks_rates
CREATE TABLE IF NOT EXISTS `suggested_tricks_rates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `trick_id` int(11) NOT NULL,
  `player_id` int(11) NOT NULL,
  `rate` enum('up','down') NOT NULL,
  `date_add` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `player_id` (`trick_id`),
  KEY `trick_id` (`player_id`),
  CONSTRAINT `FK_9cb0f4a8a26f6cc5bf55bde41ed` FOREIGN KEY (`player_id`) REFERENCES `players` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_a57a0055b9f5d60ef3e064fd8e6` FOREIGN KEY (`trick_id`) REFERENCES `suggested_tricks` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4;

-- Дамп данных таблицы surfgxds.suggested_tricks_rates: ~40 rows (приблизительно)
/*!40000 ALTER TABLE `suggested_tricks_rates` DISABLE KEYS */;
INSERT INTO `suggested_tricks_rates` (`id`, `trick_id`, `player_id`, `rate`, `date_add`) VALUES
	(1, 1, 1, 'up', '2022-01-24 19:22:11'),
	(2, 1, 4267, 'up', '2022-01-24 19:22:20'),
	(3, 16, 1, 'up', '2022-01-25 18:18:25'),
	(4, 17, 1, 'up', '2022-01-25 18:21:18'),
	(5, 22, 4267, 'up', '2022-01-25 16:19:39'),
	(6, 23, 4267, 'up', '2022-01-25 16:28:11'),
	(7, 24, 1, 'up', '2022-01-25 20:27:05'),
	(8, 25, 1, 'down', '2022-01-25 21:07:36'),
	(9, 26, 1, 'up', '2022-01-25 22:09:03'),
	(10, 27, 1, 'down', '2022-01-25 22:46:52'),
	(11, 28, 1, 'up', '2022-01-25 23:01:05'),
	(12, 29, 2, 'up', '2022-01-26 16:47:42'),
	(13, 33, 4267, 'up', '2022-01-26 20:15:07'),
	(14, 39, 4267, 'up', '2022-01-28 10:18:53'),
	(15, 42, 4267, 'up', '2022-01-28 10:58:24'),
	(16, 44, 4267, 'up', '2022-01-28 11:19:47'),
	(17, 45, 4267, 'up', '2022-01-28 11:34:10'),
	(18, 46, 4267, 'up', '2022-01-28 11:45:04'),
	(19, 47, 4267, 'up', '2022-01-28 11:45:54'),
	(20, 48, 4267, 'up', '2022-01-28 12:03:21'),
	(21, 49, 1, 'up', '2022-01-28 13:54:01'),
	(22, 50, 1, 'down', '2022-01-28 14:04:23'),
	(23, 52, 1, 'up', '2022-01-28 14:10:40'),
	(24, 56, 1, 'up', '2022-01-28 14:29:04'),
	(25, 55, 1, 'up', '2022-01-28 14:29:07'),
	(26, 57, 1, 'up', '2022-01-28 19:28:58'),
	(27, 58, 1, 'up', '2022-01-28 19:36:29'),
	(28, 59, 1, 'up', '2022-01-28 19:45:24'),
	(29, 60, 4267, 'up', '2022-01-30 19:17:53'),
	(30, 61, 1, 'down', '2022-01-30 20:16:09'),
	(31, 62, 129, 'up', '2022-01-30 20:27:32'),
	(32, 63, 1, 'down', '2022-01-30 20:28:09'),
	(33, 62, 1, 'down', '2022-01-30 20:28:13'),
	(34, 64, 129, 'up', '2022-01-30 21:01:38'),
	(35, 64, 1, 'down', '2022-01-30 21:01:52'),
	(36, 65, 1, 'up', '2022-01-30 21:14:38'),
	(37, 67, 1, 'up', '2022-01-31 16:04:16'),
	(38, 68, 1, 'up', '2022-01-31 16:08:11'),
	(39, 73, 1, 'down', '2022-02-01 11:55:53'),
	(40, 74, 1, 'up', '2022-02-01 20:38:39');
/*!40000 ALTER TABLE `suggested_tricks_rates` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
