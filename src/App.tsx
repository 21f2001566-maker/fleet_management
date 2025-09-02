import React, { useState } from 'react';
import { UserRole } from './types';
import { useSupabaseData } from './hooks/useSupabaseData';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { FleetManagement } from './components/FleetManagement';
import { TaskGeneration } from './components/TaskGeneration';
import { TaskAssignments } from './components/TaskAssignments';
import { TechnicianInterface } from './components/TechnicianInterface';
import { Loader2 } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [userRole, setUserRole] = useState<UserRole>('admin');
  
  const {
    vehicles,
    technicians,
    tasks,
    loading,
    error,
    updateVehicle,
    createTasks,
    updateTask,
    updateTasks
  } = useSupabaseData();

  // Calculate overdue tasks for navigation badge
  const overdueTasks = tasks.filter(task => {
    if (task.status === 'Completed') return false;
    return new Date(task.scheduledDate) < new Date();
  }).length;

  const handleVehicleUpdate = async (updatedVehicle: Vehicle) => {
    try {
      await updateVehicle(updatedVehicle);
    } catch (err) {
      console.error('Failed to update vehicle:', err);
    }
  };

  const handleTasksGenerated = async (newTasks: MaintenanceTask[]) => {
    try {
      await createTasks(newTasks);
    } catch (err) {
      console.error('Failed to create tasks:', err);
    }
  };

  const handleTasksUpdated = async (updatedTasks: MaintenanceTask[]) => {
    try {
      await updateTasks(updatedTasks);
    } catch (err) {
      console.error('Failed to update tasks:', err);
    }
  };

  const handleTaskUpdate = async (updatedTask: MaintenanceTask) => {
    try {
      await updateTask(updatedTask);
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleViewChange = (view: string) => {
    setCurrentView(view);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading fleet data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Connection Error</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <p className="text-sm text-gray-600">
              Please make sure you've connected to Supabase using the "Connect to Supabase" button in the top right.
            </p>
          </div>
        </div>
      </div>
    );
  }
  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard 
            tasks={tasks}
            technicians={technicians}
            vehicles={vehicles}
          />
        );
      
      case 'fleet':
        return (
          <FleetManagement 
            vehicles={vehicles}
            onVehicleUpdate={handleVehicleUpdate}
          />
        );
      
      case 'tasks':
        return (
          <TaskGeneration 
            vehicles={vehicles}
            existingTasks={tasks}
            onTasksGenerated={handleTasksGenerated}
          />
        );
      
      case 'assignments':
        return (
          <TaskAssignments 
            tasks={tasks}
            technicians={technicians}
            vehicles={vehicles}
            onTasksUpdated={handleTasksUpdated}
          />
        );
      
      case 'technician':
        return (
          <TechnicianInterface 
            tasks={tasks}
            technicians={technicians}
            vehicles={vehicles}
            onTaskUpdate={handleTaskUpdate}
          />
        );
      
      default:
        return (
          <Dashboard 
            tasks={tasks}
            technicians={technicians}
            vehicles={vehicles}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        currentView={currentView}
        onViewChange={handleViewChange}
        userRole={userRole}
        overdueCount={overdueTasks}
      />
      
      {/* Role Switcher for Demo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-end">
          <div className="bg-white rounded-lg border border-gray-200 p-2">
            <span className="text-sm text-gray-600 mr-3">Demo Mode:</span>
            <button
              onClick={() => {
                setUserRole('admin');
                setCurrentView('dashboard');
              }}
              className={`px-3 py-1 rounded text-sm font-medium mr-2 transition-colors ${
                userRole === 'admin' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Admin
            </button>
            <button
              onClick={() => {
                setUserRole('technician');
                setCurrentView('technician');
              }}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                userRole === 'technician' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Technician
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderCurrentView()}
      </main>
    </div>
  );
}

export default App;