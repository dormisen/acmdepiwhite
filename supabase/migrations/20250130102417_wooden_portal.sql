/*
  # Update orders table for guest checkout

  1. Changes
    - Make user_id column nullable to support guest orders
    - Add payment_status and fulfillment_status columns
    - Update RLS policies to allow guest orders

  2. Security
    - Maintain RLS policies for authenticated users
    - Add policies for guest order creation
*/

-- Make user_id nullable
ALTER TABLE orders ALTER COLUMN user_id DROP NOT NULL;

-- Add new status columns
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'pending';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS fulfillment_status text NOT NULL DEFAULT 'unfulfilled';

-- Update RLS policies for guest orders
CREATE POLICY "Allow guest order creation"
  ON orders
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Update existing policy for viewing orders
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
CREATE POLICY "Users can view their own orders"
  ON orders
  FOR SELECT
  TO public
  USING (
    (auth.uid() IS NULL AND user_id IS NULL) OR
    (auth.uid() = user_id)
  );