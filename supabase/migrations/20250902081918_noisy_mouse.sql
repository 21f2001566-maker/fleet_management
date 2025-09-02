/*
  # Fleet Management System Database Schema

  1. New Tables
    - `vehicles` - Fleet vehicle information
      - `id` (text, primary key)
      - `type` (text, constrained to Truck/Van/Motorcycle/Car)
      - `location_base` (text, constrained to depot locations)
      - `mileage` (integer, default 0)
      - `last_service_date` (date)
      - `service_interval` (text, constrained to Weekly/Bi-weekly/Monthly)
      - `status` (text, default 'Active', constrained to Active/In Service/Out of Service)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

    - `technicians` - Maintenance technician information
      - `id` (text, primary key)
      - `name` (text)
      - `assigned_depots` (text array, default empty)
      - `active_task_count` (integer, default 0)
      - `max_tasks` (integer, default 3)
      - `email` (text)
      - `phone` (text)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

    - `maintenance_tasks` - Maintenance task tracking
      - `id` (text, primary key)
      - `vehicle_id` (text, foreign key to vehicles)
      - `technician_id` (text, foreign key to technicians, nullable)
      - `title` (text)
      - `description` (text)
      - `priority` (text, constrained to Low/Medium/High/Critical)
      - `status` (text, default 'Pending', constrained to Pending/Assigned/In Progress/Completed/Overdue)
      - `scheduled_date` (date)
      - `completed_date` (date, nullable)
      - `estimated_duration` (integer, default 1)
      - `before_photos` (text array, default empty)
      - `after_photos` (text array, default empty)
      - `parts_used` (jsonb, default empty array)
      - `digital_signature` (text, nullable)
      - `notes` (text, nullable)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to perform CRUD operations

  3. Triggers
    - Add updated_at triggers for all tables
    - Create update_updated_at_column function

  4. Indexes
    - Add performance indexes for common queries
*/

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id text PRIMARY KEY,
  type text NOT NULL CHECK (type = ANY (ARRAY['Truck', 'Van', 'Motorcycle', 'Car'])),
  location_base text NOT NULL CHECK (location_base = ANY (ARRAY['Depot A', 'Depot B', 'Field Office'])),
  mileage integer NOT NULL DEFAULT 0,
  last_service_date date NOT NULL,
  service_interval text NOT NULL CHECK (service_interval = ANY (ARRAY['Weekly', 'Bi-weekly', 'Monthly'])),
  status text NOT NULL DEFAULT 'Active' CHECK (status = ANY (ARRAY['Active', 'In Service', 'Out of Service'])),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create technicians table
CREATE TABLE IF NOT EXISTS technicians (
  id text PRIMARY KEY,
  name text NOT NULL,
  assigned_depots text[] NOT NULL DEFAULT '{}',
  active_task_count integer NOT NULL DEFAULT 0,
  max_tasks integer NOT NULL DEFAULT 3,
  email text NOT NULL,
  phone text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create maintenance_tasks table
CREATE TABLE IF NOT EXISTS maintenance_tasks (
  id text PRIMARY KEY,
  vehicle_id text NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  technician_id text REFERENCES technicians(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text NOT NULL,
  priority text NOT NULL CHECK (priority = ANY (ARRAY['Low', 'Medium', 'High', 'Critical'])),
  status text NOT NULL DEFAULT 'Pending' CHECK (status = ANY (ARRAY['Pending', 'Assigned', 'In Progress', 'Completed', 'Overdue'])),
  scheduled_date date NOT NULL,
  completed_date date,
  estimated_duration integer NOT NULL DEFAULT 1,
  before_photos text[] DEFAULT '{}',
  after_photos text[] DEFAULT '{}',
  parts_used jsonb DEFAULT '[]',
  digital_signature text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_tasks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for vehicles
CREATE POLICY "Anyone can view vehicles"
  ON vehicles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can insert vehicles"
  ON vehicles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update vehicles"
  ON vehicles
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create RLS policies for technicians
CREATE POLICY "Anyone can view technicians"
  ON technicians
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can insert technicians"
  ON technicians
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update technicians"
  ON technicians
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create RLS policies for maintenance_tasks
CREATE POLICY "Anyone can view maintenance tasks"
  ON maintenance_tasks
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can insert maintenance tasks"
  ON maintenance_tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update maintenance tasks"
  ON maintenance_tasks
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can delete maintenance tasks"
  ON maintenance_tasks
  FOR DELETE
  TO authenticated
  USING (true);

-- Create triggers for updated_at columns
CREATE TRIGGER update_vehicles_updated_at
  BEFORE UPDATE ON vehicles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_technicians_updated_at
  BEFORE UPDATE ON technicians
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maintenance_tasks_updated_at
  BEFORE UPDATE ON maintenance_tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_vehicles_location_base ON vehicles (location_base);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles (status);
CREATE INDEX IF NOT EXISTS idx_maintenance_tasks_vehicle_id ON maintenance_tasks (vehicle_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_tasks_technician_id ON maintenance_tasks (technician_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_tasks_status ON maintenance_tasks (status);
CREATE INDEX IF NOT EXISTS idx_maintenance_tasks_scheduled_date ON maintenance_tasks (scheduled_date);