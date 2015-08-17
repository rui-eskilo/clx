
DROP TABLE comments;
DROP TABLE vote;
DROP TABLE favorite;
DROP TABLE followup;
DROP TABLE Annoucement;
DROP TABLE Category;
DROP TABLE _session;
DROP TABLE _user;
DROP TABLE rating;


CREATE TABLE _user(
  username character varying(10) NOT NULL,
  password character varying(20) NOT NULL,
  name character varying(140) NOT NULL,
  mail character varying(50),
  since timestamp with time zone NOT NULL,
  votes_somatory integer NOT NULL,
  votes_users integer NOT NULL,
  CONSTRAINT pk_user PRIMARY KEY (username)
);

CREATE TABLE Category(
  id character varying(50) NOT NULL,
  name character varying(20) NOT NULL,
  CONSTRAINT pk_category PRIMARY KEY (id)
);

CREATE TABLE Annoucement(
	annouce_id character varying(50) NOT NULL,
	title character varying (64) UNIQUE NOT NULL,
	description character varying (300) NOT NULL,
	owner character varying(10) references _user(username),
	category character varying(50) references Category(id),
	locate character varying (60) NOT NULL,
	price character varying (50),
	_date timestamp with time zone NOT NULL,
	_state character varying (20) NOT NULL,
	
/*	photo bytea,  */
	
	CONSTRAINT pk_Annoucement PRIMARY KEY (annouce_id)
);


CREATE TABLE comments(
  id character varying(50) NOT NULL,
  annoucement_id character varying(50) NOT NULL references Annoucement(annouce_id),
  userid character varying(10) NOT NULL references _user(username),
  comment_text character varying(500) NOT NULL,
  comment_response character varying(500),
  creation_date timestamp with time zone NOT NULL,
  CONSTRAINT pk_comment PRIMARY KEY (id)
);

CREATE TABLE _session(
  id character varying(50) NOT NULL,
  user_id character varying(10) NOT NULL references _user(username),
  isAuth boolean,
  time_init timestamp with time zone NOT NULL,
  CONSTRAINT pk_session PRIMARY KEY (id)
);

CREATE TABLE rating(
	val int NOT NULL,
  CONSTRAINT pk_rating PRIMARY KEY (val)
);

CREATE TABLE followup(
  user_id character varying(10) NOT NULL references _user(username),
  annoucement_id  character varying(50) NOT NULL references Annoucement(annouce_id),
  activity boolean NOT NULL DEFAULT false,
  CONSTRAINT pk_followup PRIMARY KEY (user_id, annoucement_id)
);

CREATE TABLE vote(
  username_salesman character varying(10) NOT NULL references _user(username),
  username character varying(10) NOT NULL references _user(username),
  rate int NOT NULL references rating(val),
  CONSTRAINT pk_vote PRIMARY KEY (username_salesman, username)
);

CREATE TABLE favorite(
	id character varying(50) NOT NULL,
	username character varying(10) NOT NULL references _user(username),
	annoucement_id character varying(50) NOT NULL references Annoucement(annouce_id),
  CONSTRAINT pk_favorite PRIMARY KEY (username, annoucement_id)
);
