CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE DATABASE layaway;

CREATE TABLE users (
	user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
	user_email TEXT NOT NULL UNIQUE,
	user_password TEXT NOT NULL UNIQUE,
	user_savings NUMERIC(11,2) NOT NULL
);

CREATE TABLE wishlists (
	wishlist_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
	user_id TEXT NOT NULL,
	product_name TEXT NOT NULL,
	product_price VARCHAR(10) NOT NULL
);

