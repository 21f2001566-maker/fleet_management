import { MaintenanceTask, Technician, Vehicle } from '../types';

export function assignTasksToTechnicians(
  tasks: MaintenanceTask[],
  technicians: Technician[],
  vehicles: Vehicle[]
): MaintenanceTask[] {
  const assignedTasks = [...tasks];
  
  // Create a map of current workload for each technician
  const technicianWorkload = new Map(
    technicians.map(tech => [
      tech.id, 
      tasks.filter(task => 
        task.technicianId === tech.id && 
        ['Assigned', 'In Progress'].includes(task.status)
      ).length
    ])
  );
  
  // Get all pending tasks that need assignment
  const pendingTasks = assignedTasks.filter(task => task.status === 'Pending');
  
  // Sort tasks by priority and due date
  pendingTasks.sort((a, b) => {
    const priorityOrder = { 'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3 };
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    
    return new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime();
  });
  
  // Assign each pending task
  pendingTasks.forEach(task => {
    const vehicle = vehicles.find(v => v.id === task.vehicleId);
    if (!vehicle) return;
    
    // Find technicians assigned to the vehicle's depot with available capacity
    const availableTechnicians = technicians.filter(tech => 
      tech.assignedDepots.includes(vehicle.locationBase) &&
      (technicianWorkload.get(tech.id) || 0) < tech.maxTasks
    );
    
    let assignedTech: Technician | null = null;
    
    if (availableTechnicians.length > 0) {
      // Assign to technician with least workload at the same depot
      assignedTech = availableTechnicians.reduce((prev, current) => 
        (technicianWorkload.get(prev.id) || 0) < (technicianWorkload.get(current.id) || 0) ? prev : current
      );
    } else {
      // If no technicians available at primary depot, find any available technician
      const anyAvailable = technicians.filter(tech => 
        (technicianWorkload.get(tech.id) || 0) < tech.maxTasks
      );
      
      if (anyAvailable.length > 0) {
        assignedTech = anyAvailable.reduce((prev, current) => 
          (technicianWorkload.get(prev.id) || 0) < (technicianWorkload.get(current.id) || 0) ? prev : current
        );
      }
    }
    
    // Assign the task if we found an available technician
    if (assignedTech) {
      const taskIndex = assignedTasks.findIndex(t => t.id === task.id);
      if (taskIndex !== -1) {
        assignedTasks[taskIndex] = {
          ...task,
          technicianId: assignedTech.id,
          status: 'Assigned'
        };
        
        // Update workload tracking
        technicianWorkload.set(assignedTech.id, (technicianWorkload.get(assignedTech.id) || 0) + 1);
      }
    }
  });
  
  return assignedTasks;
}