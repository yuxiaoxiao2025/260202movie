CREATE TABLE `category` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`key` varchar(100) NOT NULL,
	CONSTRAINT `category_id` PRIMARY KEY(`id`),
	CONSTRAINT `category_key_unique` UNIQUE(`key`)
);
