CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    -- not sure about cancelled status, TBD
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'confirmed', 'canceled', 'wished', 'rejected', 'revoked')),
    user_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE booking_actions (
    id SERIAL PRIMARY KEY,
    booking_id INT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    action_type VARCHAR(16) NOT NULL CHECK (action_type IN ('canceled', 'rejected', 'revoked')),
    reason TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
