CREATE TABLE `resource_disk` (
	`id` int AUTO_INCREMENT NOT NULL,
	`resource_id` int NOT NULL,
	`disk_type` varchar(10) NOT NULL,
	`external_url` varchar(1000) NOT NULL,
	`url` varchar(1000) NOT NULL,
	`updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `resource_disk_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `idx_resource_id` ON `resource_disk` (`resource_id`);