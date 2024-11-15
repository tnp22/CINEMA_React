CREATE TABLE `movie` (
	`no` int AUTO_INCREMENT PRIMARY KEY,
	`id`	varchar(200)	NOT NULL,
	`title`	varchar(255)	NOT NULL,
	`content`	text	NOT NULL,
	`type`	varchar(400)	NOT NULL,
	`release_date`	timestamp	NOT NULL,
	`reg_date`	timestamp	NOT NULL	DEFAULT CURRENT_TIMESTAMP,
	`upd_date`	timestamp	NOT NULL	DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `users` (
	`no` int AUTO_INCREMENT PRIMARY KEY,
	`id` VARCHAR(200) NOT NULL,
	`username`	varchar(200)	NOT NULL UNIQUE,
	`password`	varchar(255)	NOT NULL,
	`name`	varchar(100)	NOT NULL,
	`email`	varchar(100)	NOT NULL,
	`enabled`	boolean	NOT NULL	DEFAULT false,
	`reg_date`	timestamp	NOT NULL	DEFAULT CURRENT_TIMESTAMP,
	`upd_date`	timestamp	NOT NULL	DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `auth_list` (
	`no` int AUTO_INCREMENT PRIMARY KEY,
	`type_name`	varchar(100)	NOT NULL UNIQUE,
	`description` VARCHAR(300) null
);

CREATE TABLE `user_auth` (
	`no`    int AUTO_INCREMENT NOT NULL PRIMARY KEY,
	`user_id`	varchar(100)	NOT NULL,
	`auth`	varchar(100)	NOT NULL,
	FOREIGN KEY (`auth`) REFERENCES `auth_list`(`type_name`) ON UPDATE CASCADE
);

CREATE TABLE `banner` (
	`no`    int AUTO_INCREMENT NOT NULL PRIMARY KEY,
	`id`	varchar(100)	NOT NULL UNIQUE,
	`name`	varchar(300)	NOT NULL,
	`banner_divi` varchar(300)	NOT NULL,
	`movie_id`	varchar(300)	NOT NULL
);

CREATE TABLE `cinema` (
	`no`    int AUTO_INCREMENT NOT NULL PRIMARY KEY,
	`id`	varchar(100)	NOT NULL UNIQUE,
	`auth`	varchar(100)	NOT NULL,
	`area`	varchar(100)	NOT NULL,
	`area_sub`	varchar(100)	NOT NULL,
	FOREIGN KEY (`auth`) REFERENCES `auth_list`(`type_name`) ON UPDATE CASCADE
);

CREATE TABLE `theater` (
	`no`    int AUTO_INCREMENT NOT NULL PRIMARY KEY,
	`id`	varchar(200)	NOT NULL,
	`name` VARCHAR(200) not null,
	`cinema_id`	varchar(100)	NOT NULL,
	`map`	text	NOT NULL,
	`seat` int not null
    FOREIGN KEY (`cinema_id`) REFERENCES `cinema`(id) ON DELETE RESTRICT
);


CREATE TABLE `notice` (
	`no`    int AUTO_INCREMENT NOT NULL PRIMARY KEY,
	`id`	varchar(200)	NOT NULL, 
	`title`	varchar(255)	NOT NULL,
	`content`	text	NOT NULL,
	`reg_date`	timestamp	NOT NULL	DEFAULT CURRENT_TIMESTAMP,
	`upd_date`	timestamp	NOT NULL	DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `files` (
	`no`    int AUTO_INCREMENT NOT NULL PRIMARY KEY,
	`id`	varchar(200)	NOT NULL,
	`fk_table`	varchar(100)	NOT NULL,
	`fk_id`	varchar(100)	NOT NULL,
	`division`	varchar(200)	NOT NULL,
	`url`	varchar(1000)	NOT NULL
);

CREATE TABLE `review` (
	`no`    int AUTO_INCREMENT NOT NULL PRIMARY KEY,
	`id`	varchar(200)	NOT NULL,
	`movie_id`	varchar(100)	NOT NULL,
	`user_id`	varchar(100)	NOT NULL,
	`content`	text	NOT NULL
);

CREATE TABLE `reserve` (
	`no`    int AUTO_INCREMENT NOT NULL PRIMARY KEY,
	`id`	varchar(200)	NOT NULL,
	`username`	varchar(200)	NOT NULL,
	`theater_list_id`	varchar(200)	NOT NULL,
	`pos_x`	int	NOT NULL,
	`pos_y`	int	NOT NULL
);





CREATE TABLE `theater_list` (
	`no`    int AUTO_INCREMENT NOT NULL PRIMARY KEY,
	`id`	varchar(200)	NOT NULL,
	`movie_id`	varchar(200)	NOT NULL,
	`theater_id`	varchar(200)	NOT NULL,
	`cinema_id`	varchar(200)	NOT NULL,
	`time`	timestamp	NOT NULL
);

CREATE TABLE `rating` (
	`no`    int AUTO_INCREMENT NOT NULL PRIMARY KEY,
	`id`	varchar(200)	NOT NULL,
	`review_id`	varchar(200)	NOT NULL,
	`user_id`	varchar(200)	NOT NULL,
	`rating_vaule`	int	NOT NULL
);



CREATE TABLE `inspection` (
	`no`    int AUTO_INCREMENT NOT NULL PRIMARY KEY,
	`id`	varchar(200)	NOT NULL,
	`cinema_id`	varchar(200)	NOT NULL,
	`start_time`	timestamp	NOT NULL,
	`end_time`	timestamp	NOT NULL
);

CREATE TABLE `cast` (
	`no`    int AUTO_INCREMENT NOT NULL PRIMARY KEY,
	`id`	varchar(200)	NOT NULL,
	`movie_id`	varchar(200)	NOT NULL,
	`rule`	varchar(100)	NOT NULL,
	`name`	varchar(100)	NOT NULL
);

