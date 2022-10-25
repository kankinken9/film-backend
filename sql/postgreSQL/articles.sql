CREATE TABLE public.articles (
	id serial4 NOT NULL,
	title varchar(32) NOT NULL,
	alltext text NOT NULL,
	summary text NULL,
	datecreated timestamp NOT NULL DEFAULT now(),
	datemodified timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	imageurl varchar(2048) NULL,
	published bool NULL,
	authorid int4 NULL,
	CONSTRAINT articles_pkey PRIMARY KEY (id),
  CONSTRAINT fk_articles FOREIGN KEY (authorid) REFERENCES users (id)
);


INSERT INTO articles (title, allText, authorID) VALUES
	('title 1', 'some stuff', 1),
	('another title', 'interesting', 1),
	('last one', 'ok', 1),
	('this title is good', 'some text', 3);
