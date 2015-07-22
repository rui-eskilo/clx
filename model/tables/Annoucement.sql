

CREATE TABLE "Annoucement"(
	annouce_id SERIAL PRIMARY KEY,
	title VARCHAR (64) UNIQUE NOT NULL,
	description VARCHAR (300) NOT NULL,
	owner VARCHAR (20) NOT NULL,
	category VARCHAR (20) NOT NULL,
	locate VARCHAR (20) NOT NULL,
	state VARCHAR (20) NOT NULL
);

