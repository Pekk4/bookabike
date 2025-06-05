CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    user_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
