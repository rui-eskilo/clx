DROP TABLE "Annoucement";

CREATE TABLE "Annoucement"(
	annouce_id SERIAL PRIMARY KEY,
	title VARCHAR (64) UNIQUE NOT NULL,
	description VARCHAR (300) NOT NULL,
	price decimal NOT NULL,
	photos integer[],
	owner VARCHAR (20) NOT NULL,
	category VARCHAR (20) NOT NULL,
	locate VARCHAR (20) NOT NULL,
	state boolean NOT NULL
);

