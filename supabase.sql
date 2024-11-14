-- Create tables
CREATE TABLE products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR NOT NULL CHECK (category IN ('BEER', 'WINE', 'COCKTAIL', 'SOFT_DRINK')),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tables (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    number INTEGER NOT NULL UNIQUE,
    status VARCHAR NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'OCCUPIED', 'RESERVED')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    table_id UUID REFERENCES tables(id),
    status VARCHAR NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PREPARING', 'READY', 'PAID')),
    total DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id),
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;

-- Create policies for products
CREATE POLICY "Enable read access for all users" ON products FOR SELECT TO anon USING (true);
CREATE POLICY "Enable insert for authenticated users" ON products FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON products FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Enable delete for authenticated users" ON products FOR DELETE TO anon USING (true);

-- Create policies for tables
CREATE POLICY "Enable read access for all users" ON tables FOR SELECT TO anon USING (true);
CREATE POLICY "Enable insert for all users" ON tables FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON tables FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Create policies for orders
CREATE POLICY "Enable read access for all users" ON orders FOR SELECT TO anon USING (true);
CREATE POLICY "Enable insert for all users" ON orders FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON orders FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Create policies for order items
CREATE POLICY "Enable read access for all users" ON order_items FOR SELECT TO anon USING (true);
CREATE POLICY "Enable insert for all users" ON order_items FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON order_items FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Create function to update stock after order
CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET stock = stock - NEW.quantity
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update stock after order
CREATE TRIGGER update_stock_after_order
AFTER INSERT ON order_items
FOR EACH ROW
EXECUTE FUNCTION update_product_stock();

-- Insert sample data with token-based pricing (1 token ≈ €2.50) and initial stock
INSERT INTO products (name, description, price, category, stock) VALUES
    ('Stella Artois', 'Belgian pilsner with a crisp, refreshing taste', 1, 'BEER', 50),
    ('House Red Wine', 'Smooth medium-bodied red wine', 2, 'WINE', 30),
    ('Mojito', 'Classic cocktail with rum, mint, and lime', 3, 'COCKTAIL', 25),
    ('Coca Cola', 'Classic refreshing soft drink', 1, 'SOFT_DRINK', 100),
    ('Heineken', 'Premium lager beer', 1, 'BEER', 50),
    ('Margarita', 'Tequila-based cocktail with lime', 3, 'COCKTAIL', 25);

-- Create tables 1-10
INSERT INTO tables (number, status)
SELECT generate_series(1, 10), 'AVAILABLE';