DROP TABLE if exists trains CASCADE;
DROP TABLE if exists stops CASCADE;
DROP TABLE if exists comments CASCADE;
DROP TABLE if exists users CASCADE;

CREATE TABLE trains (
  id SERIAL PRIMARY KEY UNIQUE,
  name VARCHAR(255)
);

CREATE TABLE stops (
  id SERIAL PRIMARY KEY UNIQUE,
  name VARCHAR (255),
  train_id INTEGER REFERENCES trains
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY UNIQUE,
  email VARCHAR(255),
  password_digest TEXT,
  username VARCHAR(255),
  bio TEXT
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY UNIQUE,
  posted TIMESTAMP NOT NULL DEFAULT(transaction_timestamp()),
  note TEXT,
  stop_id INTEGER REFERENCES stops,
  user_id INTEGER REFERENCES users
);
