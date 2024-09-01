-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 01, 2024 at 06:40 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `stockin`
--

-- --------------------------------------------------------

--
-- Table structure for table `bodega`
--

CREATE TABLE `bodega` (
  `id_bodega` int(11) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL,
  `telefono` varchar(18) DEFAULT NULL,
  `direccion` varchar(50) DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `informe_diario`
--

CREATE TABLE `informe_diario` (
  `id_informe` int(11) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `fecha_creacion` date DEFAULT NULL,
  `ganacia_producto_diario` decimal(15,2) DEFAULT NULL,
  `ventas_diarias` int(11) DEFAULT NULL,
  `capital` decimal(15,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `informe_diario_producto`
--

CREATE TABLE `informe_diario_producto` (
  `detalle` int(11) NOT NULL,
  `id_informe_diario` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `ganacia_total` decimal(15,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `informe_mensual`
--

CREATE TABLE `informe_mensual` (
  `id_informe` int(11) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `fecha_creacion` date DEFAULT NULL,
  `ventas_mensual` int(11) DEFAULT NULL,
  `ganacia_producto_mensual` decimal(15,2) DEFAULT NULL,
  `capital` decimal(15,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `informe_mensual_producto`
--

CREATE TABLE `informe_mensual_producto` (
  `detalle` int(11) NOT NULL,
  `id_informe_mensual` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `ganacia_total` decimal(15,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pedido`
--

CREATE TABLE `pedido` (
  `id_pedido` int(11) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `cantidad_unidad` int(11) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `id_proveedor` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pedido_producto`
--

CREATE TABLE `pedido_producto` (
  `detalle` int(11) NOT NULL,
  `id_pedido` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `producto`
--

CREATE TABLE `producto` (
  `id_producto` int(11) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `marca` varchar(50) DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL,
  `categoria` varchar(30) DEFAULT NULL,
  `precio_costo` decimal(15,2) DEFAULT NULL,
  `precio_publico` decimal(15,2) DEFAULT NULL,
  `cantidad_minima` int(11) DEFAULT NULL,
  `cantidad_inicial` int(11) DEFAULT NULL,
  `ganancia` decimal(15,2) DEFAULT NULL,
  `stock_actual` int(11) DEFAULT NULL,
  `id_bodega` int(11) NOT NULL,
  `id_proveedor` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `proveedor`
--

CREATE TABLE `proveedor` (
  `id_proveedor` int(11) NOT NULL,
  `nombres` varchar(50) DEFAULT NULL,
  `apellidos` varchar(50) DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL,
  `cuidad` varchar(30) DEFAULT NULL,
  `direccion` varchar(50) DEFAULT NULL,
  `telefono` varchar(18) DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL,
  `nombres` varchar(50) DEFAULT NULL,
  `apellidos` varchar(50) DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL,
  `telefono` varchar(18) DEFAULT NULL,
  `tipo_usuario` varchar(8) DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bodega`
--
ALTER TABLE `bodega`
  ADD PRIMARY KEY (`id_bodega`),
  ADD KEY `FK_BODEGA_USUARIO` (`id_usuario`);

--
-- Indexes for table `informe_diario`
--
ALTER TABLE `informe_diario`
  ADD PRIMARY KEY (`id_informe`);

--
-- Indexes for table `informe_diario_producto`
--
ALTER TABLE `informe_diario_producto`
  ADD PRIMARY KEY (`detalle`),
  ADD KEY `FK_INFORME_DIARIO_PRODUCTO` (`id_informe_diario`),
  ADD KEY `FK_INFORME_DIARIO_PRODUCTO_2` (`id_producto`);

--
-- Indexes for table `informe_mensual`
--
ALTER TABLE `informe_mensual`
  ADD PRIMARY KEY (`id_informe`);

--
-- Indexes for table `informe_mensual_producto`
--
ALTER TABLE `informe_mensual_producto`
  ADD PRIMARY KEY (`detalle`),
  ADD KEY `FK_INFORME_MENSUAL_PRODUCTO` (`id_informe_mensual`),
  ADD KEY `FK_INFORME_MENSUAL_PRODUCTO_2` (`id_producto`);

--
-- Indexes for table `pedido`
--
ALTER TABLE `pedido`
  ADD PRIMARY KEY (`id_pedido`),
  ADD KEY `FK_PEDIDO_PROVEEDOR` (`id_proveedor`);

--
-- Indexes for table `pedido_producto`
--
ALTER TABLE `pedido_producto`
  ADD PRIMARY KEY (`detalle`),
  ADD KEY `FK_PEDIDO_PRODUCTO` (`id_pedido`),
  ADD KEY `FK_PEDIDO_PRODUCTO_2` (`id_producto`);

--
-- Indexes for table `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`id_producto`),
  ADD KEY `FK_PRODUCTO_BODEGA` (`id_bodega`),
  ADD KEY `FK_PRODUCTO_PROVEEDOR` (`id_proveedor`);

--
-- Indexes for table `proveedor`
--
ALTER TABLE `proveedor`
  ADD PRIMARY KEY (`id_proveedor`);

--
-- Indexes for table `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bodega`
--
ALTER TABLE `bodega`
  ADD CONSTRAINT `FK_BODEGA_USUARIO` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `informe_diario_producto`
--
ALTER TABLE `informe_diario_producto`
  ADD CONSTRAINT `FK_INFORME_DIARIO_PRODUCTO` FOREIGN KEY (`id_informe_diario`) REFERENCES `informe_diario` (`id_informe`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_INFORME_DIARIO_PRODUCTO_2` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `informe_mensual_producto`
--
ALTER TABLE `informe_mensual_producto`
  ADD CONSTRAINT `FK_INFORME_MENSUAL_PRODUCTO` FOREIGN KEY (`id_informe_mensual`) REFERENCES `informe_mensual` (`id_informe`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_INFORME_MENSUAL_PRODUCTO_2` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `pedido`
--
ALTER TABLE `pedido`
  ADD CONSTRAINT `FK_PEDIDO_PROVEEDOR` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedor` (`id_proveedor`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `pedido_producto`
--
ALTER TABLE `pedido_producto`
  ADD CONSTRAINT `FK_PEDIDO_PRODUCTO` FOREIGN KEY (`id_pedido`) REFERENCES `pedido` (`id_pedido`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_PEDIDO_PRODUCTO_2` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `producto`
--
ALTER TABLE `producto`
  ADD CONSTRAINT `FK_PRODUCTO_BODEGA` FOREIGN KEY (`id_bodega`) REFERENCES `bodega` (`id_bodega`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_PRODUCTO_PROVEEDOR` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedor` (`id_proveedor`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
