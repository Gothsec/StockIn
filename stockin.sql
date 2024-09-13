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

-- Volcando estructura para tabla stockin.login
CREATE TABLE IF NOT EXISTS `login` (
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `role` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla stockin.login: ~2 rows (aproximadamente)
INSERT INTO `login` (`email`, `password`, `role`) VALUES
	('jhon2020@gmail.com', 'root', 'admin'),
	('empleado@gmail.com', 'root', 'empleado');

-- Volcando estructura para tabla stockin.product
CREATE TABLE IF NOT EXISTS `product` (
  `id` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `stock` int(11) DEFAULT NULL,
  `precioCosto` decimal(20,2) DEFAULT NULL,
  `precioPublico` decimal(20,2) DEFAULT NULL,
  `ganancia` decimal(20,2) DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  `categoria` varchar(50) DEFAULT NULL,
  `cantidadMinima` int(11) DEFAULT NULL,
  `marca` varchar(50) DEFAULT NULL,
  `bodega` varchar(50) DEFAULT NULL,
  `proveedor` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla stockin.product: ~4 rows (aproximadamente)
INSERT INTO `product` (`id`, `name`, `stock`, `precioCosto`, `precioPublico`, `ganancia`, `estado`, `categoria`, `cantidadMinima`, `marca`, `bodega`, `proveedor`) VALUES
	(6, 'Cera', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	(12345, 'Crema para peinar', 50, 37500.00, 42500.00, 5000.00, 'activo', 'cuidado cabelludo', 5, 'loreal', 'principal', 'recamier'),
	(122222, 'Capa', 50, 36000.00, 47000.00, 11000.00, 'activo', 'barberia', 5, 'loreal', 'principal', 'recamier'),
	(146223, 'Maquina shavear', 10, 120000.00, 160000.00, 40000.00, 'activo', 'barberia', 2, 'whall', 'principal', 'whall medillin');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
