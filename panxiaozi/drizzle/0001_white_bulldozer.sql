CREATE TABLE `resource` (
	`id` int AUTO_INCREMENT NOT NULL,
	`category_key` varchar(100) NOT NULL,
	`title` varchar(255) NOT NULL,
	`desc` varchar(100) NOT NULL,
	`disk_type` varchar(10) NOT NULL,
	`url` varchar(10) NOT NULL,
	`hot_num` int NOT NULL DEFAULT 0,
	`updated_at` datetime DEFAULT '2025-03-29 12:26:48.689',
	CONSTRAINT `resource_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `idx_hot_num` ON `resource` (`hot_num`);