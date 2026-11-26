CREATE DATABASE IF NOT EXISTS oblique_store
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE oblique_store;

CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(80) PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  category VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS product_sizes (
  product_id VARCHAR(80) NOT NULL,
  size_name VARCHAR(30) NOT NULL,
  PRIMARY KEY (product_id, size_name),
  CONSTRAINT fk_product_sizes_product
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS product_colors (
  product_id VARCHAR(80) NOT NULL,
  color_name VARCHAR(100) NOT NULL,
  PRIMARY KEY (product_id, color_name),
  CONSTRAINT fk_product_colors_product
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS orders (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_number VARCHAR(20) NOT NULL UNIQUE,
  customer_name VARCHAR(120) NOT NULL,
  customer_email VARCHAR(254) NOT NULL,
  shipping_address VARCHAR(255) NOT NULL,
  payment_method ENUM('card', 'cod') NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  shipping DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS order_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT UNSIGNED NOT NULL,
  product_id VARCHAR(80) NOT NULL,
  product_name VARCHAR(180) NOT NULL,
  size_name VARCHAR(30) NOT NULL,
  color_name VARCHAR(100) NOT NULL,
  quantity INT UNSIGNED NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  CONSTRAINT fk_order_items_order
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_order_items_product
    FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB;

INSERT INTO products (id, name, category, price) VALUES
  ('kuro-boxy-hoodie', 'Kuro 500gsm Boxy Hoodie', 'Hoodies & Sweats', 165.00),
  ('slate-zip-hoodie', 'Slate Two-Way Zip Hoodie', 'Hoodies & Sweats', 180.00),
  ('raw-baggy-denim', '80s Indigo Baggy Carpenter Denim', 'Pants & Denim', 210.00),
  ('architectural-wide-pants', 'Architectural Pleated Wide Trousers', 'Pants & Denim', 195.00),
  ('ripstop-parachute-cargos', 'Ripstop Parachute Utility Cargos', 'Pants & Denim', 225.00),
  ('urban-structure-tee', 'Urban Structure Heavyweight Tee', 'Tees & Outerwear', 78.00),
  ('acid-espresso-crewneck', 'Acid-Wash Espresso Crewneck', 'Hoodies & Sweats', 145.00),
  ('waxed-canvas-jacket', 'Waxed Canvas Cropped Work Jacket', 'Tees & Outerwear', 290.00),
  ('apex-lugged-sneakers', 'Apex Trail Lugged Sneakers', 'Footwear & Gear', 260.00),
  ('ballistic-sling-set', 'Utility Crossbody & Ribbed Beanie Kit', 'Footwear & Gear', 120.00)
ON DUPLICATE KEY UPDATE name = VALUES(name), category = VALUES(category), price = VALUES(price);

INSERT INTO product_sizes (product_id, size_name) VALUES
  ('kuro-boxy-hoodie', 'XS'), ('kuro-boxy-hoodie', 'S'), ('kuro-boxy-hoodie', 'M'), ('kuro-boxy-hoodie', 'L'), ('kuro-boxy-hoodie', 'XL'),
  ('slate-zip-hoodie', 'XS'), ('slate-zip-hoodie', 'S'), ('slate-zip-hoodie', 'M'), ('slate-zip-hoodie', 'L'), ('slate-zip-hoodie', 'XL'),
  ('raw-baggy-denim', '28'), ('raw-baggy-denim', '30'), ('raw-baggy-denim', '32'), ('raw-baggy-denim', '34'), ('raw-baggy-denim', '36'),
  ('architectural-wide-pants', '28'), ('architectural-wide-pants', '30'), ('architectural-wide-pants', '32'), ('architectural-wide-pants', '34'), ('architectural-wide-pants', '36'),
  ('ripstop-parachute-cargos', 'XS'), ('ripstop-parachute-cargos', 'S'), ('ripstop-parachute-cargos', 'M'), ('ripstop-parachute-cargos', 'L'), ('ripstop-parachute-cargos', 'XL'),
  ('urban-structure-tee', 'XS'), ('urban-structure-tee', 'S'), ('urban-structure-tee', 'M'), ('urban-structure-tee', 'L'), ('urban-structure-tee', 'XL'),
  ('acid-espresso-crewneck', 'XS'), ('acid-espresso-crewneck', 'S'), ('acid-espresso-crewneck', 'M'), ('acid-espresso-crewneck', 'L'), ('acid-espresso-crewneck', 'XL'),
  ('waxed-canvas-jacket', 'S'), ('waxed-canvas-jacket', 'M'), ('waxed-canvas-jacket', 'L'), ('waxed-canvas-jacket', 'XL'),
  ('apex-lugged-sneakers', 'EU 39'), ('apex-lugged-sneakers', 'EU 40'), ('apex-lugged-sneakers', 'EU 41'), ('apex-lugged-sneakers', 'EU 42'), ('apex-lugged-sneakers', 'EU 43'), ('apex-lugged-sneakers', 'EU 44'), ('apex-lugged-sneakers', 'EU 45'),
  ('ballistic-sling-set', 'One Size')
ON DUPLICATE KEY UPDATE size_name = VALUES(size_name);

INSERT INTO product_colors (product_id, color_name) VALUES
  ('kuro-boxy-hoodie', 'Washed Charcoal'), ('kuro-boxy-hoodie', 'Obsidian Black'), ('kuro-boxy-hoodie', 'Concrete Ash'),
  ('slate-zip-hoodie', 'Distressed Slate'), ('slate-zip-hoodie', 'Faded Onyx'),
  ('raw-baggy-denim', 'Vintage Indigo'), ('raw-baggy-denim', 'Dirty Rinse Black'),
  ('architectural-wide-pants', 'Pitch Black'), ('architectural-wide-pants', 'Graphite'),
  ('ripstop-parachute-cargos', 'Olive Charcoal'), ('ripstop-parachute-cargos', 'Matte Black'),
  ('urban-structure-tee', 'Bone Off-White'), ('urban-structure-tee', 'Washed Ink'),
  ('acid-espresso-crewneck', 'Espresso Ash'), ('acid-espresso-crewneck', 'Mineral Slate'),
  ('waxed-canvas-jacket', 'Oil-Black Canvas'), ('waxed-canvas-jacket', 'Raw Earth'),
  ('apex-lugged-sneakers', 'Obsidian / Cream'), ('apex-lugged-sneakers', 'Triple Chalk'),
  ('ballistic-sling-set', 'Stealth Black / Silver'), ('ballistic-sling-set', 'Charcoal / Chrome')
ON DUPLICATE KEY UPDATE color_name = VALUES(color_name);
