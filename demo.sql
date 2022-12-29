-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: 2022-12-29 14:59:10
-- 服务器版本： 10.1.26-MariaDB
-- PHP Version: 7.1.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `demo`
--

-- --------------------------------------------------------

--
-- 表的结构 `admin`
--

CREATE TABLE `admin` (
  `name` varchar(255) NOT NULL,
  `passwprd` varchar(255) NOT NULL,
  `last_login_time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- 转存表中的数据 `admin`
--

INSERT INTO `admin` (`name`, `passwprd`, `last_login_time`) VALUES
('admin', 'admin', '2022-12-29 21:49:00');

-- --------------------------------------------------------

--
-- 表的结构 `questions`
--

CREATE TABLE `questions` (
  `id` int(11) NOT NULL COMMENT '编号',
  `number` varchar(50) DEFAULT NULL COMMENT '试题编号',
  `subjectID` int(11) NOT NULL COMMENT '学科id',
  `catalogID` int(11) NOT NULL COMMENT '目录id',
  `direction` varchar(256) NOT NULL COMMENT '方向',
  `questionType` varchar(50) NOT NULL COMMENT '题型',
  `difficulty` varchar(50) NOT NULL COMMENT '难度',
  `question` varchar(256) NOT NULL COMMENT '题干',
  `likes_num` int(11) DEFAULT '0' COMMENT '点赞数',
  `browses_num` int(11) DEFAULT '0' COMMENT '浏览数',
  `answer` varchar(256) NOT NULL COMMENT '答案解析',
  `remarks` varchar(256) DEFAULT NULL COMMENT '题目备注',
  `tags` varchar(256) NOT NULL COMMENT '试题标签',
  `isChoice` tinyint(1) DEFAULT '0' COMMENT '精选题',
  `publishState` tinyint(1) DEFAULT NULL COMMENT '发布状态',
  `publishDate` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '发布时间',
  `chkState` tinyint(1) DEFAULT NULL COMMENT '筛选状态',
  `chkUser` varchar(255) DEFAULT NULL COMMENT '审核人',
  `chkRemarks` varchar(256) DEFAULT NULL COMMENT '审核意见',
  `chkDate` datetime DEFAULT NULL COMMENT '审核日期',
  `creator` varchar(255) NOT NULL COMMENT '创建人',
  `addDate` datetime NOT NULL COMMENT '创建日期'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='题库';

--
-- 转存表中的数据 `questions`
--

INSERT INTO `questions` (`id`, `number`, `subjectID`, `catalogID`, `direction`, `questionType`, `difficulty`, `question`, `likes_num`, `browses_num`, `answer`, `remarks`, `tags`, `isChoice`, `publishState`, `publishDate`, `chkState`, `chkUser`, `chkRemarks`, `chkDate`, `creator`, `addDate`) VALUES
(30, '1', 1, 1, '前端', 'js', '困难', '13153214541536143514523143521435214352143514321432143213214313', NULL, NULL, '1212121215', '23123', '1212', 0, 1, '2022-12-26 09:19:33', 1, '1', '232\r\n', '2022-12-26 00:00:00', '323', '2022-12-26 00:00:00'),
(31, '1', 2, 2, '12312', '12312', '12312', '12321', NULL, NULL, '12312', '12312', '12312', 0, 2, '2022-12-26 12:32:43', 1, 'admin111111', 'test test test', '2022-12-26 20:32:43', 'admin', '2022-12-26 00:00:00'),
(32, '1', 3, 2, '12312', '12312', '12312', '12321', NULL, NULL, '12312', '12312', '12312', 0, 21, '2022-12-26 10:58:43', 0, '45345', '45345', '2022-12-26 00:00:00', '43545', '2022-12-26 00:00:00'),
(33, '1', 1, 2, '12312', '12312', '12312', '12321', NULL, NULL, '12312', '12312', '12312', 0, 21, '2022-12-26 10:58:43', 0, '45345', '45345', '2022-12-26 00:00:00', '43545', '2022-12-26 00:00:00'),
(34, '1', 1, 2, '12312', '12312', '12312', '12321', 5, 1, '12312', '12312', '12312', 0, 1, '2022-12-29 13:47:27', 1, 'admin111111', 'test test test', '2022-12-29 21:38:33', 'admin', '2022-12-26 00:00:00'),
(36, NULL, 0, 0, '', '1', '1', '', NULL, NULL, '', NULL, '', 0, 1, '2022-12-26 12:12:15', 1, 'admin', 'test', '2022-12-26 20:12:15', 'admin', '2022-12-26 18:23:06'),
(37, NULL, 0, 0, '', '1', '1', '', NULL, NULL, '', NULL, '', 0, NULL, '2022-12-26 10:23:56', NULL, NULL, NULL, NULL, '', '2022-12-26 18:23:56'),
(38, NULL, 0, 0, '', '1', '1', '', NULL, NULL, '', NULL, '', 0, NULL, '2022-12-26 10:27:24', NULL, NULL, NULL, NULL, '', '2022-12-26 18:27:24'),
(39, NULL, 0, 0, '', '1', '1', '', NULL, NULL, '', NULL, '', 0, 1, '2022-12-26 12:21:57', 1, 'admin', 'test', '2022-12-26 20:21:57', 'admin', '2022-12-26 18:27:42'),
(40, NULL, 1, 2, '2', '3', '1', '2', NULL, 0, '2', NULL, '2', 0, 0, '2022-12-29 12:29:14', 0, NULL, NULL, NULL, '', '2022-12-27 14:28:21');

-- --------------------------------------------------------

--
-- 表的结构 `ranking_list`
--

CREATE TABLE `ranking_list` (
  `username` varchar(255) NOT NULL COMMENT '用户名',
  `avatar` varchar(255) NOT NULL COMMENT '头像',
  `upload_ques_num` int(11) NOT NULL COMMENT '上传题目数',
  `get_likes_num` int(11) NOT NULL COMMENT '获得点赞数'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='排行榜';

--
-- 转存表中的数据 `ranking_list`
--

INSERT INTO `ranking_list` (`username`, `avatar`, `upload_ques_num`, `get_likes_num`) VALUES
('123', '123', 1, 1),
('admin', '1111111', 25, 5),
('12', 'https://c-ssl.dtstatic.com/uploads/blog/202104/22/20210422220419_1797f.thumb.1000_0.jpg', 0, 0),
('13', 'https://c-ssl.dtstatic.com/uploads/blog/202104/22/20210422220419_1797f.thumb.1000_0.jpg', 0, 0);

-- --------------------------------------------------------

--
-- 表的结构 `user`
--

CREATE TABLE `user` (
  `username` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '用户名',
  `password` text CHARACTER SET utf8mb4 NOT NULL COMMENT '密码',
  `phone` varchar(255) CHARACTER SET utf8mb4 NOT NULL COMMENT '电话号码',
  `sex` varchar(10) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '性别',
  `email` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '邮箱',
  `ctime` datetime DEFAULT NULL COMMENT '注册时间',
  `avatar` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '头像',
  `last_login_time` datetime NOT NULL COMMENT '最后登录时间'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='用户';

--
-- 转存表中的数据 `user`
--

INSERT INTO `user` (`username`, `password`, `phone`, `sex`, `email`, `ctime`, `avatar`, `last_login_time`) VALUES
('45', '12', '157', '0', '0', '0000-00-00 00:00:00', '0', '0000-00-00 00:00:00'),
('45', '12', '157', '0', '0', '0000-00-00 00:00:00', '0', '0000-00-00 00:00:00'),
('45', '12', '157', '0', '0', '0000-00-00 00:00:00', '0', '0000-00-00 00:00:00'),
('45', '12', '157', '0', '0', '0000-00-00 00:00:00', '0', '0000-00-00 00:00:00'),
('213', '123', '12', '男', 'z751368560@126.com', '2022-12-26 13:52:54', 'https://c-ssl.dtstatic.com/uploads/blog/202104/22/20210422220419_1797f.thumb.1000_0.jpg', '2022-12-27 13:30:40'),
(NULL, '', '', NULL, NULL, NULL, NULL, '0000-00-00 00:00:00'),
(NULL, '', '', NULL, NULL, NULL, NULL, '0000-00-00 00:00:00'),
('1', '1', '157 5748 2069', '男', 'z751368560@126.com', '2022-12-26 21:03:49', 'https://c-ssl.dtstatic.com/uploads/blog/202104/22/20210422220419_1797f.thumb.1000_0.jpg', '2022-12-26 21:03:49'),
('12', '1', '157 5748 2069', '男', 'z751368560@126.com', '2022-12-26 21:04:28', 'https://c-ssl.dtstatic.com/uploads/blog/202104/22/20210422220419_1797f.thumb.1000_0.jpg', '2022-12-26 21:04:28'),
('13', '1', '1', '男', '1', '2022-12-27 13:41:48', 'https://c-ssl.dtstatic.com/uploads/blog/202104/22/20210422220419_1797f.thumb.1000_0.jpg', '2022-12-27 13:41:48');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '编号', AUTO_INCREMENT=41;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
