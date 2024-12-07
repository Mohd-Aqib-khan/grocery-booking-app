CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    warehouse_id INTEGER NOT NULL REFERENCES warehouse(id) ON DELETE CASCADE,
    grocery_id INTEGER NOT NULL REFERENCES groceries(id) ON DELETE CASCADE,
    stock INTEGER NOT NULL,
    isActive BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (warehouse_id, grocery_id) -- Prevents duplicate inventory entries for the same item in the same warehouse.
);
