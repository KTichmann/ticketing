create table users (username varchar NOT NULL PRIMARY KEY, password varchar NOT NULL, email varchar NOT NULL, verified BOOL NOT NULL default(FALSE));


create table verification (username varchar NOT NULL PRIMARY KEY, verificationHash varchar NOT NULL);