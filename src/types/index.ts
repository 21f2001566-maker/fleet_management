export interface Vehicle {
  id: string;
  type: 'Truck' | 'Van' | 'Motorcycle' | 'Car';
  locationBase: 'Depot A' | 'Depot B' | 'Field Office';
  mileage: number;
  lastServiceDate: string;
  serviceInterval: 'Weekly' | 'Bi-weekly' | 'Monthly';
  status: 'Active' | 'In Service' | 'Out of Service';
}

export interface Technician {
  id: string;
  name: string;
  assignedDepots: string[];
  activeTaskCount: number;
  maxTasks: number;
  email: string;
  phone: string;
}

export interface MaintenanceTask {
  id: string;
  vehicleId: string;
  technicianId?: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Pending' | 'Assigned' | 'In Progress' | 'Completed' | 'Overdue';
  scheduledDate: string;
  completedDate?: string;
  estimatedDuration: number; // in hours
  beforePhotos?: string[];
  afterPhotos?: string[];
  partsUsed: PartUsed[];
  digitalSignature?: string;
  notes?: string;
  createdAt: string;
}

export interface PartUsed {
  partName: string;
  quantity: number;
  cost?: number;
}

export interface DashboardMetrics {
  totalTasks: number;
  overdueTasks: number;
  completedTasks: number;
  pendingTasks: number;
  averageCompletionTime: number;
}

export type UserRole = 'admin' | 'technician';