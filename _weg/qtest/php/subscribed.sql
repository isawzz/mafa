
drop table `tb_subscribed`;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `tb_subscribed` (
  `id` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `eventid` int(11) NOT NULL,
  `role` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `tb_subscribed`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `tb_subscribed`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

