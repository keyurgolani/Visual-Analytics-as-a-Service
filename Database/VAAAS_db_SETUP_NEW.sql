DROP database if exists VAAAS;
CREATE database VAAAS;

USE VAAAS;

CREATE TABLE `USERACCOUNT` (
  `user_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(256) NOT NULL DEFAULT '',
  `email_id` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `last_login` datetime DEFAULT NULL,
  `account_created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_id_UNIQUE` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4;

CREATE TABLE `USERPROFILE` (
  `profile_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `first_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL,
  `script` text,
  PRIMARY KEY (`profile_id`),
  UNIQUE KEY `profile_id_UNIQUE` (`profile_id`),
  KEY `fk_USERPROFILE_1_idx` (`user_id`),
  CONSTRAINT `fk_USERPROFILE_1` FOREIGN KEY (`user_id`) REFERENCES `USERACCOUNT` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4;

CREATE TABLE `USERJOBHISTORY` (
  `job_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  `data` longtext,
  `node_chain` longtext,
  `result_url` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`job_id`),
  KEY `fk_USERJOBHISTORY_1_idx` (`user_id`),
  CONSTRAINT `fk_USERJOBHISTORY_1` FOREIGN KEY (`user_id`) REFERENCES `USERACCOUNT` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `USERNODES` (
  `node_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  `node` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`node_id`),
  KEY `fk_USERNODES_1_idx` (`user_id`),
  CONSTRAINT `fk_USERNODES_1` FOREIGN KEY (`user_id`) REFERENCES `USERACCOUNT` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `USERNODECHAINS` (
  `node_chain_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  `node_chain` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`node_chain_id`),
  KEY `fk_USERNODE_chainS_1_idx` (`user_id`),
  CONSTRAINT `fk_USERnode_chainS_1` FOREIGN KEY (`user_id`) REFERENCES `USERACCOUNT` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `USERDATA` (
  `data_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `data_url` varchar(1000) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`data_id`),
  KEY `fk_USERdata_1_idx` (`user_id`),
  CONSTRAINT `fk_USERdata_1` FOREIGN KEY (`user_id`) REFERENCES `USERACCOUNT` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `PUBLICNODES` (
  `node_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  `node` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`node_id`),
  KEY `fk_PUBLICNODES_1_idx` (`user_id`),
  CONSTRAINT `fk_PUBLICNODES_1` FOREIGN KEY (`user_id`) REFERENCES `USERACCOUNT` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `PUBLICCHAINS` (
  `chain_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  `node` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`chain_id`),
  KEY `fk_PUBLICCHAINS_1_idx` (`user_id`),
  CONSTRAINT `fk_PUBLICCHAINS_1` FOREIGN KEY (`user_id`) REFERENCES `USERACCOUNT` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `PUBLICDATA` (
  `data_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `data_url` varchar(1000) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`data_id`),
  KEY `fk_PUBLICdata_1_idx` (`user_id`),
  CONSTRAINT `fk_PUBLICdata_1` FOREIGN KEY (`user_id`) REFERENCES `USERACCOUNT` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `DATASETS` (
  `dataset_id` bigint(10) NOT NULL AUTO_INCREMENT,
  `beautiful_name` varchar(1024) DEFAULT NULL,
  `filename` varchar(256) NOT NULL,
  `root_path` varchar(1024) NOT NULL,
  `owner` bigint(10) unsigned zerofill DEFAULT NULL,
  `is_private` tinyint(4) NOT NULL,
  PRIMARY KEY (`dataset_id`),
  UNIQUE KEY `dataset_id_UNIQUE` (`dataset_id`),
  UNIQUE KEY `unique_path` (`filename`,`root_path`),
  UNIQUE KEY `beautiful_name_UNIQUE` (`beautiful_name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;


COMMIT;
