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
	('rodriguezjhon2090@gmail.com', 'root', 'admin'),
	('empleado@gmail.com', 'root', 'empleado');

-- Volcando estructura para tabla stockin.product
CREATE TABLE IF NOT EXISTS `product` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT '0',
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
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla stockin.product: ~11 rows (aproximadamente)
INSERT INTO `product` (`id`, `name`, `stock`, `precioCosto`, `precioPublico`, `ganancia`, `estado`, `categoria`, `cantidadMinima`, `marca`, `bodega`, `proveedor`) VALUES
	(1, 'CAPA XXL', 20, 65000.00, 75000.00, 10000.00, 'activo', 'utileria', 2, 'TEXTIL', 'PRINCIPAL', 'TEXTIL CALI'),
	(2, 'VGR VOYAGER V-300', 11, 165000.00, 213000.00, 48000.00, 'activo', 'maquinas', 2, 'VGR', 'PRINCIPAL', 'VOYAGER'),
	(3, 'Cera de Peinado Suave', 24, 23000.00, 30000.00, 7000.00, 'activo', 'maquinas', 4, 'American Crew', 'Principal', 'Loreal CALI'),
	(4, 'Gel Fijador de Alto Poder', 25, 14000.00, 25000.00, 11000.00, 'activo', 'maquinas', 3, 'Loreal Pro', 'PRINCIPAL', 'LOREAL CALI'),
	(5, 'Espuma de Afeitar Sensible', 34, 17000.00, 29000.00, 12000.00, 'activo', 'cremas', 7, 'GILLETE', 'PRINCIPAL', 'CARREFUL'),
	(6, 'Aceite Hidratante para Barba', 7, 21000.00, 30000.00, 9000.00, 'activo', 'cremas', 2, 'The Bearded Man', 'PRINCIPAL', 'LOREAL'),
	(7, 'Tijeras Profesionales para Barbero', 34, 94000.00, 120000.00, 26000.00, 'activo', 'cremas', 6, 'Joewell', 'PRINCIPAL', 'Joewell Medillin'),
	(8, 'Navajas de Afeitar de Acero Inoxidable', 12, 23000.00, 32000.00, 9000.00, 'activo', 'cremas', 2, 'Merkur', 'PRINCIPAL', 'Merkur Bella'),
	(9, 'Corta Barbas Eléctrico', 15, 63500.00, 75300.00, 11800.00, 'activo', 'cremas', 3, 'Philips', 'PRINCIPAL', 'Philis Tulua'),
	(10, 'Brocha de Afeitar de Pelo de Tejón', 31, 13000.00, 24000.00, 11000.00, 'activo', 'cremas', 4, 'Omega', 'PRINCIPAL', 'Omega TM'),
	(11, 'Secador de Cabello Profesional', 29, 150000.00, 214000.00, 64000.00, 'inactivo', 'maquinas', 2, 'Remingtong', 'PRINCIPAL', 'RR cimbur');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
