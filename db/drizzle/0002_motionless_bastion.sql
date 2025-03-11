CREATE TABLE `activities` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`color` text NOT NULL,
	`metrics` text DEFAULT '[]',
	`user_id` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `entries` (
	`id` integer PRIMARY KEY NOT NULL,
	`activity_id` integer NOT NULL,
	`date` text NOT NULL,
	`score` integer NOT NULL,
	FOREIGN KEY (`activity_id`) REFERENCES `activities`(`id`) ON UPDATE no action ON DELETE cascade
);
