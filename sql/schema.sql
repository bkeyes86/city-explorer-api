CREATE TABLE restaurants (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  is closed BOOLEAN NOT NULL DEFAULT FALSE,
  rating NUMERIC(2,1),
  address VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  website_url VARCHAR(100),
  open_date DATE 
);