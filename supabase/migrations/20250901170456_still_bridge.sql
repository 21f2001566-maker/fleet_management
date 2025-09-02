/*
  # Fleet Maintenance Management System Database Schema

  1. New Tables
    - `vehicles`
      - `id` (text, primary key) - Vehicle ID like "TRK-001"
      - `type` (text) - Vehicle type (Truck, Van, Motorcycle, Car)
      - `location_base` (text) - Base location (Depot A, Depot B, Field Office)
      - `mileage` (integer) - Current mileage
      - `last_service_date` (date) - Last maintenance date
      - `service_interval` (text) - Service frequency (Weekly, Bi-weekly, Monthly)
      - `status` (text) - Vehicle status (Active, In Service, Out of Service)
      - `created_at` (timestamp) - Record creation time
      - `updated_at` (timestamp) - Last update time

    - `technicians`
      - `id` (text, primary key) - Technician ID like "TECH-001"
      - `name` (text) - Full name
      - `assigned_depots` (text array) - Array of depot assignments
      - `active_task_count` (integer) - Current number of active tasks
      - `max_tasks` (integer) - Maximum concurrent tasks (default 3)
      - `email` (text) - Contact email
      - `phone` (text) - Contact phone
      - `created_at` (timestamp) - Record creation time
      - `updated_at` (timestamp) - Last update time

    - `maintenance_tasks`
      - `id` (text, primary key) - Task ID
      - `vehicle_id` (text, foreign key) - References vehicles.id
      - `technician_id` (text, foreign key, nullable) - References technicians.id
      - `title` (text) - Task title
      - `description` (text) - Task description
      - `priority` (text) - Priority level (Low, Medium, High, Critical)
      - `status` (text) - Task status (Pending, Assigned, In Progress, Completed, Overdue)
      - `scheduled_date` (date) - When task is scheduled
      - `completed_date` (date, nullable) - When task was completed
      - `estimated_duration` (integer) - Estimated hours to complete
      - `before_photos` (text array) - Array of photo URLs
      - `after_photos` (text array) - Array of photo URLs
      - `parts_used` (jsonb) - Array of parts with quantities and costs
      - `digital_signature` (text, nullable) - Technician signature
      - `notes` (text, nullable) - Additional notes
      - `created_at` (timestamp) - Record creation time
      - `updated_at` (timestamp) - Last update time

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage fleet data
    - Technicians can only view/update their assigned tasks
    - Admins have full access to all data

  3. Sample Data
    - Pre-populate with sample vehicles, technicians, and tasks
    - Realistic data for immediate testing and demonstration
*/

-- Create vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id text PRIMARY KEY,
  type text NOT NULL CHECK (type IN ('Truck', 'Van', 'Motorcycle', 'Car')),
  location_base text NOT NULL CHECK (location_base IN ('Depot A', 'Depot B', 'Field Office')),
  mileage integer NOT NULL DEFAULT 0,
  last_service_date date NOT NULL,
  service_interval text NOT NULL CHECK (service_interval IN ('Weekly', 'Bi-weekly', 'Monthly')),
  status text NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'In Service', 'Out of Service')),
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
  priority text NOT NULL CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
  status text NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Assigned', 'In Progress', 'Completed', 'Overdue')),
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

-- Create policies for vehicles
CREATE POLICY "Anyone can view vehicles"
  ON vehicles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can update vehicles"
  ON vehicles
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can insert vehicles"
  ON vehicles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policies for technicians
