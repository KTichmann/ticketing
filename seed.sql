create table users (username varchar NOT NULL PRIMARY KEY, password varchar NOT NULL, email varchar NOT NULL, verified BOOL NOT NULL default(FALSE));


create table verification (username varchar NOT NULL PRIMARY KEY, verificationHash varchar NOT NULL);

create table groups (group_id SERIAL PRIMARY KEY,  title VARCHAR(50) NOT NULL, description VARCHAR(200) NOT NULL, criteria TEXT[][]);

create table admins (username varchar NOT NULL, group_id varchar NOT NULL);