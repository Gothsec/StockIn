-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         10.4.28-MariaDB - mariadb.org binary distribution
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para stockin
CREATE DATABASE IF NOT EXISTS `stockin` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `stockin`;

-- Volcando estructura para tabla stockin.bodega
CREATE TABLE IF NOT EXISTS `bodega` (
  `id_bodega` int(11) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL,
  `telefono` varchar(18) DEFAULT NULL,
  `direccion` varchar(50) DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `id_usuario` int(11) NOT NULL,
  PRIMARY KEY (`id_bodega`),
  KEY `FK_BODEGA_USUARIO` (`id_usuario`),
  CONSTRAINT `FK_BODEGA_USUARIO` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla stockin.bodega: ~0 rows (aproximadamente)

-- Volcando estructura para tabla stockin.informe_diario
CREATE TABLE IF NOT EXISTS `informe_diario` (
  `id_informe` int(11) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `fecha_creacion` date DEFAULT NULL,
  `ganacia_producto_diario` decimal(15,2) DEFAULT NULL,
  `ventas_diarias` int(11) DEFAULT NULL,
  `capital` decimal(15,2) DEFAULT NULL,
  PRIMARY KEY (`id_informe`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla stockin.informe_diario: ~0 rows (aproximadamente)

-- Volcando estructura para tabla stockin.informe_diario_producto
CREATE TABLE IF NOT EXISTS `informe_diario_producto` (
  `detalle` int(11) NOT NULL,
  `id_informe_diario` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `ganacia_total` decimal(15,2) DEFAULT NULL,
  PRIMARY KEY (`detalle`),
  KEY `FK_INFORME_DIARIO_PRODUCTO` (`id_informe_diario`),
  KEY `FK_INFORME_DIARIO_PRODUCTO_2` (`id_producto`),
  CONSTRAINT `FK_INFORME_DIARIO_PRODUCTO` FOREIGN KEY (`id_informe_diario`) REFERENCES `informe_diario` (`id_informe`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_INFORME_DIARIO_PRODUCTO_2` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla stockin.informe_diario_producto: ~0 rows (aproximadamente)

-- Volcando estructura para tabla stockin.informe_mensual
CREATE TABLE IF NOT EXISTS `informe_mensual` (
  `id_informe` int(11) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `fecha_creacion` date DEFAULT NULL,
  `ventas_mensual` int(11) DEFAULT NULL,
  `ganacia_producto_mensual` decimal(15,2) DEFAULT NULL,
  `capital` decimal(15,2) DEFAULT NULL,
  PRIMARY KEY (`id_informe`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla stockin.informe_mensual: ~0 rows (aproximadamente)

-- Volcando estructura para tabla stockin.informe_mensual_producto
CREATE TABLE IF NOT EXISTS `informe_mensual_producto` (
  `detalle` int(11) NOT NULL,
  `id_informe_mensual` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `ganacia_total` decimal(15,2) DEFAULT NULL,
  PRIMARY KEY (`detalle`),
  KEY `FK_INFORME_MENSUAL_PRODUCTO` (`id_informe_mensual`),
  KEY `FK_INFORME_MENSUAL_PRODUCTO_2` (`id_producto`),
  CONSTRAINT `FK_INFORME_MENSUAL_PRODUCTO` FOREIGN KEY (`id_informe_mensual`) REFERENCES `informe_mensual` (`id_informe`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_INFORME_MENSUAL_PRODUCTO_2` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla stockin.informe_mensual_producto: ~0 rows (aproximadamente)

-- Volcando estructura para tabla stockin.pedido
CREATE TABLE IF NOT EXISTS `pedido` (
  `id_pedido` int(11) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `cantidad_unidad` int(11) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `id_proveedor` int(11) NOT NULL,
  PRIMARY KEY (`id_pedido`),
  KEY `FK_PEDIDO_PROVEEDOR` (`id_proveedor`),
  CONSTRAINT `FK_PEDIDO_PROVEEDOR` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedor` (`id_proveedor`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla stockin.pedido: ~0 rows (aproximadamente)

-- Volcando estructura para tabla stockin.pedido_producto
CREATE TABLE IF NOT EXISTS `pedido_producto` (
  `detalle` int(11) NOT NULL,
  `id_pedido` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  PRIMARY KEY (`detalle`),
  KEY `FK_PEDIDO_PRODUCTO` (`id_pedido`),
  KEY `FK_PEDIDO_PRODUCTO_2` (`id_producto`),
  CONSTRAINT `FK_PEDIDO_PRODUCTO` FOREIGN KEY (`id_pedido`) REFERENCES `pedido` (`id_pedido`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_PEDIDO_PRODUCTO_2` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla stockin.pedido_producto: ~0 rows (aproximadamente)

-- Volcando estructura para tabla stockin.producto
CREATE TABLE IF NOT EXISTS `producto` (
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
  `id_proveedor` int(11) NOT NULL,
  PRIMARY KEY (`id_producto`),
  KEY `FK_PRODUCTO_BODEGA` (`id_bodega`),
  KEY `FK_PRODUCTO_PROVEEDOR` (`id_proveedor`),
  CONSTRAINT `FK_PRODUCTO_BODEGA` FOREIGN KEY (`id_bodega`) REFERENCES `bodega` (`id_bodega`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_PRODUCTO_PROVEEDOR` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedor` (`id_proveedor`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla stockin.producto: ~0 rows (aproximadamente)

-- Volcando estructura para tabla stockin.proveedor
CREATE TABLE IF NOT EXISTS `proveedor` (
  `id_proveedor` int(11) NOT NULL,
  `nombres` varchar(50) DEFAULT NULL,
  `apellidos` varchar(50) DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL,
  `cuidad` varchar(30) DEFAULT NULL,
  `direccion` varchar(50) DEFAULT NULL,
  `telefono` varchar(18) DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_proveedor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla stockin.proveedor: ~0 rows (aproximadamente)

-- Volcando estructura para tabla stockin.usuario
CREATE TABLE IF NOT EXISTS `usuario` (
  `id_usuario` int(11) NOT NULL,
  `nombres` varchar(50) DEFAULT NULL,
  `apellidos` varchar(50) DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL,
  `telefono` varchar(18) DEFAULT NULL,
  `tipo_usuario` varchar(8) DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla stockin.usuario: ~0 rows (aproximadamente)

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
