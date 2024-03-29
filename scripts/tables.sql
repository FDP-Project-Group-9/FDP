-- user onboarding tables
IF OBJECT_ID(N'roles', N'U') is null
create table roles (
	role_id int IDENTITY(1,1),
	role_name varchar(20) NOT NULL
	primary key(role_id)
);
INSERT INTO roles VALUES 
('administrator'),
('coordinator'),
('participant');
GO


IF OBJECT_ID(N'users', N'U') is null
create table users (
	user_id int IDENTITY(1,1),
	first_name varchar (30) NOT NULL,
	last_name varchar (30) NOT NULL,
	email_id varchar (255) UNIQUE NOT NULL,
	mobile_no varchar (10) UNIQUE NOT NULL,
	dob date,
	title varchar (5) NOT NULL, 
	password varchar (255) NOT NULL,
	gender varchar (10) NOT NULL,
	role_id int,
	profile_approved bit,
	PRIMARY KEY (user_id),
	FOREIGN KEY (role_id) REFERENCES roles(role_id)
);
GO

IF OBJECT_ID(N'user_docs', N'U') is NULL
create table coordinator_docs (
	id int IDENTITY(1, 1),
	registration_doc_url varchar (255) NOT NULL,
	coordinator_mandate_form_url varchar (255),
	coordinator_photo_url varchar (255),
	coordinator_signature_url varchar (255),
	institute_logo_url varchar (255),
	user_id int NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (user_id) REFERENCES users(user_id)
);
GO

/*
	need to learn and understand how to store documents required for verification of user profile.
*/

--workshop related tables

--resource persons table
IF OBJECT_ID(N'workshop_specializations', N'U') is null
create table workshop_specializations (
	id int IDENTITY (1,1),
	specialization varchar (255) NOT NULL,
	PRIMARY KEY (id)
);
Go

IF OBJECT_ID(N'resource_persons', N'U') is null
create table resource_persons (
	id int IDENTITY(1,1),
	person_name varchar (50) NOT NULL,
	email_id varchar (255) UNIQUE NOT NULL,
	mobile_no varchar (10) UNIQUE NOT NULL,
	designation varchar (30) NOT NULL,
	specialization_id int NOT NULL,
	country varchar (50) NOT NULL,
	state_name varchar (50),
	organization_name varchar (255) NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (specialization_id) REFERENCES workshop_specializations(id)
);
GO

--coordinator details table
IF OBJECT_ID(N'coordinator_details', N'U') is null
create table coordinator_details (
	id int IDENTITY(1,1),
	coordinator_id int NOT NULL, 
	father_name varchar (50) NOT NULL,
	alternate_email_id varchar (255),
	whatsapp_no varchar (10),
	state_name varchar (50),
	district_name varchar (50),
	permanent_address varchar (255) NOT NULL,
	pincode int NOT NULL,
	emp_id int,
	designation varchar (30),
	specialization_id int NOT NULL,
	experience int,
	PRIMARY KEY (id),
	FOREIGN KEY (specialization_id) REFERENCES workshop_specializations(id),
	FOREIGN KEY (coordinator_id) REFERENCES users(user_id)
);
GO

-- institute details table
IF OBJECT_ID(N'institute', N'U') is null
create table institute (
	id int IDENTITY(1,1),
	coordinator_id int NOT NULL,
	aicte_approved BIT,
	pid int,
	institute_type varchar (30) NOT NULL,
	institute_name varchar (100) NOT NULL,
	institute_address varchar (255) NOT NULL,
	state_name varchar (50),
	district_name varchar (50),
	PRIMARY KEY (id),
	FOREIGN KEY(coordinator_id) REFERENCES users(user_id)
);
GO

-- quiz table
IF OBJECT_ID(N'quizes', N'U') is null
create table quizes(
	id int IDENTITY(1,1),
	quiz_name varchar (50),
	workshop_id int NOT NULL
	total_questons int default 0
	PRIMARY KEY (id)
	FOREIGN KEY (workshop_id) REFERENCES workshops(workshop_id),
);
GO

-- questions table
IF OBJECT_ID(N'questions', N'U') is null
create table questions (
	question_id int IDENTITY (1,1),
	quiz_id int NOT NULL,
	question_statement varchar (255) NOT NULL,
	option1 varchar (255) NOT NULL,
	option2 varchar (255) NOT NULL,
	option3 varchar (255) NOT NULL,
	option4 varchar (255) NOT NULL,
	answer int NOT NULL,
	PRIMARY KEY (question_id),
	FOREIGN KEY (quiz_id) REFERENCES quizes(id)
);
GO

