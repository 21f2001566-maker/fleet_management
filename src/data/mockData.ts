import { Vehicle, Technician, MaintenanceTask } from '../types';

export const vehicles: Vehicle[] = [
  {
    id: 'TRK-001',
    type: 'Truck',
    locationBase: 'Depot A',
    mileage: 45680,
    lastServiceDate: '2024-12-15',
    serviceInterval: 'Monthly',
    status: 'Active'
  },
  {
    id: 'TRK-002',
    type: 'Truck',
    locationBase: 'Depot B',
    mileage: 32450,
    lastServiceDate: '2024-12-20',
    serviceInterval: 'Monthly',
    status: 'Active'
  },
  {
    id: 'VAN-205',
    type: 'Van',
    locationBase: 'Depot A',
    mileage: 28900,
    lastServiceDate: '2024-12-18',
    serviceInterval: 'Bi-weekly',
    status: 'Active'
  },
  {
    id: 'VAN-206',
    type: 'Van',
    locationBase: 'Field Office',
    mileage: 19800,
    lastServiceDate: '2024-12-22',
    serviceInterval: 'Weekly',
    status: 'Active'
  },
  {
    id: 'VAN-207',
    type: 'Van',
    locationBase: 'Depot B',
    mileage: 41200,
    lastServiceDate: '2024-12-10',
    serviceInterval: 'Monthly',
    status: 'Active'
  },
  {
    id: 'CAR-101',
    type: 'Car',
    locationBase: 'Field Office',
    mileage: 15600,
    lastServiceDate: '2024-12-25',
    serviceInterval: 'Weekly',
    status: 'Active'
  },
  {
    id: 'CAR-102',
    type: 'Car',
    locationBase: 'Depot A',
    mileage: 23400,
    lastServiceDate: '2024-12-12',
    serviceInterval: 'Bi-weekly',
    status: 'Active'
  },
  {
    id: 'MOTO-301',
    type: 'Motorcycle',
    locationBase: 'Depot B',
    mileage: 8900,
    lastServiceDate: '2024-12-28',
    serviceInterval: 'Weekly',
    status: 'Active'
  },
  {
    id: 'MOTO-302',
    type: 'Motorcycle',
    locationBase: 'Field Office',
    mileage: 12300,
    lastServiceDate: '2024-12-14',
    serviceInterval: 'Bi-weekly',
    status: 'Active'
  },
  {
    id: 'TRK-003',
    type: 'Truck',
    locationBase: 'Depot A',
    mileage: 67800,
    lastServiceDate: '2024-12-08',
    serviceInterval: 'Monthly',
    status: 'Active'
  },
  {
    id: 'VAN-208',
    type: 'Van',
    locationBase: 'Depot B',
    mileage: 35600,
    lastServiceDate: '2024-12-16',
    serviceInterval: 'Bi-weekly',
    status: 'Active'
  },
  {
    id: 'CAR-103',
    type: 'Car',
    locationBase: 'Field Office',
    mileage: 29100,
    lastServiceDate: '2024-12-11',
    serviceInterval: 'Monthly',
    status: 'Active'
  }
];

export const technicians: Technician[] = [
  {
    id: 'TECH-001',
    name: 'John Martinez',
    assignedDepots: ['Depot A'],
    activeTaskCount: 1,
    maxTasks: 3,
    email: 'j.martinez@logistics.com',
    phone: '+1 (555) 123-4567'
  },
  {
    id: 'TECH-002',
    name: 'Sarah Chen',
    assignedDepots: ['Depot A', 'Field Office'],
    activeTaskCount: 2,
    maxTasks: 3,
    email: 's.chen@logistics.com',
    phone: '+1 (555) 234-5678'
  },
  {
    id: 'TECH-003',
    name: 'Michael Rodriguez',
    assignedDepots: ['Depot B'],
    activeTaskCount: 0,
    maxTasks: 3,
    email: 'm.rodriguez@logistics.com',
    phone: '+1 (555) 345-6789'
  },
  {
    id: 'TECH-004',
    name: 'Emily Davis',
    assignedDepots: ['Depot B', 'Field Office'],
    activeTaskCount: 3,
    maxTasks: 3,
    email: 'e.davis@logistics.com',
    phone: '+1 (555) 456-7890'
  },
  {
    id: 'TECH-005',
    name: 'David Thompson',
    assignedDepots: ['Field Office'],
    activeTaskCount: 1,
    maxTasks: 3,
    email: 'd.thompson@logistics.com',
    phone: '+1 (555) 567-8901'
  }
];

export const maintenanceTasks: MaintenanceTask[] = [
  {
    id: 'TASK-001',
    vehicleId: 'TRK-001',
    technicianId: 'TECH-001',
    title: 'Routine Oil Change & Filter Replacement',
    description: 'Perform scheduled oil change and replace oil filter',
    priority: 'Medium',
    status: 'Assigned',
    scheduledDate: '2025-01-05',
    estimatedDuration: 2,
    beforePhotos: [],
    afterPhotos: [],
    partsUsed: [],
    createdAt: '2024-12-30'
  },
  {
    id: 'TASK-002',
    vehicleId: 'VAN-205',
    technicianId: 'TECH-002',
    title: 'Brake System Inspection',
    description: 'Comprehensive brake system check and pad inspection',
    priority: 'High',
    status: 'In Progress',
    scheduledDate: '2025-01-02',
    estimatedDuration: 3,
    beforePhotos: [],
    afterPhotos: [],
    partsUsed: [],
    createdAt: '2024-12-28'
  },
  {
    id: 'TASK-003',
    vehicleId: 'CAR-101',
    technicianId: 'TECH-002',
    title: 'Battery & Electrical Check',
    description: 'Test battery voltage and electrical system functionality',
    priority: 'Low',
    status: 'Completed',
    scheduledDate: '2024-12-28',
    completedDate: '2024-12-29',
    estimatedDuration: 1,
    beforePhotos: ['https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg'],
    afterPhotos: ['https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg'],
    partsUsed: [
      { partName: 'Battery', quantity: 1, cost: 120 }
    ],
    digitalSignature: 'Sarah Chen',
    notes: 'Battery replaced successfully. All electrical systems functioning normally.',
    createdAt: '2024-12-25'
  }
];

export const availableParts = [
  'Oil Filter',
  'Brake Pads',
  'Tires',
  'Battery',
  'Air Filter',
  'Spark Plugs',
  'Transmission Fluid',
  'Coolant',
  'Windshield Wipers',
  'Belts',
  'Hoses',
  'Lights/Bulbs'
];