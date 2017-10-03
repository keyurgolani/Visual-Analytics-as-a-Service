drop database if exists VAaaS;

create database VAaaS;

CREATE TABLE `VAaaS`.`datasets` (
  `dataset_id` BIGINT(10) NOT NULL AUTO_INCREMENT,
  `beautiful_name` VARCHAR(45) NULL,
  `filename` VARCHAR(45) NOT NULL,
  `root_path` VARCHAR(45) NOT NULL,
  `owner` BIGINT(10) ZEROFILL NULL,
  `is_private` TINYINT NOT NULL,
  PRIMARY KEY (`dataset_id`),
  UNIQUE INDEX `dataset_id_UNIQUE` (`dataset_id` ASC),
  UNIQUE INDEX `beautiful_name_UNIQUE` (`beautiful_name` ASC),
  UNIQUE INDEX `unique_path` (`filename` ASC, `root_path` ASC));
