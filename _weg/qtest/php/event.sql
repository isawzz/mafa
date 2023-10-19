
drop table `tb_event`;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `tb_event` (
  `id` int(11) NOT NULL,
  `title` varchar(50) NOT NULL,
  `text` text DEFAULT NULL,
  `fen` text DEFAULT NULL,
  `date` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `tb_event`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `tb_event`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

