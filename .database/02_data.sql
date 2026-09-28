-- MySQL dump 10.13  Distrib 8.0.43, for Linux (x86_64)
--
-- Host: localhost    Database: r2wxdb
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `r2wxdb`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `r2wxdb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `r2wxdb`;

--
-- Table structure for table `APP_ACCESS`
--

DROP TABLE IF EXISTS `APP_ACCESS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `APP_ACCESS` (
                              `id` int NOT NULL AUTO_INCREMENT,
                              `type` enum('GLOB','CREA','READ') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'GLOB',
                              `user_id` int NOT NULL,
                              `org_id` int NOT NULL,
                              `created` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                              `updated` datetime(3) DEFAULT NULL,
                              PRIMARY KEY (`id`),
                              KEY `APP_ACCESS_user_id_fkey` (`user_id`),
                              KEY `APP_ACCESS_org_id_fkey` (`org_id`),
                              CONSTRAINT `APP_ACCESS_org_id_fkey` FOREIGN KEY (`org_id`) REFERENCES `APP_ORG` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
                              CONSTRAINT `APP_ACCESS_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `APP_USER` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `APP_ACCESS`
--

LOCK TABLES `APP_ACCESS` WRITE;
/*!40000 ALTER TABLE `APP_ACCESS` DISABLE KEYS */;
INSERT INTO `APP_ACCESS` VALUES (1,'GLOB',1,1,'2026-09-25 11:53:35.433',NULL),(2,'READ',2,1,'2026-09-25 11:53:35.447',NULL);
/*!40000 ALTER TABLE `APP_ACCESS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `APP_ORG`
--

DROP TABLE IF EXISTS `APP_ORG`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `APP_ORG` (
                           `id` int NOT NULL AUTO_INCREMENT,
                           `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
                           `created` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                           `updated` datetime(3) DEFAULT NULL,
                           PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `APP_ORG`
--

LOCK TABLES `APP_ORG` WRITE;
/*!40000 ALTER TABLE `APP_ORG` DISABLE KEYS */;
INSERT INTO `APP_ORG` VALUES (1,'organization','2026-09-25 11:53:05.234',NULL);
/*!40000 ALTER TABLE `APP_ORG` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `APP_USER`
--

DROP TABLE IF EXISTS `APP_USER`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `APP_USER` (
                            `id` int NOT NULL AUTO_INCREMENT,
                            `first` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                            `last` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                            `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
                            `password` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
                            `created` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                            `updated` datetime(3) DEFAULT NULL,
                            PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `APP_USER`
--

LOCK TABLES `APP_USER` WRITE;
/*!40000 ALTER TABLE `APP_USER` DISABLE KEYS */;
INSERT INTO `APP_USER` VALUES (1,'admin name','admin lastname','admin@example.com','$argon2id$v=19$m=65536,t=3,p=4$97kN2owuWF3CqFslp1A6dw$wfTAM8XMDSWNwxeRBnHE8cKp6G8PK6I8c74hnZcOjQs','2026-09-25 11:50:13.361','2026-09-25 11:50:13.361'),(2,'reader name','reader lastname','reader@example.com','$argon2id$v=19$m=65536,t=3,p=4$97kN2owuWF3CqFslp1A6dw$wfTAM8XMDSWNwxeRBnHE8cKp6G8PK6I8c74hnZcOjQs','2026-09-25 11:50:13.361','2026-09-25 11:50:13.361');
/*!40000 ALTER TABLE `APP_USER` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `OWNER`
--

DROP TABLE IF EXISTS `OWNER`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `OWNER` (
                         `id` int NOT NULL AUTO_INCREMENT,
                         `name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
                         `active` tinyint(1) NOT NULL DEFAULT '1',
                         PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `OWNER`
--

LOCK TABLES `OWNER` WRITE;
/*!40000 ALTER TABLE `OWNER` DISABLE KEYS */;
INSERT INTO `OWNER` VALUES (1,'Alpha',1),(2,'Beta',1),(3,'Gamma',1);
/*!40000 ALTER TABLE `OWNER` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `STAT_CATEGORY`
--

DROP TABLE IF EXISTS `STAT_CATEGORY`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `STAT_CATEGORY` (
                                 `id` int NOT NULL AUTO_INCREMENT,
                                 `name` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
                                 `active` tinyint(1) NOT NULL DEFAULT '1',
                                 PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `STAT_CATEGORY`
--

LOCK TABLES `STAT_CATEGORY` WRITE;
/*!40000 ALTER TABLE `STAT_CATEGORY` DISABLE KEYS */;
INSERT INTO `STAT_CATEGORY` VALUES (1,'Research',1),(2,'Development',1),(3,'Integration',1),(4,'Validation',1);
/*!40000 ALTER TABLE `STAT_CATEGORY` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TOOL_SAM`
--

DROP TABLE IF EXISTS `TOOL_SAM`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TOOL_SAM` (
                            `id` int NOT NULL AUTO_INCREMENT,
                            `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
                            `number` mediumint NOT NULL,
                            `float` double NOT NULL,
                            `boolean` tinyint(1) NOT NULL,
                            `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
                            `date` datetime(3) NOT NULL,
                            `file_def` json DEFAULT NULL,
                            `file` json NOT NULL,
                            `files` json NOT NULL,
                            `created` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                            `updated` datetime(3) NOT NULL,
                            PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TOOL_SAM`
--

LOCK TABLES `TOOL_SAM` WRITE;
/*!40000 ALTER TABLE `TOOL_SAM` DISABLE KEYS */;
/*!40000 ALTER TABLE `TOOL_SAM` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TOOL_SAMX`
--

DROP TABLE IF EXISTS `TOOL_SAMX`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TOOL_SAMX` (
                             `id` int NOT NULL AUTO_INCREMENT,
                             `name` varchar(160) COLLATE utf8mb4_unicode_ci NOT NULL,
                             `description` text COLLATE utf8mb4_unicode_ci,
                             `status` enum('DRAFT','READY','ACTIVE','PAUSED','CLOSED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DRAFT',
                             `priority` enum('LOW','NORMAL','HIGH','CRITICAL') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'NORMAL',
                             `effort` double DEFAULT NULL,
                             `progress` int NOT NULL DEFAULT '0',
                             `starts_at` datetime(3) DEFAULT NULL,
                             `due_at` datetime(3) DEFAULT NULL,
                             `billable` tinyint(1) NOT NULL DEFAULT '0',
                             `active` tinyint(1) NOT NULL DEFAULT '1',
                             `category_id` int NOT NULL,
                             `owner_id` int DEFAULT NULL,
                             `created` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                             `updated` datetime(3) NOT NULL,
                             PRIMARY KEY (`id`),
                             KEY `TOOL_SAMX_category_id_fkey` (`category_id`),
                             KEY `TOOL_SAMX_owner_id_fkey` (`owner_id`),
                             CONSTRAINT `TOOL_SAMX_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `STAT_CATEGORY` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
                             CONSTRAINT `TOOL_SAMX_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `OWNER` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TOOL_SAMX`
--

LOCK TABLES `TOOL_SAMX` WRITE;
/*!40000 ALTER TABLE `TOOL_SAMX` DISABLE KEYS */;
/*!40000 ALTER TABLE `TOOL_SAMX` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-27 16:28:05