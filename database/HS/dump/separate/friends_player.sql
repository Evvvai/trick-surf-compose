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

-- Дамп структуры для таблица surfgxds.friends_player
CREATE TABLE IF NOT EXISTS `friends_player` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `playerId` int(11) NOT NULL,
  `friendId` int(11) NOT NULL,
  `since` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  PRIMARY KEY (`id`),
  KEY `FK_friend_player_friend` (`friendId`),
  KEY `FK_friend_player_player` (`playerId`),
  CONSTRAINT `FK_1b08c8df288e9c4bf4e8286256e` FOREIGN KEY (`playerId`) REFERENCES `players` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_bbf9336d02627c811a749025573` FOREIGN KEY (`friendId`) REFERENCES `players` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=115 DEFAULT CHARSET=utf8mb4;

-- Дамп данных таблицы surfgxds.friends_player: ~114 rows (приблизительно)
/*!40000 ALTER TABLE `friends_player` DISABLE KEYS */;
INSERT INTO `friends_player` (`id`, `playerId`, `friendId`, `since`) VALUES
	(1, 1, 122, '2022-01-24 19:32:55.394284'),
	(2, 122, 1, '2022-01-24 19:32:55.402080'),
	(3, 1, 9, '2022-01-24 19:32:55.413106'),
	(4, 9, 1, '2022-01-24 19:32:55.419103'),
	(5, 1, 5018, '2022-01-24 19:32:55.423824'),
	(6, 5018, 1, '2022-01-24 19:32:55.429462'),
	(7, 1, 13, '2022-01-24 19:32:55.434258'),
	(8, 13, 1, '2022-01-24 19:32:55.438710'),
	(9, 1, 4662, '2022-01-24 19:32:55.445997'),
	(10, 4662, 1, '2022-01-24 19:32:55.456266'),
	(11, 1, 73, '2022-01-24 19:32:55.460985'),
	(12, 73, 1, '2022-01-24 19:32:55.465861'),
	(13, 1, 15, '2022-01-24 19:32:55.470535'),
	(14, 15, 1, '2022-01-24 19:32:55.474953'),
	(15, 1, 2, '2022-01-24 19:32:55.478937'),
	(16, 2, 1, '2022-01-24 19:32:55.512402'),
	(17, 1, 1929, '2022-01-24 19:32:55.519993'),
	(18, 1929, 1, '2022-01-24 19:32:55.526710'),
	(19, 1, 1933, '2022-01-24 19:32:55.531415'),
	(20, 1933, 1, '2022-01-24 19:32:55.536914'),
	(21, 1, 486, '2022-01-24 19:32:55.541425'),
	(22, 486, 1, '2022-01-24 19:32:55.550353'),
	(23, 1, 102, '2022-01-24 19:32:55.559129'),
	(24, 102, 1, '2022-01-24 19:32:55.587493'),
	(25, 1, 4977, '2022-01-24 19:32:55.599054'),
	(26, 4977, 1, '2022-01-24 19:32:55.607747'),
	(27, 1, 3210, '2022-01-24 19:32:55.614106'),
	(28, 3210, 1, '2022-01-24 19:32:55.619264'),
	(29, 1, 71, '2022-01-24 19:32:55.625259'),
	(30, 71, 1, '2022-01-24 19:32:55.630381'),
	(31, 1, 80, '2022-01-24 19:32:55.639940'),
	(32, 80, 1, '2022-01-24 19:32:55.650789'),
	(33, 1, 158, '2022-01-24 19:32:55.655943'),
	(34, 158, 1, '2022-01-24 19:32:55.663566'),
	(35, 1, 141, '2022-01-24 19:32:55.668273'),
	(36, 141, 1, '2022-01-24 19:32:55.675088'),
	(37, 1, 10, '2022-01-24 19:32:55.682265'),
	(38, 10, 1, '2022-01-24 19:32:55.687722'),
	(39, 1, 2235, '2022-01-24 19:32:55.699025'),
	(40, 2235, 1, '2022-01-24 19:32:55.705265'),
	(41, 1, 29, '2022-01-24 19:32:55.710558'),
	(42, 29, 1, '2022-01-24 19:32:55.715081'),
	(43, 1, 5, '2022-01-24 19:32:55.719462'),
	(44, 5, 1, '2022-01-24 19:32:55.733553'),
	(45, 1, 1754, '2022-01-24 19:32:55.742699'),
	(46, 1754, 1, '2022-01-24 19:32:55.746391'),
	(47, 1, 1850, '2022-01-24 19:32:55.750606'),
	(48, 1850, 1, '2022-01-24 19:32:55.753846'),
	(49, 1, 160, '2022-01-24 19:32:55.756727'),
	(50, 160, 1, '2022-01-24 19:32:55.759362'),
	(51, 1, 4168, '2022-01-24 19:32:55.761991'),
	(52, 4168, 1, '2022-01-24 19:32:55.766124'),
	(53, 1, 2479, '2022-01-24 19:32:55.768531'),
	(54, 2479, 1, '2022-01-24 19:32:55.770891'),
	(55, 1, 373, '2022-01-24 19:32:55.772903'),
	(56, 373, 1, '2022-01-24 19:32:55.775143'),
	(57, 1, 3919, '2022-01-24 19:32:55.777279'),
	(58, 3919, 1, '2022-01-24 19:32:55.780090'),
	(59, 1, 51, '2022-01-24 19:32:55.786234'),
	(60, 51, 1, '2022-01-24 19:32:55.791520'),
	(61, 1, 25, '2022-01-24 19:32:55.794561'),
	(62, 25, 1, '2022-01-24 19:32:55.797308'),
	(63, 1, 72, '2022-01-24 19:32:55.799849'),
	(64, 72, 1, '2022-01-24 19:32:55.803340'),
	(65, 1, 2610, '2022-01-24 19:32:55.805534'),
	(66, 2610, 1, '2022-01-24 19:32:55.807672'),
	(67, 1, 2527, '2022-01-24 19:32:55.809767'),
	(68, 2527, 1, '2022-01-24 19:32:55.813621'),
	(69, 1, 16, '2022-01-24 19:32:55.815847'),
	(70, 16, 1, '2022-01-24 19:32:55.817989'),
	(71, 1, 96, '2022-01-24 19:32:55.820116'),
	(72, 96, 1, '2022-01-24 19:32:55.822221'),
	(73, 1, 4494, '2022-01-24 19:32:55.824515'),
	(74, 4494, 1, '2022-01-24 19:32:55.826867'),
	(75, 1, 4380, '2022-01-24 19:32:55.830246'),
	(76, 4380, 1, '2022-01-24 19:32:55.832181'),
	(77, 1, 341, '2022-01-24 19:32:55.834390'),
	(78, 341, 1, '2022-01-24 19:32:55.836377'),
	(79, 1, 50, '2022-01-24 19:32:55.838430'),
	(80, 50, 1, '2022-01-24 19:32:55.846339'),
	(81, 1, 129, '2022-01-24 19:32:55.849369'),
	(82, 129, 1, '2022-01-24 19:32:55.851590'),
	(83, 1, 5037, '2022-01-24 19:32:55.855498'),
	(84, 5037, 1, '2022-01-24 19:32:55.858964'),
	(85, 1, 3777, '2022-01-24 19:32:55.862383'),
	(86, 3777, 1, '2022-01-24 19:32:55.865702'),
	(87, 4267, 4509, '2022-01-24 19:33:29.693866'),
	(88, 4509, 4267, '2022-01-24 19:33:29.699333'),
	(89, 4267, 15, '2022-01-24 19:33:29.702836'),
	(90, 15, 4267, '2022-01-24 19:33:29.706029'),
	(91, 4267, 2, '2022-01-24 19:33:29.709085'),
	(92, 2, 4267, '2022-01-24 19:33:29.712155'),
	(93, 4267, 3405, '2022-01-24 19:33:29.715388'),
	(94, 3405, 4267, '2022-01-24 19:33:29.720438'),
	(95, 4267, 5328, '2022-01-24 19:33:29.725468'),
	(96, 5328, 4267, '2022-01-24 19:33:29.729125'),
	(97, 4267, 6, '2022-01-24 19:33:29.732130'),
	(98, 6, 4267, '2022-01-24 19:33:29.735417'),
	(99, 4267, 25, '2022-01-24 19:33:29.738389'),
	(100, 25, 4267, '2022-01-24 19:33:29.742632'),
	(101, 4267, 1904, '2022-01-24 19:33:29.747379'),
	(102, 1904, 4267, '2022-01-24 19:33:29.754526'),
	(103, 4267, 129, '2022-01-24 19:33:29.758071'),
	(104, 129, 4267, '2022-01-24 19:33:29.761361'),
	(105, 4267, 1, '2022-01-24 19:33:58.294393'),
	(106, 1, 4267, '2022-01-24 19:33:58.304211'),
	(107, 1348, 73, '2022-02-01 03:28:14.299610'),
	(108, 73, 1348, '2022-02-01 03:28:14.305676'),
	(109, 1348, 2, '2022-02-01 03:28:14.308476'),
	(110, 2, 1348, '2022-02-01 03:28:14.311068'),
	(111, 1348, 2514, '2022-02-01 03:28:14.313356'),
	(112, 2514, 1348, '2022-02-01 03:28:14.315713'),
	(113, 1348, 482, '2022-02-01 03:28:14.319647'),
	(114, 482, 1348, '2022-02-01 03:28:14.322966');
/*!40000 ALTER TABLE `friends_player` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
