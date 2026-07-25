CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes INTEGER DEFAULT 0 NOT NULL
);

INSERT INTO blogs (author, title, url) VALUES ('Martin Fowler', 'Patterns of Enterprise Application Architecture', 'https://martinfowler.com/eaaCatalog/');
INSERT INTO blogs (author, title, url) VALUES ('Dan Abramov', 'Overreacted: A JavaScript Blog', 'https://overreacted.io/');
INSERT INTO blogs (author, title, url) VALUES ('Addy Osmani', 'Learning Patterns', 'https://www.patterns.dev/');
