create table users
(
    username varchar NOT NULL PRIMARY KEY,
    password varchar NOT NULL,
    email varchar NOT NULL,
    verified BOOL NOT NULL default(FALSE)
);


create table verification
(
    username varchar NOT NULL PRIMARY KEY,
    verificationHash varchar NOT NULL
);

create table groups
(
    group_id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    description VARCHAR(200) NOT NULL
);


create table admins
(
    username varchar NOT NULL,
    group_id varchar NOT NULL
);


create table tickets
(
    id SERIAL PRIMARY KEY,
    group_id INT NOT NULL,
    title VARCHAR(50) NOT NULL,
    description VARCHAR(200) NOT NULL,
    reporter_email VARCHAR(50) NOT NULL,
    created_at timestamp
    without time zone default
    (now
    () at time zone 'utc'), status VARCHAR
    (20) NOT NULL default
    ('toDo'));


    create table comments
    (
        comment_id SERIAL PRIMARY KEY,
        ticket_id INT NOT NULL,
        created_at timestamp
        without time zone default
        (now
        () at time zone 'utc'), commenter VARCHAR
        (50) NOT NULL, content VARCHAR
        (100) NOT NULL);