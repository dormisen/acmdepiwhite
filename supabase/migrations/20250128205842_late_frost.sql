/*
  # Initial Schema Setup for ACM Dépiwhite E-commerce

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `price` (decimal)
      - `description` (text)
      - `how_to_use` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `orders`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `total_amount` (decimal)
      - `status` (text)
      - `shipping_address` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add admin-only policies for product management
*/

-- Create products table
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price decimal NOT NULL,
  description text NOT NULL,
  how_to_use text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  total_amount decimal NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  shipping_address jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view products"
  ON products
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can modify products"
  ON products
  USING (auth.jwt() ->> 'email' = 'admin@example.com');

CREATE POLICY "Users can view their own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Insert initial product
INSERT INTO products (name, price, description, how_to_use)
VALUES (
  'ACM Dépiwhite S Écran Solaire SPF50',
  49.99,
  'A powerful sunscreen that provides high protection against UVA and UVB rays while helping to prevent and reduce dark spots. This innovative formula combines superior sun protection with skin-brightening properties.',
  'Apply generously to face and neck 15-30 minutes before sun exposure. Reapply every 2 hours and after swimming or excessive sweating. For optimal results, use daily as part of your morning skincare routine.'
);