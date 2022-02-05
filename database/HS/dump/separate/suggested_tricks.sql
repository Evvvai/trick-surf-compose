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

-- Дамп структуры для таблица surfgxds.suggested_tricks
CREATE TABLE IF NOT EXISTS `suggested_tricks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `point` int(11) NOT NULL,
  `velocity` int(11) NOT NULL,
  `date_add` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_modify` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('pending','accepted','declined') NOT NULL DEFAULT 'pending',
  `author_id` int(11) NOT NULL,
  `map_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `IDX_20c8407f70f1229f144f18d386` (`name`),
  KEY `map_id` (`map_id`),
  KEY `author_id` (`author_id`),
  CONSTRAINT `FK_34da9e6aa2afa88687df3fbd336` FOREIGN KEY (`author_id`) REFERENCES `players` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_5fd9ae7f93cbcd47a04061c70d5` FOREIGN KEY (`map_id`) REFERENCES `maps` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4;

-- Дамп данных таблицы surfgxds.suggested_tricks: ~67 rows (приблизительно)
/*!40000 ALTER TABLE `suggested_tricks` DISABLE KEYS */;
INSERT INTO `suggested_tricks` (`id`, `name`, `point`, `velocity`, `date_add`, `date_modify`, `status`, `author_id`, `map_id`) VALUES
	(1, 'Banana T2 Walk', 500, 0, '2022-01-24 19:22:04', '2022-01-24 19:23:08', 'accepted', 4267, 2),
	(2, 'Gore', 1400, 0, '2022-01-24 20:58:56', '2022-01-24 21:12:56', 'accepted', 4267, 2),
	(3, 'David Blane', 500, 0, '2022-01-24 21:01:32', '2022-01-24 21:12:58', 'accepted', 4267, 2),
	(4, 'Shackles', 800, 0, '2022-01-24 21:04:34', '2022-01-24 21:13:01', 'accepted', 4267, 2),
	(5, 'Rollercoaster', 550, 0, '2022-01-24 21:07:52', '2022-01-24 21:13:03', 'accepted', 4267, 2),
	(6, 'Dirtbag', 450, 0, '2022-01-24 21:09:12', '2022-01-24 21:13:06', 'accepted', 4267, 2),
	(7, 'High Falos Return', 450, 0, '2022-01-24 21:42:15', '2022-01-24 21:42:18', 'accepted', 4267, 2),
	(10, 'Dirtbagg', 450, 0, '2022-01-24 21:50:41', '2022-01-24 21:50:43', 'accepted', 4267, 2),
	(12, 'Shackless', 800, 0, '2022-01-24 22:40:29', '2022-01-24 22:40:32', 'accepted', 4267, 2),
	(13, 'Banana T2 Walkk', 550, 0, '2022-01-25 11:26:44', '2022-01-25 11:26:47', 'declined', 4267, 2),
	(14, 'Bowser', 550, 0, '2022-01-25 11:38:36', '2022-01-25 11:38:45', 'accepted', 4267, 2),
	(15, 'Fur Elise', 900, 0, '2022-01-25 11:54:48', '2022-01-25 11:54:55', 'accepted', 4267, 2),
	(16, 'No Pain No Gain', 1250, 0, '2022-01-25 14:13:36', '2022-01-25 15:00:07', 'accepted', 4267, 2),
	(17, 'Sonic', 550, 0, '2022-01-25 14:19:02', '2022-01-25 15:00:02', 'accepted', 4267, 2),
	(18, 'Airwalk', 750, 0, '2022-01-25 14:43:57', '2022-01-25 14:44:27', 'declined', 4267, 2),
	(20, 'Airwalkk', 750, 0, '2022-01-25 14:46:04', '2022-01-25 14:46:11', 'accepted', 4267, 2),
	(21, 'Sickness', 1050, 0, '2022-01-25 15:58:12', '2022-01-25 15:58:15', 'accepted', 4267, 2),
	(22, 'Way Out ', 800, 0, '2022-01-25 16:19:36', '2022-01-25 16:19:49', 'accepted', 4267, 2),
	(23, 'Old Ways', 700, 0, '2022-01-25 16:28:07', '2022-01-25 16:28:12', 'accepted', 4267, 2),
	(24, 'Lets all love lain', 250, 0, '2022-01-25 20:26:55', '2022-01-25 20:30:09', 'accepted', 1, 2),
	(25, 'Alxitector', 500, 0, '2022-01-25 21:07:30', '2022-01-25 21:07:37', 'accepted', 1, 2),
	(26, 'Lamba', 400, 0, '2022-01-25 22:08:51', '2022-01-25 22:09:10', 'accepted', 1, 2),
	(27, 'Anaconda', 250, 0, '2022-01-25 22:46:49', '2022-01-25 22:46:53', 'accepted', 1, 2),
	(28, 'Turtle return', 150, 0, '2022-01-25 23:01:01', '2022-01-25 23:01:06', 'accepted', 1, 2),
	(29, 'Bangarang Boomerang', 1150, 0, '2022-01-26 16:47:38', '2022-01-26 16:50:09', 'accepted', 2, 2),
	(30, 'Guts', 550, 0, '2022-01-26 17:46:50', '2022-01-26 17:46:53', 'accepted', 2, 2),
	(31, 'Sad Return', 950, 0, '2022-01-26 18:05:40', '2022-01-26 18:05:43', 'accepted', 2, 2),
	(32, 'Pain Stretch', 700, 0, '2022-01-26 19:45:12', '2022-01-26 19:51:39', 'declined', 4267, 2),
	(33, 'Perfume', 600, 0, '2022-01-26 20:15:05', '2022-01-26 20:15:08', 'accepted', 4267, 2),
	(34, 'V7 PoXYZ', 600, 0, '2022-01-26 20:30:53', '2022-01-26 20:30:56', 'accepted', 4267, 2),
	(35, 'Hole', 700, 0, '2022-01-26 20:31:02', '2022-01-26 20:55:51', 'declined', 482, 2),
	(36, 'Perfumee', 800, 0, '2022-01-26 20:55:25', '2022-01-26 20:55:28', 'accepted', 4267, 2),
	(37, 'Left Right At Home', 800, 0, '2022-01-26 21:28:04', '2022-01-26 21:28:11', 'accepted', 4267, 2),
	(38, 'Prisoner of Azkaban', 850, 0, '2022-01-26 21:30:58', '2022-01-26 21:31:06', 'accepted', 4267, 2),
	(39, 'Ninja Turtle', 750, 0, '2022-01-28 10:18:50', '2022-01-28 10:18:53', 'accepted', 4267, 2),
	(40, 'Kindred', 900, 0, '2022-01-28 10:49:10', '2022-01-28 10:49:13', 'accepted', 4267, 2),
	(42, 'Kindredd', 850, 0, '2022-01-28 10:58:19', '2022-01-28 10:58:25', 'accepted', 4267, 2),
	(43, 'Turtle Stretch', 700, 0, '2022-01-28 11:05:07', '2022-01-28 11:05:10', 'accepted', 4267, 2),
	(44, 'The Unknown', 950, 0, '2022-01-28 11:19:44', '2022-01-28 11:19:47', 'accepted', 4267, 2),
	(45, 'Turtle Hop', 350, 0, '2022-01-28 11:34:08', '2022-01-28 11:34:11', 'accepted', 4267, 2),
	(46, 'Prisoner Escape', 600, 0, '2022-01-28 11:45:00', '2022-01-28 11:45:05', 'accepted', 4267, 2),
	(47, 'Hard Prisoner Escape', 900, 0, '2022-01-28 11:45:52', '2022-01-28 11:45:55', 'accepted', 4267, 2),
	(48, 'Jeweler', 1100, 0, '2022-01-28 12:03:19', '2022-01-28 12:03:22', 'accepted', 4267, 2),
	(49, 'Paketik', 100, 0, '2022-01-28 13:53:57', '2022-01-28 13:54:02', 'accepted', 1, 2),
	(50, 'Penetrator', 350, 0, '2022-01-28 14:04:21', '2022-01-28 14:04:24', 'declined', 1, 2),
	(51, 'T2 Banana Walk', 600, 0, '2022-01-28 14:08:00', '2022-01-28 14:08:03', 'accepted', 4267, 2),
	(52, 'Holemaero', 250, 0, '2022-01-28 14:10:29', '2022-01-28 14:10:41', 'declined', 1, 2),
	(55, 'DirtBaggg', 550, 0, '2022-01-28 14:28:58', '2022-01-28 14:29:05', 'accepted', 4267, 2),
	(56, 'Xristos', 400, 0, '2022-01-28 14:29:01', '2022-01-28 14:29:05', 'accepted', 1, 2),
	(57, 'Yakov', 250, 0, '2022-01-28 19:28:52', '2022-01-28 19:28:59', 'accepted', 1, 2),
	(58, 'Dirokol', 900, 0, '2022-01-28 19:36:25', '2022-01-28 19:36:30', 'accepted', 1, 2),
	(59, 'Pounce in window', 250, 0, '2022-01-28 19:45:21', '2022-01-28 19:45:26', 'accepted', 1, 2),
	(60, 'Papaya', 700, 0, '2022-01-30 19:17:49', '2022-01-30 19:17:54', 'accepted', 4267, 2),
	(61, 'Xtml', 250, 0, '2022-01-30 20:16:06', '2022-01-30 20:16:10', 'accepted', 1, 2),
	(62, 'blessed', 600, 0, '2022-01-30 20:27:21', '2022-01-30 20:28:32', 'accepted', 129, 2),
	(63, 'GraphQl', 400, 0, '2022-01-30 20:27:58', '2022-01-30 20:28:14', 'accepted', 1, 2),
	(64, 'see me again', 900, 0, '2022-01-30 21:01:30', '2022-01-30 21:01:53', 'accepted', 129, 2),
	(65, 'Trixter', 400, 0, '2022-01-30 21:14:35', '2022-01-30 21:14:38', 'accepted', 1, 2),
	(66, 'Pelmen', 700, 0, '2022-01-30 21:35:23', '2022-01-30 21:35:31', 'accepted', 4267, 2),
	(67, 'Artur', 600, 0, '2022-01-31 16:03:39', '2022-01-31 16:04:20', 'accepted', 482, 2),
	(68, 'Pertuh', 500, 0, '2022-01-31 16:07:07', '2022-01-31 16:08:13', 'accepted', 482, 2),
	(69, 'Cucumber', 800, 0, '2022-01-31 16:42:45', '2022-01-31 16:42:51', 'accepted', 482, 2),
	(70, 'Lagger jump ', 300, 0, '2022-01-31 17:08:03', '2022-01-31 17:08:07', 'accepted', 482, 2),
	(71, 'Hard Strafe', 1100, 0, '2022-01-31 19:54:34', '2022-01-31 19:54:38', 'accepted', 482, 2),
	(72, 'Gooseberry', 1000, 0, '2022-01-31 20:06:07', '2022-01-31 21:19:20', 'accepted', 482, 2),
	(73, 'Flail', 600, 0, '2022-02-01 11:55:50', '2022-02-01 15:20:42', 'accepted', 1, 2),
	(74, 'Zapaska return', 500, 0, '2022-02-01 20:38:36', '2022-02-01 20:38:40', 'accepted', 1, 2);
/*!40000 ALTER TABLE `suggested_tricks` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