IF OBJECT_ID(N'workshop_details', N'U') is NULL
create table workshop_details (
	id int IDENTITY(1, 1),
	workshop_id int NOT NULL,
	area_specialization_id int NOT NULL,
	sub_area varchar (50),
	title varchar (100) NOT NULL,
	begin_date date NOT NULL,
	end_date date NOT NULL,
	mode varchar (50) NOT NULL, --specifies the mode i.e online or offline
	participant_intake int NOT NULL,
	workshop_approval_status BIT,
	alloted_funds bigint,
	expenditure bigint,
	quiz_generated BIT default 0,
	quiz_id int,
	workshop_completed BIT default 0,
	PRIMARY KEY (id),
	FOREIGN KEY (area_specialization_id) REFERENCES workshop_specializations(id),
	FOREIGN KEY (quiz_id) REFERENCES quizes(id),
);
GO

--workshop table
IF OBJECT_ID(N'workshops', N'U') is null
create table workshops (
	workshop_id int IDENTITY(1,1),
	coordinator_id int,
	co_coordinator_id int,
	institute_id int,  
	workshop_details_id int,
	draft BIT default 1,
	otp_verified BIT default 0,
	PRIMARY KEY (workshop_id),
	FOREIGN KEY (coordinator_id) REFERENCES users(user_id),
	FOREIGN KEY (co_coordinator_id) REFERENCES users(user_id),
	FOREIGN KEY (institute_id) REFERENCES institute(id),
);

ALTER TABLE workshop_details 
ADD FOREIGN KEY (workshop_id) REFERENCES workshops(workshop_id);

ALTER TABLE workshops
ADD FOREIGN KEY (workshop_details_id) REFERENCES workshop_details(id);

GO


--attendace table
IF OBJECT_ID(N'attendance', N'U') is null
 create table attendance (
	id int IDENTITY(1,1),
	workshop_id int NOT NULL,
	participant_id int NOT NULL,
	day1_attendance BIT default 0,
	day2_attendance BIT default 0,
	day3_attendance BIT default 0,
	day4_attendance BIT default 0,
	day5_attendance BIT default 0,
	PRIMARY KEY (id),
	FOREIGN KEY (workshop_id) REFERENCES workshops(workshop_id)
 );
GO

-- many-many relationship table b/w workshop and resource person
IF OBJECT_ID(N'workshop_resource_person', N'U') is null
create table workshop_resource_person(
	workshop_id int NOT NULL,
	resource_person_id int NOT NULL,
	FOREIGN KEY (workshop_id) REFERENCES workshops(workshop_id),
	FOREIGN KEY (resource_person_id) REFERENCES resource_persons(id)
);
GO

-- worskshop participant relationship
IF OBJECT_ID(N'workshop_participants', N'U') is null
create table workshop_participants (
	workshop_id int NOT NULL,  
	participant_id int NOT NULL,
	attendance_id int,
	certificate_generated BIT default 0,
	quiz_attempted BIT default 0,
	quiz_score int,
	participant_approval_status int default 1,
	FOREIGN KEY (workshop_id) REFERENCES workshops(workshop_id),
	FOREIGN KEY (participant_id) REFERENCES users(user_id),
	FOREIGN KEY (attendance_id) REFERENCES attendance(id)
);
GO

IF OBJECT_ID(N'twilio', N'U') is NULL
CREATE TABLE twilio (
	id int IDENTITY(1, 1),
	sid varchar(255) NOT NULL
);
GO

IF OBJECT_ID(N'workshop_media_photos', N'U') is null
CREATE TABLE workshop_media_photos (
	id int IDENTITY(1, 1),
	media_photo_url varchar(255) NOT NULL,
	workshop_id int NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (workshop_id) REFERENCES workshops(workshop_id)
);
GO

IF OBJECT_ID(N'workshop_photos', N'U') is null
CREATE TABLE workshop_photos (
	id int IDENTITY(1, 1),
	photo_url varchar(255) NOT NULL,
	workshop_id int NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (workshop_id) REFERENCES workshops(workshop_id)
);
GO

IF OBJECT_ID(N'workshop_other_docs', N'U') is null
CREATE TABLE workshop_other_docs (
	id int IDENTITY(1, 1),
	report_url varchar(255),
	stmt_expenditure_url varchar(255),
	certificate_url varchar(255),
	brochure_id varchar(255),
	workshop_id int NOT NULL UNIQUE,
	PRIMARY KEY (id),
	FOREIGN KEY (workshop_id) REFERENCES workshops(workshop_id)
);
GO