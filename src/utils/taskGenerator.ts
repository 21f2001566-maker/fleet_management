import { Vehicle, MaintenanceTask } from '../types';

export function generateMaintenanceTasks(
  vehicles: Vehicle[],
  existingTasks: MaintenanceTask[],
  forceGenerate: boolean = false
): MaintenanceTask[] {
  const newTasks: MaintenanceTask[] = [];
  const currentDate = new Date();
  const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate());
  
  vehicles.forEach(vehicle => {
    const lastServiceDate = new Date(vehicle.lastServiceDate);
    const nextDueDate = calculateNextDueDate(lastServiceDate, vehicle.serviceInterval);
    
    // Generate tasks for the next 30 days OR if force generating
    const shouldGenerate = forceGenerate || (nextDueDate <= nextMonth && nextDueDate >= currentDate);
    
    if (shouldGenerate) {
      // Check if task already exists for this vehicle in the next 30 days
      const existingTask = existingTasks.find(
        task => task.vehicleId === vehicle.id && 
        (forceGenerate ? 
          task.status === 'Pending' || task.status === 'Assigned' : // For force generate, avoid duplicating pending/assigned tasks
          Math.abs(new Date(task.scheduledDate).getTime() - nextDueDate.getTime()) < 7 * 24 * 60 * 60 * 1000 // Within 7 days for auto
        )
      );
      
      if (!existingTask) {
        const scheduledDate = forceGenerate ? 
          new Date(currentDate.getTime() + Math.random() * 14 * 24 * 60 * 60 * 1000) : // Random date within 2 weeks for force
          nextDueDate;
        const task = createMaintenanceTask(vehicle, scheduledDate, forceGenerate);
        newTasks.push(task);
      }
    }
  });
  
  return newTasks;
}

function calculateNextDueDate(lastServiceDate: Date, interval: string): Date {
  const nextDate = new Date(lastServiceDate);
  
  switch (interval) {
    case 'Weekly':
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case 'Bi-weekly':
      nextDate.setDate(nextDate.getDate() + 14);
      break;
    case 'Monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
  }
  
  return nextDate;
}

function createMaintenanceTask(vehicle: Vehicle, dueDate: Date, isForced: boolean = false): MaintenanceTask {
  const taskId = `TASK-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  
  const taskTemplates = {
    'Weekly': {
      title: 'Weekly Safety Inspection',
      description: 'Basic safety check including lights, brakes, and fluid levels',
      duration: 1
    },
    'Bi-weekly': {
      title: 'Bi-weekly Maintenance Check',
      description: 'Comprehensive inspection of key systems and components',
      duration: 2
    },
    'Monthly': {
      title: 'Monthly Service & Maintenance',
      description: 'Full service including oil change, filter replacement, and system diagnostics',
      duration: 4
    }
  };
  
  // For forced generation, create more varied tasks
  const forcedTaskTemplates = [
    {
      title: 'Preventive Maintenance Check',
      description: 'Comprehensive preventive maintenance inspection',
      duration: 3
    },
    {
      title: 'System Diagnostics',
      description: 'Full system diagnostic and performance check',
      duration: 2
    },
    {
      title: 'Safety Compliance Inspection',
      description: 'Ensure vehicle meets all safety compliance standards',
      duration: 2
    }
  ];
  
  const template = isForced ? 
    forcedTaskTemplates[Math.floor(Math.random() * forcedTaskTemplates.length)] :
    taskTemplates[vehicle.serviceInterval];
    
  const priority = vehicle.mileage > 50000 ? 'High' : vehicle.mileage > 30000 ? 'Medium' : 'Low';
  
  return {
    id: taskId,
    vehicleId: vehicle.id,
    title: template.title,
    description: template.description,
    priority,
    status: 'Pending',
    scheduledDate: dueDate.toISOString().split('T')[0],
    estimatedDuration: template.duration,
    beforePhotos: [],
    afterPhotos: [],
    partsUsed: [],
    createdAt: new Date().toISOString()
  };
}