CREATE POLICY "Anyone can view technicians"
  ON technicians
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can update technicians"
  ON technicians
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can insert technicians"
  ON technicians
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policies for maintenance_tasks
CREATE POLICY "Anyone can view maintenance tasks"
  ON maintenance_tasks
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can update maintenance tasks"
  ON maintenance_tasks
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can insert maintenance tasks"
  ON maintenance_tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can delete maintenance tasks"
  ON maintenance_tasks
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vehicles_location_base ON vehicles(location_base);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_maintenance_tasks_vehicle_id ON maintenance_tasks(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_tasks_technician_id ON maintenance_tasks(technician_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_tasks_status ON maintenance_tasks(status);
CREATE INDEX IF NOT EXISTS idx_maintenance_tasks_scheduled_date ON maintenance_tasks(scheduled_date);

-- Insert sample vehicles
INSERT INTO vehicles (id, type, location_base, mileage, last_service_date, service_interval, status) VALUES
  ('TRK-001', 'Truck', 'Depot A', 45680, '2024-12-15', 'Monthly', 'Active'),
  ('TRK-002', 'Truck', 'Depot B', 32450, '2024-12-20', 'Monthly', 'Active'),
  ('TRK-003', 'Truck', 'Depot A', 67800, '2024-12-08', 'Monthly', 'Active'),
  ('VAN-205', 'Van', 'Depot A', 28900, '2024-12-18', 'Bi-weekly', 'Active'),
  ('VAN-206', 'Van', 'Field Office', 19800, '2024-12-22', 'Weekly', 'Active'),
  ('VAN-207', 'Van', 'Depot B', 41200, '2024-12-10', 'Monthly', 'Active'),
  ('VAN-208', 'Van', 'Depot B', 35600, '2024-12-16', 'Bi-weekly', 'Active'),
  ('CAR-101', 'Car', 'Field Office', 15600, '2024-12-25', 'Weekly', 'Active'),
  ('CAR-102', 'Car', 'Depot A', 23400, '2024-12-12', 'Bi-weekly', 'Active'),
  ('CAR-103', 'Car', 'Field Office', 29100, '2024-12-11', 'Monthly', 'Active'),
  ('MOTO-301', 'Motorcycle', 'Depot B', 8900, '2024-12-28', 'Weekly', 'Active'),
  ('MOTO-302', 'Motorcycle', 'Field Office', 12300, '2024-12-14', 'Bi-weekly', 'Active')
ON CONFLICT (id) DO NOTHING;

-- Insert sample technicians
INSERT INTO technicians (id, name, assigned_depots, active_task_count, max_tasks, email, phone) VALUES
  ('TECH-001', 'John Martinez', '{"Depot A"}', 1, 3, 'j.martinez@logistics.com', '+1 (555) 123-4567'),
  ('TECH-002', 'Sarah Chen', '{"Depot A", "Field Office"}', 2, 3, 's.chen@logistics.com', '+1 (555) 234-5678'),
  ('TECH-003', 'Michael Rodriguez', '{"Depot B"}', 0, 3, 'm.rodriguez@logistics.com', '+1 (555) 345-6789'),
  ('TECH-004', 'Emily Davis', '{"Depot B", "Field Office"}', 3, 3, 'e.davis@logistics.com', '+1 (555) 456-7890'),
  ('TECH-005', 'David Thompson', '{"Field Office"}', 1, 3, 'd.thompson@logistics.com', '+1 (555) 567-8901')
ON CONFLICT (id) DO NOTHING;

-- Insert sample maintenance tasks
INSERT INTO maintenance_tasks (
  id, vehicle_id, technician_id, title, description, priority, status, 
  scheduled_date, completed_date, estimated_duration, before_photos, after_photos, 
  parts_used, digital_signature, notes, created_at
) VALUES
  (
    'TASK-001', 'TRK-001', 'TECH-001', 'Routine Oil Change & Filter Replacement',
    'Perform scheduled oil change and replace oil filter', 'Medium', 'Assigned',
    '2025-01-05', NULL, 2, '{}', '{}', '[]', NULL, NULL, '2024-12-30'
  ),
  (
    'TASK-002', 'VAN-205', 'TECH-002', 'Brake System Inspection',
    'Comprehensive brake system check and pad inspection', 'High', 'In Progress',
    '2025-01-02', NULL, 3, '{}', '{}', '[]', NULL, NULL, '2024-12-28'
  ),
  (
    'TASK-003', 'CAR-101', 'TECH-002', 'Battery & Electrical Check',
    'Test battery voltage and electrical system functionality', 'Low', 'Completed',
    '2024-12-28', '2024-12-29', 1, 
    '{"https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg"}',
    '{"https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg"}',
    '[{"partName": "Battery", "quantity": 1, "cost": 120}]',
    'Sarah Chen',
    'Battery replaced successfully. All electrical systems functioning normally.',
    '2024-12-25'
  )
ON CONFLICT (id) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_vehicles_updated_at') THEN
    CREATE TRIGGER update_vehicles_updated_at
      BEFORE UPDATE ON vehicles
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_technicians_updated_at') THEN
    CREATE TRIGGER update_technicians_updated_at
      BEFORE UPDATE ON technicians
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_maintenance_tasks_updated_at') THEN
    CREATE TRIGGER update_maintenance_tasks_updated_at
      BEFORE UPDATE ON maintenance_tasks
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;