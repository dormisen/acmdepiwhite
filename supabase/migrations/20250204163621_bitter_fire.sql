/*
  # Fix Admins Table

  1. Changes
    - Create admins table if it doesn't exist
    - Add RLS policies for admin access
    - Add initial admin user

  2. Security
    - Enable RLS on admins table
    - Add policies for admin access
*/

-- Create admins table if it doesn't exist
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  is_admin boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Anyone can check admin status"
  ON admins
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only super admins can insert"
  ON admins
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE user_id = auth.uid()
      AND is_admin = true
    )
  );

CREATE POLICY "Only super admins can update"
  ON admins
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE user_id = auth.uid()
      AND is_admin = true
    )
  );