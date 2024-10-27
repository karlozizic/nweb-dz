CREATE TABLE gift_cards (
    id UUID PRIMARY KEY,
    oib VARCHAR(11) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
	created TIMESTAMP NOT NULL
);