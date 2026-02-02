ALTER TABLE `resource` ADD CONSTRAINT `unique_url` UNIQUE(`url`);--> statement-breakpoint
ALTER TABLE `resource` ADD CONSTRAINT `unique_title` UNIQUE(`title`);--> statement-breakpoint
ALTER TABLE `resource` ADD CONSTRAINT `unique_pinyin` UNIQUE(`pinyin`);