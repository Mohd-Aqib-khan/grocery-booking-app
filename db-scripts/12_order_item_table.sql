CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id),
    grocery_id INT NOT NULL REFERENCES groceries(id),
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL, -- Price per unit at the time of order
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    updated_by INTEGER REFERENCES users(id),
    CONSTRAINT check_quantity CHECK (quantity > 0)
);