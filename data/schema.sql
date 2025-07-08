CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    -- not sure about cancelled status, TBD
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'confirmed', 'canceled', 'wished')),
    user_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
