-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 20, 2026 at 04:35 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `carslist`
--

-- --------------------------------------------------------

--
-- Table structure for table `favorites`
--

CREATE TABLE `favorites` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `listing_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `favorites`
--

INSERT INTO `favorites` (`id`, `user_id`, `listing_id`, `created_at`) VALUES
(5, 3, 3, '2026-04-20 01:58:57');

-- --------------------------------------------------------

--
-- Table structure for table `listings`
--

CREATE TABLE `listings` (
  `id` int(11) NOT NULL,
  `seller_id` int(11) NOT NULL,
  `make` varchar(50) NOT NULL,
  `model` varchar(50) NOT NULL,
  `year` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `mileage` int(11) NOT NULL,
  `color` varchar(50) DEFAULT NULL,
  `title_status` varchar(50) NOT NULL,
  `transmission` varchar(50) NOT NULL,
  `fuel_type` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `status` enum('available','sold') DEFAULT 'available',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `listings`
--

INSERT INTO `listings` (`id`, `seller_id`, `make`, `model`, `year`, `price`, `mileage`, `color`, `title_status`, `transmission`, `fuel_type`, `description`, `image_url`, `status`, `created_at`, `updated_at`) VALUES
(2, 4, 'Hyuandi', 'Sonata', 2019, 11000.00, 55000, 'Red', 'Clean', '6 speed automatic', 'gas', 'Speedy and good with gas', '/CarsList/backend/uploads/car_69e58b681159f0.68451195.jpg', 'available', '2026-04-20 01:23:26', '2026-04-20 02:12:00'),
(3, 4, 'Nissan', 'Rouge', 2025, 39000.00, 12000, 'Blue', 'Clean', '6 speed automatic', 'Gas', 'Big and hunky car', '/CarsList/backend/uploads/car_69e58b5d93c341.54000934.jpg', 'available', '2026-04-20 01:24:58', '2026-04-20 02:11:45'),
(4, 5, 'Laborghini', 'Aventador', 2020, 200000.00, 25000, 'Gold', 'Salvaged', '7 Speed Automatic', 'Gas', 'Cool car and fast', '/CarsList/backend/uploads/car_69e58af457d162.95816694.jpg', 'sold', '2026-04-20 01:34:26', '2026-04-20 02:09:58'),
(5, 4, 'Honda', 'Civic', 2020, 14500.00, 85000, 'Black', 'Rebuilt', '5 Speed Automatic', 'Gas', 'Reliable but rebuilt', '/CarsList/backend/uploads/car_69e58be70ab060.74426775.webp', 'available', '2026-04-20 02:14:00', '2026-04-20 02:14:00');

-- --------------------------------------------------------

--
-- Table structure for table `offers`
--

CREATE TABLE `offers` (
  `id` int(11) NOT NULL,
  `listing_id` int(11) NOT NULL,
  `buyer_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `message` text DEFAULT NULL,
  `status` enum('pending','accepted','rejected') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `offers`
--

INSERT INTO `offers` (`id`, `listing_id`, `buyer_id`, `amount`, `message`, `status`, `created_at`) VALUES
(2, 3, 3, 32000.00, 'I\'ll give you a buck 50 on top', 'pending', '2026-04-20 01:42:09'),
(3, 2, 3, 9500.00, 'I\'ll also give you a 4 wheel set', 'pending', '2026-04-20 01:59:40');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('buyer','seller') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `created_at`) VALUES
(1, 'Moe Seller', 'moe@example.com', '$2y$10$PX22IS8xRliJbowd70jW8enLcY2EfCx28zaibi2DcEh/KyHsI84YG', 'seller', '2026-04-17 23:08:47'),
(2, 'John', 'John123@gmail.com', '$2y$10$NxBEt9xeumRbf5GLOkWADuu4xu1sPjz0xmpzDnkbHj8HTmfmYhY.i', 'buyer', '2026-04-19 18:16:46'),
(3, 'John2', 'Johnathon123@gmail.com', '$2y$10$0f9oJbCsDmL8oUszqVSOJOS8o3zVhlBxjVILXUAcixLHJLssxxf7a', 'buyer', '2026-04-19 18:17:34'),
(4, 'Moe', 'Moe123@gmail.com', '$2y$10$8B78q77TCoNrAuXDztUatODAMuaAJpqvfyIp/OsojWJpHcH9zdOqm', 'seller', '2026-04-20 01:21:23'),
(5, 'Some Seller', 'Joey123@gmail.com', '$2y$10$ukvhpKm3pb2bQoxbFDK2peawAkhiIxOayVjvn6V3wSChR/pSrp8NO', 'seller', '2026-04-20 01:25:21');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_favorite` (`user_id`,`listing_id`),
  ADD KEY `listing_id` (`listing_id`);

--
-- Indexes for table `listings`
--
ALTER TABLE `listings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `seller_id` (`seller_id`);

--
-- Indexes for table `offers`
--
ALTER TABLE `offers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `listing_id` (`listing_id`),
  ADD KEY `buyer_id` (`buyer_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `favorites`
--
ALTER TABLE `favorites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `listings`
--
ALTER TABLE `listings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `offers`
--
ALTER TABLE `offers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `listings`
--
ALTER TABLE `listings`
  ADD CONSTRAINT `listings_ibfk_1` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `offers`
--
ALTER TABLE `offers`
  ADD CONSTRAINT `offers_ibfk_1` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `offers_ibfk_2` FOREIGN KEY (`buyer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
