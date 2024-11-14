-- Insert sample products first (if not already present)
INSERT INTO products (name, description, price, category, image_url) VALUES
    ('Stella Artois', 'Belgian pilsner with a crisp, refreshing taste', 3.50, 'BEER', 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400'),
    ('House Red Wine', 'Smooth medium-bodied red wine', 4.50, 'WINE', 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400'),
    ('Mojito', 'Classic cocktail with rum, mint, and lime', 8.00, 'COCKTAIL', 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400')
ON CONFLICT (name) DO NOTHING;

-- Insert sample tables (if not already present)
INSERT INTO tables (number, status)
SELECT generate_series(1, 5), 'AVAILABLE'
ON CONFLICT (number) DO NOTHING;

-- Create a simple order for table 1
WITH new_order AS (
  INSERT INTO orders (table_id, status, total)
  SELECT id, 'PENDING', 15.50
  FROM tables 
  WHERE number = 1
  RETURNING id
)
INSERT INTO order_items (order_id, product_id, quantity, price)
SELECT 
  new_order.id,
  products.id,
  2,
  products.price
FROM new_order, products
WHERE products.name = 'Stella Artois';

-- Create another order for table 2
WITH new_order AS (
  INSERT INTO orders (table_id, status, total)
  SELECT id, 'PREPARING', 22.50
  FROM tables 
  WHERE number = 2
  RETURNING id
)
INSERT INTO order_items (order_id, product_id, quantity, price)
SELECT 
  new_order.id,
  products.id,
  3,
  products.price
FROM new_order, products
WHERE products.name = 'House Red Wine';