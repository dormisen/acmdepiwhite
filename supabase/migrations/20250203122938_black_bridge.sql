/*
  # Create admins table for secure admin access

  1. New Tables
    - `admins`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `is_admin` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `admins` table
    - Add policies for admin access
    - Add policies for admin management
*/

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  is_admin boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Policies for reading admin data
CREATE POLICY "Admins can read admin data"
  ON admins
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for managing admin data
CREATE POLICY "Only admins can insert other admins"
  ON admins
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM admins 
    WHERE user_id = auth.uid() 
    AND is_admin = true
  ));

CREATE POLICY "Only admins can update admin status"
  ON admins
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admins 
    WHERE user_id = auth.uid() 
    AND is_admin = true
  ));