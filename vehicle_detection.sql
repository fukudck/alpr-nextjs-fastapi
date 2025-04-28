-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th4 28, 2025 lúc 07:58 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `vehicle_detection`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `blacklist_vehicles`
--

CREATE TABLE `blacklist_vehicles` (
  `id` int(11) NOT NULL,
  `plate_number` varchar(20) NOT NULL,
  `vehicle_type` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `report_by` int(11) DEFAULT NULL,
  `reported_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `blacklist_vehicles`
--

INSERT INTO `blacklist_vehicles` (`id`, `plate_number`, `vehicle_type`, `description`, `report_by`, `reported_at`) VALUES
(1, '30E-92291', 'car', 'dat', 1, '2025-04-21 14:33:26'),
(2, '79A-17979', 'car', 'dat', 1, '2025-04-21 14:33:26'),
(3, '50LD-18107', 'car', 'dat', 1, '2025-04-21 14:33:26');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `detected_vehicles`
--

CREATE TABLE `detected_vehicles` (
  `id` int(11) NOT NULL,
  `result_id` int(11) DEFAULT NULL,
  `vehicle_id` int(11) DEFAULT NULL,
  `plate_text` varchar(20) DEFAULT NULL,
  `confidence` float DEFAULT NULL,
  `vehicle_type` varchar(50) DEFAULT NULL,
  `plate_image_url` text DEFAULT NULL,
  `is_blacklisted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `detected_vehicles`
--

INSERT INTO `detected_vehicles` (`id`, `result_id`, `vehicle_id`, `plate_text`, `confidence`, `vehicle_type`, `plate_image_url`, `is_blacklisted`) VALUES
(1, 1, 1, NULL, NULL, 'car', '/task_results/11b40389-1493-485b-af73-250006220a35/warped_1.jpg', 0),
(2, 1, 2, '79A-17979', 0.950255, 'car', '/task_results/11b40389-1493-485b-af73-250006220a35/warped_2.jpg', 1),
(3, 1, 3, NULL, NULL, 'car', '/task_results/11b40389-1493-485b-af73-250006220a35/warped_3.jpg', 0),
(4, 2, 1, NULL, NULL, 'car', '/task_results/c9e8744c-1c6a-4f1f-bd5a-0ace2229fad7/warped_1.jpg', 0),
(5, 2, 2, '79A-17979', 0.950255, 'car', '/task_results/c9e8744c-1c6a-4f1f-bd5a-0ace2229fad7/warped_2.jpg', 1),
(6, 2, 3, NULL, NULL, 'car', '/task_results/c9e8744c-1c6a-4f1f-bd5a-0ace2229fad7/warped_3.jpg', 0),
(7, 3, 1, NULL, NULL, 'car', '/task_results/f80f8bca-02eb-40d4-8fad-876e2be0bf9d/warped_1.jpg', 0),
(8, 3, 2, '79A-17979', 0.950255, 'car', '/task_results/f80f8bca-02eb-40d4-8fad-876e2be0bf9d/warped_2.jpg', 1),
(9, 3, 3, NULL, NULL, 'car', '/task_results/f80f8bca-02eb-40d4-8fad-876e2be0bf9d/warped_3.jpg', 0),
(10, 4, 1, NULL, NULL, 'car', '/task_results/cc78b1bb-da2f-46e1-a4a0-05876f93e140/warped_1.jpg', 0),
(11, 4, 2, '79A-17979', 0.950255, 'car', '/task_results/cc78b1bb-da2f-46e1-a4a0-05876f93e140/warped_2.jpg', 1),
(12, 4, 3, NULL, NULL, 'car', '/task_results/cc78b1bb-da2f-46e1-a4a0-05876f93e140/warped_3.jpg', 0),
(13, 5, 1, NULL, NULL, 'car', '/task_results/353cc775-143d-4a5f-8245-29995c254038/warped_1.jpg', 0),
(14, 5, 2, '79A-17979', 0.950255, 'car', '/task_results/353cc775-143d-4a5f-8245-29995c254038/warped_2.jpg', 1),
(15, 5, 3, NULL, NULL, 'car', '/task_results/353cc775-143d-4a5f-8245-29995c254038/warped_3.jpg', 0),
(16, 6, 1, NULL, NULL, 'car', '/task_results/b2cbb57b-3ce1-47b8-9975-6dc7e21c883f/warped_1.jpg', 0),
(17, 6, 2, '79A-17979', 0.950255, 'car', '/task_results/b2cbb57b-3ce1-47b8-9975-6dc7e21c883f/warped_2.jpg', 1),
(18, 6, 3, NULL, NULL, 'car', '/task_results/b2cbb57b-3ce1-47b8-9975-6dc7e21c883f/warped_3.jpg', 0),
(19, 7, 1, NULL, NULL, 'car', '/task_results/12875ac1-bfd0-4a27-94f6-70a51d78e412/warped_1.jpg', 0),
(20, 7, 2, '79A-17979', 0.950255, 'car', '/task_results/12875ac1-bfd0-4a27-94f6-70a51d78e412/warped_2.jpg', 1),
(21, 7, 3, NULL, NULL, 'car', '/task_results/12875ac1-bfd0-4a27-94f6-70a51d78e412/warped_3.jpg', 0),
(22, 8, 1, NULL, NULL, 'car', '/task_results/f523b8a7-51c2-40aa-bf7b-f6ef8dd8efd7/warped_1.jpg', 0),
(23, 8, 2, '79A-17979', 0.950255, 'car', '/task_results/f523b8a7-51c2-40aa-bf7b-f6ef8dd8efd7/warped_2.jpg', 1),
(24, 8, 3, NULL, NULL, 'car', '/task_results/f523b8a7-51c2-40aa-bf7b-f6ef8dd8efd7/warped_3.jpg', 0),
(25, 9, 1, NULL, NULL, 'car', '/task_results/3b5ff6af-399c-4951-a0bc-0ee7a0fca512/warped_1.jpg', 0),
(26, 9, 2, '79A-17979', 0.950255, 'car', '/task_results/3b5ff6af-399c-4951-a0bc-0ee7a0fca512/warped_2.jpg', 1),
(27, 9, 3, NULL, NULL, 'car', '/task_results/3b5ff6af-399c-4951-a0bc-0ee7a0fca512/warped_3.jpg', 0),
(28, 10, 1, NULL, NULL, 'car', '/task_results/88f10e0f-ea32-4792-83ad-150ff51015e4/warped_1.jpg', 0),
(29, 10, 2, '79A-17979', 0.950255, 'car', '/task_results/88f10e0f-ea32-4792-83ad-150ff51015e4/warped_2.jpg', 1),
(30, 10, 3, NULL, NULL, 'car', '/task_results/88f10e0f-ea32-4792-83ad-150ff51015e4/warped_3.jpg', 0),
(31, 11, 1, NULL, NULL, 'car', '/task_results/739e7a8c-7a04-4e12-9f4d-034bdbb6fb9a/warped_1.jpg', 0),
(32, 11, 2, '79A-17979', 0.950255, 'car', '/task_results/739e7a8c-7a04-4e12-9f4d-034bdbb6fb9a/warped_2.jpg', 1),
(33, 11, 3, NULL, NULL, 'car', '/task_results/739e7a8c-7a04-4e12-9f4d-034bdbb6fb9a/warped_3.jpg', 0),
(34, 12, 1, NULL, NULL, 'car', '/task_results/4277f543-2b6c-462a-a119-988da05f4302/warped_1.jpg', 0),
(35, 12, 2, '79A-17979', 0.950255, 'car', '/task_results/4277f543-2b6c-462a-a119-988da05f4302/warped_2.jpg', 1),
(36, 12, 3, NULL, NULL, 'car', '/task_results/4277f543-2b6c-462a-a119-988da05f4302/warped_3.jpg', 0),
(37, 13, 1, NULL, NULL, 'car', '/task_results/52e99f82-20ec-4c5a-9e10-d76501012a7f/warped_1.jpg', 0),
(38, 13, 2, '79A-17979', 0.950255, 'car', '/task_results/52e99f82-20ec-4c5a-9e10-d76501012a7f/warped_2.jpg', 1),
(39, 13, 3, NULL, NULL, 'car', '/task_results/52e99f82-20ec-4c5a-9e10-d76501012a7f/warped_3.jpg', 0),
(40, 14, 1, NULL, NULL, 'car', '/task_results/75d1da18-0482-4380-9d7b-96bd21c2b92d/warped_1.jpg', 0),
(41, 14, 2, '79A-17979', 0.950255, 'car', '/task_results/75d1da18-0482-4380-9d7b-96bd21c2b92d/warped_2.jpg', 1),
(42, 14, 3, NULL, NULL, 'car', '/task_results/75d1da18-0482-4380-9d7b-96bd21c2b92d/warped_3.jpg', 0),
(43, 15, 1, NULL, NULL, 'car', '/task_results/4373a029-b2c5-4467-bb23-40d97f5f1c73/warped_1.jpg', 0),
(44, 15, 2, '79A-17979', 0.950255, 'car', '/task_results/4373a029-b2c5-4467-bb23-40d97f5f1c73/warped_2.jpg', 1),
(45, 15, 3, NULL, NULL, 'car', '/task_results/4373a029-b2c5-4467-bb23-40d97f5f1c73/warped_3.jpg', 0),
(46, 16, 1, NULL, NULL, 'car', '/task_results/7899f17d-7518-471c-bf09-c1172eb226f2/warped_1.jpg', 0),
(47, 16, 2, '79A-17979', 0.950255, 'car', '/task_results/7899f17d-7518-471c-bf09-c1172eb226f2/warped_2.jpg', 1),
(48, 16, 3, NULL, NULL, 'car', '/task_results/7899f17d-7518-471c-bf09-c1172eb226f2/warped_3.jpg', 0),
(49, 17, 1, NULL, NULL, 'car', '/task_results/d31e2b94-7f89-4399-abc9-594d3b4af2cd/warped_1.jpg', 0),
(50, 17, 2, '79A-17979', 0.950255, 'car', '/task_results/d31e2b94-7f89-4399-abc9-594d3b4af2cd/warped_2.jpg', 1),
(51, 17, 3, NULL, NULL, 'car', '/task_results/d31e2b94-7f89-4399-abc9-594d3b4af2cd/warped_3.jpg', 0),
(52, 18, 1, NULL, NULL, 'car', '/task_results/3d3a0635-98ca-42c9-b6e4-8d8fec74991f/warped_1.jpg', 0),
(53, 18, 2, '79A-17979', 0.950255, 'car', '/task_results/3d3a0635-98ca-42c9-b6e4-8d8fec74991f/warped_2.jpg', 1),
(54, 18, 3, NULL, NULL, 'car', '/task_results/3d3a0635-98ca-42c9-b6e4-8d8fec74991f/warped_3.jpg', 0),
(55, 19, 1, NULL, NULL, 'car', '/task_results/31d8e6cc-f840-48fc-8d2f-8375f9ef5336/warped_1.jpg', 0),
(56, 19, 2, '79A-17979', 0.950255, 'car', '/task_results/31d8e6cc-f840-48fc-8d2f-8375f9ef5336/warped_2.jpg', 1),
(57, 19, 3, NULL, NULL, 'car', '/task_results/31d8e6cc-f840-48fc-8d2f-8375f9ef5336/warped_3.jpg', 0),
(58, 20, 116, NULL, NULL, 'car', '/task_results/70f688f9-7830-490a-b398-19d9301d8e1e/warped_116.jpg', 0),
(59, 21, 116, NULL, NULL, 'car', '/task_results/70f688f9-7830-490a-b398-19d9301d8e1e/warped_116.jpg', 0),
(60, 22, 116, NULL, NULL, 'car', '/task_results/70f688f9-7830-490a-b398-19d9301d8e1e/warped_116.jpg', 0),
(61, 23, 116, '50LO-16107', 0.875837, 'car', '/task_results/70f688f9-7830-490a-b398-19d9301d8e1e/warped_116.jpg', 0),
(62, 24, 116, '50LD-18107', 0.855924, 'car', '/task_results/70f688f9-7830-490a-b398-19d9301d8e1e/warped_116.jpg', 0),
(63, 25, 116, '50LD-18107', 0.918774, 'car', '/task_results/70f688f9-7830-490a-b398-19d9301d8e1e/warped_116.jpg', 0),
(64, 26, 116, '50LO-18107', 0.925848, 'car', '/task_results/70f688f9-7830-490a-b398-19d9301d8e1e/warped_116.jpg', 0),
(65, 27, 116, '50LD-18107', 0.908029, 'car', '/task_results/70f688f9-7830-490a-b398-19d9301d8e1e/warped_116.jpg', 0),
(66, 28, 116, '50LO-18', 0.695266, 'car', '/task_results/70f688f9-7830-490a-b398-19d9301d8e1e/warped_116.jpg', 0),
(67, 29, 116, '50LO-18107', 0.968234, 'car', '/task_results/70f688f9-7830-490a-b398-19d9301d8e1e/warped_116.jpg', 0),
(68, 30, 116, '50LD-18107', 0.928705, 'car', '/task_results/70f688f9-7830-490a-b398-19d9301d8e1e/warped_116.jpg', 0),
(69, 31, 116, '50LD-18107', 0.889458, 'car', '/task_results/70f688f9-7830-490a-b398-19d9301d8e1e/warped_116.jpg', 0),
(70, 32, 116, '50LD-18107', 0.94443, 'car', '/task_results/70f688f9-7830-490a-b398-19d9301d8e1e/warped_116.jpg', 0),
(71, 33, 116, '50LD-18107', 0.963132, 'car', '/task_results/70f688f9-7830-490a-b398-19d9301d8e1e/warped_116.jpg', 0),
(72, 34, 116, NULL, NULL, 'car', '/task_results/287012dc-8662-43b8-87f4-d42c00be584a/warped_116.jpg', 0),
(73, 35, 116, NULL, NULL, 'car', '/task_results/287012dc-8662-43b8-87f4-d42c00be584a/warped_116.jpg', 0),
(74, 36, 116, NULL, NULL, 'car', '/task_results/287012dc-8662-43b8-87f4-d42c00be584a/warped_116.jpg', 0),
(75, 37, 116, '50LO-16107', 0.875837, 'car', '/task_results/287012dc-8662-43b8-87f4-d42c00be584a/warped_116.jpg', 0),
(76, 38, 116, '50LD-18107', 0.855924, 'car', '/task_results/287012dc-8662-43b8-87f4-d42c00be584a/warped_116.jpg', 1),
(77, 39, 116, '50LD-18107', 0.918774, 'car', '/task_results/287012dc-8662-43b8-87f4-d42c00be584a/warped_116.jpg', 1),
(78, 40, 116, '50LO-18107', 0.925848, 'car', '/task_results/287012dc-8662-43b8-87f4-d42c00be584a/warped_116.jpg', 0),
(79, 41, 116, '50LD-18107', 0.908029, 'car', '/task_results/287012dc-8662-43b8-87f4-d42c00be584a/warped_116.jpg', 1),
(80, 42, 116, '50LO-18', 0.695266, 'car', '/task_results/287012dc-8662-43b8-87f4-d42c00be584a/warped_116.jpg', 0),
(81, 43, 116, '50LO-18107', 0.968234, 'car', '/task_results/287012dc-8662-43b8-87f4-d42c00be584a/warped_116.jpg', 0),
(82, 44, 116, '50LD-18107', 0.928705, 'car', '/task_results/287012dc-8662-43b8-87f4-d42c00be584a/warped_116.jpg', 1),
(83, 45, 116, '50LD-18107', 0.889458, 'car', '/task_results/287012dc-8662-43b8-87f4-d42c00be584a/warped_116.jpg', 1),
(84, 46, 116, '50LD-18107', 0.94443, 'car', '/task_results/287012dc-8662-43b8-87f4-d42c00be584a/warped_116.jpg', 1),
(85, 47, 116, '50LD-18107', 0.963132, 'car', '/task_results/287012dc-8662-43b8-87f4-d42c00be584a/warped_116.jpg', 1),
(86, 48, 116, NULL, NULL, 'car', '/task_results/95933361-f5fe-4a5d-a866-87b9e20c1981/warped_116.jpg', 0),
(87, 49, 116, NULL, NULL, 'car', '/task_results/95933361-f5fe-4a5d-a866-87b9e20c1981/warped_116.jpg', 0),
(88, 50, 116, NULL, NULL, 'car', '/task_results/95933361-f5fe-4a5d-a866-87b9e20c1981/warped_116.jpg', 0),
(89, 51, 116, '50LO-16107', 0.875837, 'car', '/task_results/95933361-f5fe-4a5d-a866-87b9e20c1981/warped_116.jpg', 0),
(90, 52, 116, '50LD-18107', 0.855924, 'car', '/task_results/95933361-f5fe-4a5d-a866-87b9e20c1981/warped_116.jpg', 1),
(91, 53, 116, '50LD-18107', 0.918774, 'car', '/task_results/95933361-f5fe-4a5d-a866-87b9e20c1981/warped_116.jpg', 1),
(92, 54, 116, '50LO-18107', 0.925848, 'car', '/task_results/95933361-f5fe-4a5d-a866-87b9e20c1981/warped_116.jpg', 0),
(93, 55, 116, '50LD-18107', 0.908029, 'car', '/task_results/95933361-f5fe-4a5d-a866-87b9e20c1981/warped_116.jpg', 1),
(94, 56, 116, '50LO-18', 0.695266, 'car', '/task_results/95933361-f5fe-4a5d-a866-87b9e20c1981/warped_116.jpg', 0),
(95, 57, 116, '50LO-18107', 0.968234, 'car', '/task_results/95933361-f5fe-4a5d-a866-87b9e20c1981/warped_116.jpg', 0),
(96, 58, 116, '50LD-18107', 0.928705, 'car', '/task_results/95933361-f5fe-4a5d-a866-87b9e20c1981/warped_116.jpg', 1),
(97, 59, 116, '50LD-18107', 0.889458, 'car', '/task_results/95933361-f5fe-4a5d-a866-87b9e20c1981/warped_116.jpg', 1),
(98, 60, 116, '50LD-18107', 0.94443, 'car', '/task_results/95933361-f5fe-4a5d-a866-87b9e20c1981/warped_116.jpg', 1),
(99, 61, 116, '50LD-18107', 0.963132, 'car', '/task_results/95933361-f5fe-4a5d-a866-87b9e20c1981/warped_116.jpg', 1),
(100, 62, 116, NULL, NULL, 'car', '/task_results/44f53e81-308c-418c-b751-0803f44a36fa/warped_116.jpg', 0),
(101, 63, 116, NULL, NULL, 'car', '/task_results/44f53e81-308c-418c-b751-0803f44a36fa/warped_116.jpg', 0),
(102, 64, 116, NULL, NULL, 'car', '/task_results/44f53e81-308c-418c-b751-0803f44a36fa/warped_116.jpg', 0),
(103, 65, 116, '50LO-16107', 0.875837, 'car', '/task_results/44f53e81-308c-418c-b751-0803f44a36fa/warped_116.jpg', 0),
(104, 66, 116, '50LD-18107', 0.855924, 'car', '/task_results/44f53e81-308c-418c-b751-0803f44a36fa/warped_116.jpg', 1),
(105, 67, 116, '50LD-18107', 0.918774, 'car', '/task_results/44f53e81-308c-418c-b751-0803f44a36fa/warped_116.jpg', 1),
(106, 68, 116, '50LO-18107', 0.925848, 'car', '/task_results/44f53e81-308c-418c-b751-0803f44a36fa/warped_116.jpg', 0),
(107, 69, 116, '50LD-18107', 0.908029, 'car', '/task_results/44f53e81-308c-418c-b751-0803f44a36fa/warped_116.jpg', 1),
(108, 70, 116, '50LO-18', 0.695266, 'car', '/task_results/44f53e81-308c-418c-b751-0803f44a36fa/warped_116.jpg', 0),
(109, 71, 116, '50LO-18107', 0.968234, 'car', '/task_results/44f53e81-308c-418c-b751-0803f44a36fa/warped_116.jpg', 0),
(110, 72, 116, '50LD-18107', 0.928705, 'car', '/task_results/44f53e81-308c-418c-b751-0803f44a36fa/warped_116.jpg', 1),
(111, 73, 116, '50LD-18107', 0.889458, 'car', '/task_results/44f53e81-308c-418c-b751-0803f44a36fa/warped_116.jpg', 1),
(112, 74, 116, '50LD-18107', 0.94443, 'car', '/task_results/44f53e81-308c-418c-b751-0803f44a36fa/warped_116.jpg', 1),
(113, 75, 116, '50LD-18107', 0.963132, 'car', '/task_results/44f53e81-308c-418c-b751-0803f44a36fa/warped_116.jpg', 1),
(114, 76, 116, NULL, NULL, 'car', '/task_results/8b43858c-e7ed-4fac-ab2d-31eb328dcbc1/warped_116.jpg', 0),
(115, 77, 116, NULL, NULL, 'car', '/task_results/8b43858c-e7ed-4fac-ab2d-31eb328dcbc1/warped_116.jpg', 0),
(116, 78, 116, NULL, NULL, 'car', '/task_results/8b43858c-e7ed-4fac-ab2d-31eb328dcbc1/warped_116.jpg', 0),
(117, 79, 116, '50LO-16107', 0.875837, 'car', '/task_results/8b43858c-e7ed-4fac-ab2d-31eb328dcbc1/warped_116.jpg', 0),
(118, 80, 116, '50LD-18107', 0.855924, 'car', '/task_results/8b43858c-e7ed-4fac-ab2d-31eb328dcbc1/warped_116.jpg', 1),
(119, 81, 116, '50LD-18107', 0.918774, 'car', '/task_results/8b43858c-e7ed-4fac-ab2d-31eb328dcbc1/warped_116.jpg', 1),
(120, 82, 116, '50LO-18107', 0.925848, 'car', '/task_results/8b43858c-e7ed-4fac-ab2d-31eb328dcbc1/warped_116.jpg', 0),
(121, 83, 116, '50LD-18107', 0.908029, 'car', '/task_results/8b43858c-e7ed-4fac-ab2d-31eb328dcbc1/warped_116.jpg', 1),
(122, 84, 116, '50LO-18', 0.695266, 'car', '/task_results/8b43858c-e7ed-4fac-ab2d-31eb328dcbc1/warped_116.jpg', 0),
(123, 85, 116, '50LO-18107', 0.968234, 'car', '/task_results/8b43858c-e7ed-4fac-ab2d-31eb328dcbc1/warped_116.jpg', 0),
(124, 86, 116, '50LD-18107', 0.928705, 'car', '/task_results/8b43858c-e7ed-4fac-ab2d-31eb328dcbc1/warped_116.jpg', 1),
(125, 87, 116, '50LD-18107', 0.889458, 'car', '/task_results/8b43858c-e7ed-4fac-ab2d-31eb328dcbc1/warped_116.jpg', 1),
(126, 88, 116, '50LD-18107', 0.94443, 'car', '/task_results/8b43858c-e7ed-4fac-ab2d-31eb328dcbc1/warped_116.jpg', 1),
(127, 89, 116, '50LD-18107', 0.963132, 'car', '/task_results/8b43858c-e7ed-4fac-ab2d-31eb328dcbc1/warped_116.jpg', 1),
(128, 90, 116, NULL, NULL, 'car', '/task_results/c021e17f-cc99-42a9-b741-4ce3285b16fe/warped_116.jpg', 0),
(129, 91, 116, NULL, NULL, 'car', '/task_results/c021e17f-cc99-42a9-b741-4ce3285b16fe/warped_116.jpg', 0),
(130, 92, 116, NULL, NULL, 'car', '/task_results/c021e17f-cc99-42a9-b741-4ce3285b16fe/warped_116.jpg', 0),
(131, 93, 116, '50LO-16107', 0.875837, 'car', '/task_results/c021e17f-cc99-42a9-b741-4ce3285b16fe/warped_116.jpg', 0),
(132, 94, 116, '50LD-18107', 0.855924, 'car', '/task_results/c021e17f-cc99-42a9-b741-4ce3285b16fe/warped_116.jpg', 1),
(133, 95, 116, '50LD-18107', 0.918774, 'car', '/task_results/c021e17f-cc99-42a9-b741-4ce3285b16fe/warped_116.jpg', 1),
(134, 96, 116, '50LO-18107', 0.925848, 'car', '/task_results/c021e17f-cc99-42a9-b741-4ce3285b16fe/warped_116.jpg', 0),
(135, 97, 116, '50LD-18107', 0.908029, 'car', '/task_results/c021e17f-cc99-42a9-b741-4ce3285b16fe/warped_116.jpg', 1),
(136, 98, 116, '50LO-18', 0.695266, 'car', '/task_results/c021e17f-cc99-42a9-b741-4ce3285b16fe/warped_116.jpg', 0),
(137, 99, 116, '50LO-18107', 0.968234, 'car', '/task_results/c021e17f-cc99-42a9-b741-4ce3285b16fe/warped_116.jpg', 0),
(138, 100, 116, '50LD-18107', 0.928705, 'car', '/task_results/c021e17f-cc99-42a9-b741-4ce3285b16fe/warped_116.jpg', 1),
(139, 101, 116, '50LD-18107', 0.889458, 'car', '/task_results/c021e17f-cc99-42a9-b741-4ce3285b16fe/warped_116.jpg', 1),
(140, 102, 116, '50LD-18107', 0.94443, 'car', '/task_results/c021e17f-cc99-42a9-b741-4ce3285b16fe/warped_116.jpg', 1),
(141, 103, 116, '50LD-18107', 0.963132, 'car', '/task_results/c021e17f-cc99-42a9-b741-4ce3285b16fe/warped_116.jpg', 1),
(142, 104, 1, NULL, NULL, 'car', '/task_results/ef08e075-c2e4-4b5b-988a-b1dbcf822448/warped_1.jpg', 0),
(143, 104, 2, '79A-17979', 0.950255, 'car', '/task_results/ef08e075-c2e4-4b5b-988a-b1dbcf822448/warped_2.jpg', 1),
(144, 104, 3, NULL, NULL, 'car', '/task_results/ef08e075-c2e4-4b5b-988a-b1dbcf822448/warped_3.jpg', 0),
(145, 105, 1, NULL, NULL, 'car', '/task_results/d599ad37-795e-4de5-96a6-2c1d0709516e/warped_1.jpg', 0),
(146, 105, 2, '79A-17979', 0.950255, 'car', '/task_results/d599ad37-795e-4de5-96a6-2c1d0709516e/warped_2.jpg', 1),
(147, 105, 3, NULL, NULL, 'car', '/task_results/d599ad37-795e-4de5-96a6-2c1d0709516e/warped_3.jpg', 0),
(148, 106, 1, NULL, NULL, 'car', '/task_results/09b43049-1ed0-4bd2-8d09-f2be624e2499/warped_1.jpg', 0),
(149, 106, 2, '79A-17979', 0.950255, 'car', '/task_results/09b43049-1ed0-4bd2-8d09-f2be624e2499/warped_2.jpg', 1),
(150, 106, 3, NULL, NULL, 'car', '/task_results/09b43049-1ed0-4bd2-8d09-f2be624e2499/warped_3.jpg', 0),
(151, 107, 1, NULL, NULL, 'car', '/task_results/65a99741-3703-4304-b7a5-69331c688e75/warped_1.jpg', 0),
(152, 107, 2, '79A-17979', 0.950255, 'car', '/task_results/65a99741-3703-4304-b7a5-69331c688e75/warped_2.jpg', 1),
(153, 107, 3, NULL, NULL, 'car', '/task_results/65a99741-3703-4304-b7a5-69331c688e75/warped_3.jpg', 0),
(154, 108, 1, NULL, NULL, 'car', '/task_results/2ad17927-5a5e-4168-84b7-bb616d3e6711/warped_1.jpg', 0),
(155, 108, 2, '79A-17979', 0.950255, 'car', '/task_results/2ad17927-5a5e-4168-84b7-bb616d3e6711/warped_2.jpg', 1),
(156, 108, 3, NULL, NULL, 'car', '/task_results/2ad17927-5a5e-4168-84b7-bb616d3e6711/warped_3.jpg', 0),
(157, 109, 1, NULL, NULL, 'car', '/task_results/2c4edd67-6e0a-4fb2-bad0-fc0f7958bafb/warped_1.jpg', 0),
(158, 109, 2, '79A-17979', 0.950255, 'car', '/task_results/2c4edd67-6e0a-4fb2-bad0-fc0f7958bafb/warped_2.jpg', 1),
(159, 109, 3, NULL, NULL, 'car', '/task_results/2c4edd67-6e0a-4fb2-bad0-fc0f7958bafb/warped_3.jpg', 0),
(160, 110, 1, '30E-92291', 0.96706, 'truck', '/task_results/058e24ae-8341-4c66-96f0-f37e02a9698d/warped_1.jpg', 1),
(161, 111, 1, NULL, NULL, 'car', '/task_results/062ce587-478e-4db6-b448-72dc7938152d/warped_1.jpg', 0),
(162, 111, 2, '79A-17979', 0.950255, 'car', '/task_results/062ce587-478e-4db6-b448-72dc7938152d/warped_2.jpg', 1),
(163, 111, 3, NULL, NULL, 'car', '/task_results/062ce587-478e-4db6-b448-72dc7938152d/warped_3.jpg', 0);

--
-- Bẫy `detected_vehicles`
--
DELIMITER $$
CREATE TRIGGER `trg_check_blacklist` BEFORE INSERT ON `detected_vehicles` FOR EACH ROW BEGIN
    IF NEW.plate_text IS NOT NULL AND 
       EXISTS (
           SELECT 1 FROM blacklist_vehicles
           WHERE plate_number = NEW.plate_text
       )
    THEN
        SET NEW.is_blacklisted = TRUE;
    ELSE
        SET NEW.is_blacklisted = FALSE;
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_check_blacklist_update` BEFORE UPDATE ON `detected_vehicles` FOR EACH ROW BEGIN
    IF NEW.plate_text IS NOT NULL AND 
       EXISTS (
           SELECT 1 FROM blacklist_vehicles
           WHERE plate_number = NEW.plate_text
       )
    THEN
        SET NEW.is_blacklisted = TRUE;
    ELSE
        SET NEW.is_blacklisted = FALSE;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tasks`
--

CREATE TABLE `tasks` (
  `id` char(36) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `type` enum('video','image','camera') DEFAULT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `source_url` text DEFAULT NULL,
  `process_time` float DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tasks`
--

INSERT INTO `tasks` (`id`, `user_id`, `type`, `status`, `source_url`, `process_time`, `created_at`) VALUES
('058e24ae-8341-4c66-96f0-f37e02a9698d', NULL, 'image', 'completed', '/uploads/058e24ae-8341-4c66-96f0-f37e02a9698d/058e24ae-8341-4c66-96f0-f37e02a9698d.jpg', 0.482673, '2025-04-22 02:31:39'),
('062ce587-478e-4db6-b448-72dc7938152d', NULL, 'image', 'completed', '/uploads/062ce587-478e-4db6-b448-72dc7938152d/062ce587-478e-4db6-b448-72dc7938152d.jpg', 0.809003, '2025-04-22 02:32:09'),
('06a9abf9-f77f-4e48-918f-eeb8e8a087cb', NULL, 'image', 'completed', '/uploads/06a9abf9-f77f-4e48-918f-eeb8e8a087cb/06a9abf9-f77f-4e48-918f-eeb8e8a087cb.jpg', 0.545387, '2025-04-28 01:15:15'),
('09b43049-1ed0-4bd2-8d09-f2be624e2499', NULL, 'image', 'completed', '/uploads/09b43049-1ed0-4bd2-8d09-f2be624e2499/09b43049-1ed0-4bd2-8d09-f2be624e2499.jpg', 0.876784, '2025-04-22 02:20:43'),
('11b40389-1493-485b-af73-250006220a35', NULL, 'image', 'completed', '/uploads/11b40389-1493-485b-af73-250006220a35/11b40389-1493-485b-af73-250006220a35.jpg', 1.09241, '2025-04-21 14:34:39'),
('12875ac1-bfd0-4a27-94f6-70a51d78e412', NULL, 'image', 'completed', '/uploads/12875ac1-bfd0-4a27-94f6-70a51d78e412/12875ac1-bfd0-4a27-94f6-70a51d78e412.jpg', 0.510276, '2025-04-21 14:37:48'),
('287012dc-8662-43b8-87f4-d42c00be584a', NULL, 'video', 'completed', '/uploads/287012dc-8662-43b8-87f4-d42c00be584a/287012dc-8662-43b8-87f4-d42c00be584a.mp4', 51.3145, '2025-04-21 15:00:45'),
('2ad17927-5a5e-4168-84b7-bb616d3e6711', NULL, 'image', 'completed', '/uploads/2ad17927-5a5e-4168-84b7-bb616d3e6711/2ad17927-5a5e-4168-84b7-bb616d3e6711.jpg', 0.805572, '2025-04-22 02:28:32'),
('2c4edd67-6e0a-4fb2-bad0-fc0f7958bafb', NULL, 'image', 'completed', '/uploads/2c4edd67-6e0a-4fb2-bad0-fc0f7958bafb/2c4edd67-6e0a-4fb2-bad0-fc0f7958bafb.jpg', 0.78023, '2025-04-22 02:29:02'),
('31d8e6cc-f840-48fc-8d2f-8375f9ef5336', NULL, 'image', 'completed', '/uploads/31d8e6cc-f840-48fc-8d2f-8375f9ef5336/31d8e6cc-f840-48fc-8d2f-8375f9ef5336.jpg', 0.531705, '2025-04-21 14:53:00'),
('353cc775-143d-4a5f-8245-29995c254038', NULL, 'image', 'completed', '/uploads/353cc775-143d-4a5f-8245-29995c254038/353cc775-143d-4a5f-8245-29995c254038.jpg', 0.51732, '2025-04-21 14:36:25'),
('3b5ff6af-399c-4951-a0bc-0ee7a0fca512', NULL, 'image', 'completed', '/uploads/3b5ff6af-399c-4951-a0bc-0ee7a0fca512/3b5ff6af-399c-4951-a0bc-0ee7a0fca512.jpg', 0.611333, '2025-04-21 14:40:25'),
('3d3a0635-98ca-42c9-b6e4-8d8fec74991f', NULL, 'image', 'completed', '/uploads/3d3a0635-98ca-42c9-b6e4-8d8fec74991f/3d3a0635-98ca-42c9-b6e4-8d8fec74991f.jpg', 0.550576, '2025-04-21 14:52:51'),
('4277f543-2b6c-462a-a119-988da05f4302', NULL, 'image', 'completed', '/uploads/4277f543-2b6c-462a-a119-988da05f4302/4277f543-2b6c-462a-a119-988da05f4302.jpg', 0.533617, '2025-04-21 14:43:19'),
('4373a029-b2c5-4467-bb23-40d97f5f1c73', NULL, 'image', 'completed', '/uploads/4373a029-b2c5-4467-bb23-40d97f5f1c73/4373a029-b2c5-4467-bb23-40d97f5f1c73.jpg', 0.529814, '2025-04-21 14:48:48'),
('44f53e81-308c-418c-b751-0803f44a36fa', NULL, 'video', 'completed', '/uploads/44f53e81-308c-418c-b751-0803f44a36fa/44f53e81-308c-418c-b751-0803f44a36fa.mp4', 52.2243, '2025-04-21 15:20:06'),
('52e99f82-20ec-4c5a-9e10-d76501012a7f', NULL, 'image', 'completed', '/uploads/52e99f82-20ec-4c5a-9e10-d76501012a7f/52e99f82-20ec-4c5a-9e10-d76501012a7f.jpg', 0.551653, '2025-04-21 14:48:03'),
('65a99741-3703-4304-b7a5-69331c688e75', NULL, 'image', 'completed', '/uploads/65a99741-3703-4304-b7a5-69331c688e75/65a99741-3703-4304-b7a5-69331c688e75.jpg', 0.744817, '2025-04-22 02:23:53'),
('70f688f9-7830-490a-b398-19d9301d8e1e', NULL, 'video', 'completed', '/uploads/70f688f9-7830-490a-b398-19d9301d8e1e/70f688f9-7830-490a-b398-19d9301d8e1e.mp4', 57.3166, '2025-04-21 14:57:42'),
('739e7a8c-7a04-4e12-9f4d-034bdbb6fb9a', NULL, 'image', 'completed', '/uploads/739e7a8c-7a04-4e12-9f4d-034bdbb6fb9a/739e7a8c-7a04-4e12-9f4d-034bdbb6fb9a.jpg', 0.565476, '2025-04-21 14:41:15'),
('75d1da18-0482-4380-9d7b-96bd21c2b92d', NULL, 'image', 'completed', '/uploads/75d1da18-0482-4380-9d7b-96bd21c2b92d/75d1da18-0482-4380-9d7b-96bd21c2b92d.jpg', 0.537294, '2025-04-21 14:48:40'),
('7899f17d-7518-471c-bf09-c1172eb226f2', NULL, 'image', 'completed', '/uploads/7899f17d-7518-471c-bf09-c1172eb226f2/7899f17d-7518-471c-bf09-c1172eb226f2.jpg', 0.508996, '2025-04-21 14:51:02'),
('88f10e0f-ea32-4792-83ad-150ff51015e4', NULL, 'image', 'completed', '/uploads/88f10e0f-ea32-4792-83ad-150ff51015e4/88f10e0f-ea32-4792-83ad-150ff51015e4.jpg', 0.561613, '2025-04-21 14:41:00'),
('8b43858c-e7ed-4fac-ab2d-31eb328dcbc1', NULL, 'video', 'completed', '/uploads/8b43858c-e7ed-4fac-ab2d-31eb328dcbc1/8b43858c-e7ed-4fac-ab2d-31eb328dcbc1.mp4', 52.8143, '2025-04-21 15:21:25'),
('95933361-f5fe-4a5d-a866-87b9e20c1981', NULL, 'video', 'completed', '/uploads/95933361-f5fe-4a5d-a866-87b9e20c1981/95933361-f5fe-4a5d-a866-87b9e20c1981.mp4', 52.2429, '2025-04-21 15:16:57'),
('b2cbb57b-3ce1-47b8-9975-6dc7e21c883f', NULL, 'image', 'completed', '/uploads/b2cbb57b-3ce1-47b8-9975-6dc7e21c883f/b2cbb57b-3ce1-47b8-9975-6dc7e21c883f.jpg', 0.576241, '2025-04-21 14:36:30'),
('c021e17f-cc99-42a9-b741-4ce3285b16fe', NULL, 'video', 'completed', '/uploads/c021e17f-cc99-42a9-b741-4ce3285b16fe/c021e17f-cc99-42a9-b741-4ce3285b16fe.mp4', 53.0971, '2025-04-21 15:25:16'),
('c9e8744c-1c6a-4f1f-bd5a-0ace2229fad7', NULL, 'image', 'completed', '/uploads/c9e8744c-1c6a-4f1f-bd5a-0ace2229fad7/c9e8744c-1c6a-4f1f-bd5a-0ace2229fad7.jpg', 0.561429, '2025-04-21 14:35:06'),
('cc78b1bb-da2f-46e1-a4a0-05876f93e140', NULL, 'image', 'completed', '/uploads/cc78b1bb-da2f-46e1-a4a0-05876f93e140/cc78b1bb-da2f-46e1-a4a0-05876f93e140.jpg', 0.557283, '2025-04-21 14:35:37'),
('d31e2b94-7f89-4399-abc9-594d3b4af2cd', NULL, 'image', 'completed', '/uploads/d31e2b94-7f89-4399-abc9-594d3b4af2cd/d31e2b94-7f89-4399-abc9-594d3b4af2cd.jpg', 0.536991, '2025-04-21 14:52:14'),
('d599ad37-795e-4de5-96a6-2c1d0709516e', NULL, 'image', 'completed', '/uploads/d599ad37-795e-4de5-96a6-2c1d0709516e/d599ad37-795e-4de5-96a6-2c1d0709516e.jpg', 0.674595, '2025-04-22 02:20:25'),
('ef08e075-c2e4-4b5b-988a-b1dbcf822448', NULL, 'image', 'completed', '/uploads/ef08e075-c2e4-4b5b-988a-b1dbcf822448/ef08e075-c2e4-4b5b-988a-b1dbcf822448.jpg', 1.47703, '2025-04-22 02:20:17'),
('f523b8a7-51c2-40aa-bf7b-f6ef8dd8efd7', NULL, 'image', 'completed', '/uploads/f523b8a7-51c2-40aa-bf7b-f6ef8dd8efd7/f523b8a7-51c2-40aa-bf7b-f6ef8dd8efd7.jpg', 0.544746, '2025-04-21 14:37:51'),
('f80f8bca-02eb-40d4-8fad-876e2be0bf9d', NULL, 'image', 'completed', '/uploads/f80f8bca-02eb-40d4-8fad-876e2be0bf9d/f80f8bca-02eb-40d4-8fad-876e2be0bf9d.jpg', 0.581274, '2025-04-21 14:35:10');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `task_results`
--

CREATE TABLE `task_results` (
  `id` int(11) NOT NULL,
  `task_id` char(36) DEFAULT NULL,
  `frame_number` int(11) DEFAULT NULL,
  `timestamp` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `task_results`
--

INSERT INTO `task_results` (`id`, `task_id`, `frame_number`, `timestamp`, `created_at`) VALUES
(1, '11b40389-1493-485b-af73-250006220a35', 0, '0', '2025-04-21 14:34:40'),
(2, 'c9e8744c-1c6a-4f1f-bd5a-0ace2229fad7', 0, '0', '2025-04-21 14:35:07'),
(3, 'f80f8bca-02eb-40d4-8fad-876e2be0bf9d', 0, '0', '2025-04-21 14:35:10'),
(4, 'cc78b1bb-da2f-46e1-a4a0-05876f93e140', 0, '0', '2025-04-21 14:35:38'),
(5, '353cc775-143d-4a5f-8245-29995c254038', 0, '0', '2025-04-21 14:36:25'),
(6, 'b2cbb57b-3ce1-47b8-9975-6dc7e21c883f', 0, '0', '2025-04-21 14:36:30'),
(7, '12875ac1-bfd0-4a27-94f6-70a51d78e412', 0, '0', '2025-04-21 14:37:48'),
(8, 'f523b8a7-51c2-40aa-bf7b-f6ef8dd8efd7', 0, '0', '2025-04-21 14:37:51'),
(9, '3b5ff6af-399c-4951-a0bc-0ee7a0fca512', 0, '0', '2025-04-21 14:40:26'),
(10, '88f10e0f-ea32-4792-83ad-150ff51015e4', 0, '0', '2025-04-21 14:41:01'),
(11, '739e7a8c-7a04-4e12-9f4d-034bdbb6fb9a', 0, '0', '2025-04-21 14:41:15'),
(12, '4277f543-2b6c-462a-a119-988da05f4302', 0, '0', '2025-04-21 14:43:20'),
(13, '52e99f82-20ec-4c5a-9e10-d76501012a7f', 0, '0', '2025-04-21 14:48:03'),
(14, '75d1da18-0482-4380-9d7b-96bd21c2b92d', 0, '0', '2025-04-21 14:48:41'),
(15, '4373a029-b2c5-4467-bb23-40d97f5f1c73', 0, '0', '2025-04-21 14:48:48'),
(16, '7899f17d-7518-471c-bf09-c1172eb226f2', 0, '0', '2025-04-21 14:51:03'),
(17, 'd31e2b94-7f89-4399-abc9-594d3b4af2cd', 0, '0', '2025-04-21 14:52:14'),
(18, '3d3a0635-98ca-42c9-b6e4-8d8fec74991f', 0, '0', '2025-04-21 14:52:52'),
(19, '31d8e6cc-f840-48fc-8d2f-8375f9ef5336', 0, '0', '2025-04-21 14:53:01'),
(20, '70f688f9-7830-490a-b398-19d9301d8e1e', 255, '0:00:08.500', '2025-04-21 14:58:41'),
(21, '70f688f9-7830-490a-b398-19d9301d8e1e', 260, '0:00:08.666', '2025-04-21 14:58:41'),
(22, '70f688f9-7830-490a-b398-19d9301d8e1e', 270, '0:00:09.000', '2025-04-21 14:58:41'),
(23, '70f688f9-7830-490a-b398-19d9301d8e1e', 275, '0:00:09.166', '2025-04-21 14:58:41'),
(24, '70f688f9-7830-490a-b398-19d9301d8e1e', 280, '0:00:09.333', '2025-04-21 14:58:41'),
(25, '70f688f9-7830-490a-b398-19d9301d8e1e', 285, '0:00:09.500', '2025-04-21 14:58:41'),
(26, '70f688f9-7830-490a-b398-19d9301d8e1e', 290, '0:00:09.666', '2025-04-21 14:58:41'),
(27, '70f688f9-7830-490a-b398-19d9301d8e1e', 295, '0:00:09.833', '2025-04-21 14:58:41'),
(28, '70f688f9-7830-490a-b398-19d9301d8e1e', 300, '0:00:10.000', '2025-04-21 14:58:41'),
(29, '70f688f9-7830-490a-b398-19d9301d8e1e', 305, '0:00:10.166', '2025-04-21 14:58:41'),
(30, '70f688f9-7830-490a-b398-19d9301d8e1e', 310, '0:00:10.333', '2025-04-21 14:58:41'),
(31, '70f688f9-7830-490a-b398-19d9301d8e1e', 315, '0:00:10.500', '2025-04-21 14:58:41'),
(32, '70f688f9-7830-490a-b398-19d9301d8e1e', 320, '0:00:10.666', '2025-04-21 14:58:41'),
(33, '70f688f9-7830-490a-b398-19d9301d8e1e', 325, '0:00:10.833', '2025-04-21 14:58:41'),
(34, '287012dc-8662-43b8-87f4-d42c00be584a', 255, '0:00:08.500', '2025-04-21 15:01:38'),
(35, '287012dc-8662-43b8-87f4-d42c00be584a', 260, '0:00:08.666', '2025-04-21 15:01:38'),
(36, '287012dc-8662-43b8-87f4-d42c00be584a', 270, '0:00:09.000', '2025-04-21 15:01:38'),
(37, '287012dc-8662-43b8-87f4-d42c00be584a', 275, '0:00:09.166', '2025-04-21 15:01:38'),
(38, '287012dc-8662-43b8-87f4-d42c00be584a', 280, '0:00:09.333', '2025-04-21 15:01:38'),
(39, '287012dc-8662-43b8-87f4-d42c00be584a', 285, '0:00:09.500', '2025-04-21 15:01:38'),
(40, '287012dc-8662-43b8-87f4-d42c00be584a', 290, '0:00:09.666', '2025-04-21 15:01:38'),
(41, '287012dc-8662-43b8-87f4-d42c00be584a', 295, '0:00:09.833', '2025-04-21 15:01:38'),
(42, '287012dc-8662-43b8-87f4-d42c00be584a', 300, '0:00:10.000', '2025-04-21 15:01:38'),
(43, '287012dc-8662-43b8-87f4-d42c00be584a', 305, '0:00:10.166', '2025-04-21 15:01:38'),
(44, '287012dc-8662-43b8-87f4-d42c00be584a', 310, '0:00:10.333', '2025-04-21 15:01:38'),
(45, '287012dc-8662-43b8-87f4-d42c00be584a', 315, '0:00:10.500', '2025-04-21 15:01:38'),
(46, '287012dc-8662-43b8-87f4-d42c00be584a', 320, '0:00:10.666', '2025-04-21 15:01:38'),
(47, '287012dc-8662-43b8-87f4-d42c00be584a', 325, '0:00:10.833', '2025-04-21 15:01:38'),
(48, '95933361-f5fe-4a5d-a866-87b9e20c1981', 255, '0:00:08.500', '2025-04-21 15:17:50'),
(49, '95933361-f5fe-4a5d-a866-87b9e20c1981', 260, '0:00:08.666', '2025-04-21 15:17:50'),
(50, '95933361-f5fe-4a5d-a866-87b9e20c1981', 270, '0:00:09.000', '2025-04-21 15:17:50'),
(51, '95933361-f5fe-4a5d-a866-87b9e20c1981', 275, '0:00:09.166', '2025-04-21 15:17:50'),
(52, '95933361-f5fe-4a5d-a866-87b9e20c1981', 280, '0:00:09.333', '2025-04-21 15:17:50'),
(53, '95933361-f5fe-4a5d-a866-87b9e20c1981', 285, '0:00:09.500', '2025-04-21 15:17:50'),
(54, '95933361-f5fe-4a5d-a866-87b9e20c1981', 290, '0:00:09.666', '2025-04-21 15:17:50'),
(55, '95933361-f5fe-4a5d-a866-87b9e20c1981', 295, '0:00:09.833', '2025-04-21 15:17:50'),
(56, '95933361-f5fe-4a5d-a866-87b9e20c1981', 300, '0:00:10.000', '2025-04-21 15:17:50'),
(57, '95933361-f5fe-4a5d-a866-87b9e20c1981', 305, '0:00:10.166', '2025-04-21 15:17:50'),
(58, '95933361-f5fe-4a5d-a866-87b9e20c1981', 310, '0:00:10.333', '2025-04-21 15:17:50'),
(59, '95933361-f5fe-4a5d-a866-87b9e20c1981', 315, '0:00:10.500', '2025-04-21 15:17:50'),
(60, '95933361-f5fe-4a5d-a866-87b9e20c1981', 320, '0:00:10.666', '2025-04-21 15:17:50'),
(61, '95933361-f5fe-4a5d-a866-87b9e20c1981', 325, '0:00:10.833', '2025-04-21 15:17:50'),
(62, '44f53e81-308c-418c-b751-0803f44a36fa', 255, '0:00:08.500', '2025-04-21 15:21:00'),
(63, '44f53e81-308c-418c-b751-0803f44a36fa', 260, '0:00:08.666', '2025-04-21 15:21:00'),
(64, '44f53e81-308c-418c-b751-0803f44a36fa', 270, '0:00:09.000', '2025-04-21 15:21:00'),
(65, '44f53e81-308c-418c-b751-0803f44a36fa', 275, '0:00:09.166', '2025-04-21 15:21:00'),
(66, '44f53e81-308c-418c-b751-0803f44a36fa', 280, '0:00:09.333', '2025-04-21 15:21:00'),
(67, '44f53e81-308c-418c-b751-0803f44a36fa', 285, '0:00:09.500', '2025-04-21 15:21:00'),
(68, '44f53e81-308c-418c-b751-0803f44a36fa', 290, '0:00:09.666', '2025-04-21 15:21:00'),
(69, '44f53e81-308c-418c-b751-0803f44a36fa', 295, '0:00:09.833', '2025-04-21 15:21:00'),
(70, '44f53e81-308c-418c-b751-0803f44a36fa', 300, '0:00:10.000', '2025-04-21 15:21:00'),
(71, '44f53e81-308c-418c-b751-0803f44a36fa', 305, '0:00:10.166', '2025-04-21 15:21:00'),
(72, '44f53e81-308c-418c-b751-0803f44a36fa', 310, '0:00:10.333', '2025-04-21 15:21:00'),
(73, '44f53e81-308c-418c-b751-0803f44a36fa', 315, '0:00:10.500', '2025-04-21 15:21:00'),
(74, '44f53e81-308c-418c-b751-0803f44a36fa', 320, '0:00:10.666', '2025-04-21 15:21:00'),
(75, '44f53e81-308c-418c-b751-0803f44a36fa', 325, '0:00:10.833', '2025-04-21 15:21:00'),
(76, '8b43858c-e7ed-4fac-ab2d-31eb328dcbc1', 255, '0:00:08.500', '2025-04-21 15:22:19'),
(77, '8b43858c-e7ed-4fac-ab2d-31eb328dcbc1', 260, '0:00:08.666', '2025-04-21 15:22:19'),
(78, '8b43858c-e7ed-4fac-ab2d-31eb328dcbc1', 270, '0:00:09.000', '2025-04-21 15:22:19'),
(79, '8b43858c-e7ed-4fac-ab2d-31eb328dcbc1', 275, '0:00:09.166', '2025-04-21 15:22:19'),
(80, '8b43858c-e7ed-4fac-ab2d-31eb328dcbc1', 280, '0:00:09.333', '2025-04-21 15:22:19'),
(81, '8b43858c-e7ed-4fac-ab2d-31eb328dcbc1', 285, '0:00:09.500', '2025-04-21 15:22:19'),
(82, '8b43858c-e7ed-4fac-ab2d-31eb328dcbc1', 290, '0:00:09.666', '2025-04-21 15:22:19'),
(83, '8b43858c-e7ed-4fac-ab2d-31eb328dcbc1', 295, '0:00:09.833', '2025-04-21 15:22:19'),
(84, '8b43858c-e7ed-4fac-ab2d-31eb328dcbc1', 300, '0:00:10.000', '2025-04-21 15:22:19'),
(85, '8b43858c-e7ed-4fac-ab2d-31eb328dcbc1', 305, '0:00:10.166', '2025-04-21 15:22:19'),
(86, '8b43858c-e7ed-4fac-ab2d-31eb328dcbc1', 310, '0:00:10.333', '2025-04-21 15:22:19'),
(87, '8b43858c-e7ed-4fac-ab2d-31eb328dcbc1', 315, '0:00:10.500', '2025-04-21 15:22:19'),
(88, '8b43858c-e7ed-4fac-ab2d-31eb328dcbc1', 320, '0:00:10.666', '2025-04-21 15:22:19'),
(89, '8b43858c-e7ed-4fac-ab2d-31eb328dcbc1', 325, '0:00:10.833', '2025-04-21 15:22:19'),
(90, 'c021e17f-cc99-42a9-b741-4ce3285b16fe', 255, '0:00:08.500', '2025-04-21 15:26:10'),
(91, 'c021e17f-cc99-42a9-b741-4ce3285b16fe', 260, '0:00:08.666', '2025-04-21 15:26:10'),
(92, 'c021e17f-cc99-42a9-b741-4ce3285b16fe', 270, '0:00:09.000', '2025-04-21 15:26:10'),
(93, 'c021e17f-cc99-42a9-b741-4ce3285b16fe', 275, '0:00:09.166', '2025-04-21 15:26:10'),
(94, 'c021e17f-cc99-42a9-b741-4ce3285b16fe', 280, '0:00:09.333', '2025-04-21 15:26:10'),
(95, 'c021e17f-cc99-42a9-b741-4ce3285b16fe', 285, '0:00:09.500', '2025-04-21 15:26:10'),
(96, 'c021e17f-cc99-42a9-b741-4ce3285b16fe', 290, '0:00:09.666', '2025-04-21 15:26:10'),
(97, 'c021e17f-cc99-42a9-b741-4ce3285b16fe', 295, '0:00:09.833', '2025-04-21 15:26:10'),
(98, 'c021e17f-cc99-42a9-b741-4ce3285b16fe', 300, '0:00:10.000', '2025-04-21 15:26:10'),
(99, 'c021e17f-cc99-42a9-b741-4ce3285b16fe', 305, '0:00:10.166', '2025-04-21 15:26:10'),
(100, 'c021e17f-cc99-42a9-b741-4ce3285b16fe', 310, '0:00:10.333', '2025-04-21 15:26:10'),
(101, 'c021e17f-cc99-42a9-b741-4ce3285b16fe', 315, '0:00:10.500', '2025-04-21 15:26:10'),
(102, 'c021e17f-cc99-42a9-b741-4ce3285b16fe', 320, '0:00:10.666', '2025-04-21 15:26:10'),
(103, 'c021e17f-cc99-42a9-b741-4ce3285b16fe', 325, '0:00:10.833', '2025-04-21 15:26:10'),
(104, 'ef08e075-c2e4-4b5b-988a-b1dbcf822448', 0, '0', '2025-04-22 02:20:18'),
(105, 'd599ad37-795e-4de5-96a6-2c1d0709516e', 0, '0', '2025-04-22 02:20:26'),
(106, '09b43049-1ed0-4bd2-8d09-f2be624e2499', 0, '0', '2025-04-22 02:20:44'),
(107, '65a99741-3703-4304-b7a5-69331c688e75', 0, '0', '2025-04-22 02:23:54'),
(108, '2ad17927-5a5e-4168-84b7-bb616d3e6711', 0, '0', '2025-04-22 02:28:33'),
(109, '2c4edd67-6e0a-4fb2-bad0-fc0f7958bafb', 0, '0', '2025-04-22 02:29:03'),
(110, '058e24ae-8341-4c66-96f0-f37e02a9698d', 0, '0', '2025-04-22 02:31:39'),
(111, '062ce587-478e-4db6-b448-72dc7938152d', 0, '0', '2025-04-22 02:32:10'),
(112, '06a9abf9-f77f-4e48-918f-eeb8e8a087cb', 0, '0', '2025-04-28 01:15:16');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password_hash` text NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `role` varchar(50) DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `username`, `password_hash`, `email`, `role`, `created_at`) VALUES
(1, 'admin', 'admin1223@', 'admin@q23', 'admin', '2025-04-21 14:32:25');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `blacklist_vehicles`
--
ALTER TABLE `blacklist_vehicles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `plate_number` (`plate_number`),
  ADD KEY `report_by` (`report_by`);

--
-- Chỉ mục cho bảng `detected_vehicles`
--
ALTER TABLE `detected_vehicles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `result_id` (`result_id`);

--
-- Chỉ mục cho bảng `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `task_results`
--
ALTER TABLE `task_results`
  ADD PRIMARY KEY (`id`),
  ADD KEY `task_id` (`task_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `blacklist_vehicles`
--
ALTER TABLE `blacklist_vehicles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `detected_vehicles`
--
ALTER TABLE `detected_vehicles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=164;

--
-- AUTO_INCREMENT cho bảng `task_results`
--
ALTER TABLE `task_results`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=113;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `blacklist_vehicles`
--
ALTER TABLE `blacklist_vehicles`
  ADD CONSTRAINT `blacklist_vehicles_ibfk_1` FOREIGN KEY (`report_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `detected_vehicles`
--
ALTER TABLE `detected_vehicles`
  ADD CONSTRAINT `detected_vehicles_ibfk_1` FOREIGN KEY (`result_id`) REFERENCES `task_results` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `task_results`
--
ALTER TABLE `task_results`
  ADD CONSTRAINT `task_results_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
