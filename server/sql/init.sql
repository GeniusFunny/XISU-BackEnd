create table if not exists `user`(
  `id` varchar(64) primary key,
  `password` varchar(64),
  `cookie` varchar(64)
) DEFAULT CHARSET=utf8;
create table if not exists `course`(
  `courseId` varchar(64) primary key,
  `term` varchar(64),
  `kind` varchar(64),
  `year` varchar(64),
  `courseName` varchar(64)
) DEFAULT CHARSET=utf8;
create table if not exists `courseScore`(
  `score` varchar(64),
  `id` varchar(64),
  `courseId` varchar(64),
  foreign key (courseId) references course(courseId),
  foreign key (id) references user(id),
  primary key (id, courseId)
) DEFAULT CHARSET=utf8;
create table if not exists `courseTable`(
  `id` varchar(64),
  `courseId` varchar(64),
  foreign key (courseId) references course(courseId),
  foreign key (id) references user(id),
  primary key (id, courseId)
) DEFAULT CHARSET=utf8;
create table if not exists `courseTask`(
  `courseId` varchar(64) primary key,
  `courseName` varchar(64),
  `teacher` varchar(64),
  `id` varchar(64),
  `plan` varchar(64),
  `classroom` varchar(64),
  foreign key (courseId) references course(courseId)
) DEFAULT CHARSET=utf8;
