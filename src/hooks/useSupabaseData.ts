import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Vehicle, Technician, MaintenanceTask, PartUsed } from '../types';

export function useSupabaseData() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all data
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load vehicles
      const { data: vehiclesData, error: vehiclesError } = await supabase
        .from('vehicles')
        .select('*')
        .order('id');

      if (vehiclesError) throw vehiclesError;

      // Load technicians
      const { data: techniciansData, error: techniciansError } = await supabase
        .from('technicians')
        .select('*')
        .order('name');

      if (techniciansError) throw techniciansError;

      // Load maintenance tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('maintenance_tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (tasksError) throw tasksError;

      // Transform data to match frontend types
      setVehicles(vehiclesData.map(v => ({
        id: v.id,
        type: v.type,
        locationBase: v.location_base,
        mileage: v.mileage,
        lastServiceDate: v.last_service_date,
        serviceInterval: v.service_interval,
        status: v.status
      })));

      setTechnicians(techniciansData.map(t => ({
        id: t.id,
        name: t.name,
        assignedDepots: t.assigned_depots,
        activeTaskCount: t.active_task_count,
        maxTasks: t.max_tasks,
        email: t.email,
        phone: t.phone
      })));

      setTasks(tasksData.map(t => ({
        id: t.id,
        vehicleId: t.vehicle_id,
        technicianId: t.technician_id,
        title: t.title,
        description: t.description,
        priority: t.priority,
        status: t.status,
        scheduledDate: t.scheduled_date,
        completedDate: t.completed_date,
        estimatedDuration: t.estimated_duration,
        beforePhotos: t.before_photos || [],
        afterPhotos: t.after_photos || [],
        partsUsed: (t.parts_used as PartUsed[]) || [],
        digitalSignature: t.digital_signature,
        notes: t.notes,
        createdAt: t.created_at
      })));

    } catch (err) {
      console.error('Error loading data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Update vehicle
  const updateVehicle = async (vehicle: Vehicle) => {
    try {
      const { error } = await supabase
        .from('vehicles')
        .update({
          type: vehicle.type,
          location_base: vehicle.locationBase,
          mileage: vehicle.mileage,
          last_service_date: vehicle.lastServiceDate,
          service_interval: vehicle.serviceInterval,
          status: vehicle.status
        })
        .eq('id', vehicle.id);

      if (error) throw error;

      setVehicles(prev => prev.map(v => v.id === vehicle.id ? vehicle : v));
    } catch (err) {
      console.error('Error updating vehicle:', err);
      throw err;
    }
  };

  // Create maintenance tasks
  const createTasks = async (newTasks: MaintenanceTask[]) => {
    try {
      const tasksToInsert = newTasks.map(task => ({
        id: task.id,
        vehicle_id: task.vehicleId,
        technician_id: task.technicianId || null,
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        scheduled_date: task.scheduledDate,
        completed_date: task.completedDate || null,
        estimated_duration: task.estimatedDuration,
        before_photos: task.beforePhotos || [],
        after_photos: task.afterPhotos || [],
        parts_used: task.partsUsed || [],
        digital_signature: task.digitalSignature || null,
        notes: task.notes || null
      }));

      const { error } = await supabase
        .from('maintenance_tasks')
        .insert(tasksToInsert);

      if (error) throw error;

      // Reload data to get the latest state
      await loadData();
    } catch (err) {
      console.error('Error creating tasks:', err);
      throw err;
    }
  };

  // Update maintenance task
  const updateTask = async (task: MaintenanceTask) => {
    try {
      const { error } = await supabase
        .from('maintenance_tasks')
        .update({
          technician_id: task.technicianId || null,
          title: task.title,
          description: task.description,
          priority: task.priority,
          status: task.status,
          scheduled_date: task.scheduledDate,
          completed_date: task.completedDate || null,
          estimated_duration: task.estimatedDuration,
          before_photos: task.beforePhotos || [],
          after_photos: task.afterPhotos || [],
          parts_used: task.partsUsed || [],
          digital_signature: task.digitalSignature || null,
          notes: task.notes || null
        })
        .eq('id', task.id);

      if (error) throw error;

      // Update technician active task counts
      await updateTechnicianTaskCounts();
      
      // Reload data to get the latest state
      await loadData();
    } catch (err) {
      console.error('Error updating task:', err);
      throw err;
    }
  };

  // Update multiple tasks (for assignments)
  const updateTasks = async (updatedTasks: MaintenanceTask[]) => {
    try {
      // Update tasks in batches
      for (const task of updatedTasks) {
        const { error } = await supabase
          .from('maintenance_tasks')
          .update({
            technician_id: task.technicianId || null,
            status: task.status
          })
          .eq('id', task.id);

        if (error) throw error;
      }

      // Update technician active task counts
      await updateTechnicianTaskCounts();
      
      // Reload data to get the latest state
      await loadData();
    } catch (err) {
      console.error('Error updating tasks:', err);
      throw err;
    }
  };

  // Update technician active task counts
  const updateTechnicianTaskCounts = async () => {
    try {
      // Get current task counts for each technician
      const { data: taskCounts, error: countError } = await supabase
        .from('maintenance_tasks')
        .select('technician_id')
        .in('status', ['Assigned', 'In Progress']);

      if (countError) throw countError;

      // Calculate active task counts
      const counts = taskCounts.reduce((acc, task) => {
        if (task.technician_id) {
          acc[task.technician_id] = (acc[task.technician_id] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      // Update each technician's active task count
      for (const tech of technicians) {
        const activeCount = counts[tech.id] || 0;
        
        const { error } = await supabase
          .from('technicians')
          .update({ active_task_count: activeCount })
          .eq('id', tech.id);

        if (error) throw error;
      }
    } catch (err) {
      console.error('Error updating technician task counts:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    vehicles,
    technicians,
    tasks,
    loading,
    error,
    updateVehicle,
    createTasks,
    updateTask,
    updateTasks,
    refreshData: loadData
  };
}