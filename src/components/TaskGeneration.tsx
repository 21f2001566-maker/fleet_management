import React, { useState } from 'react';
import { Vehicle, MaintenanceTask } from '../types';
import { generateMaintenanceTasks } from '../utils/taskGenerator';
import { 
  Calendar, 
  Zap, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Truck,
  RefreshCw
} from 'lucide-react';

interface TaskGenerationProps {
  vehicles: Vehicle[];
  existingTasks: MaintenanceTask[];
  onTasksGenerated: (tasks: MaintenanceTask[]) => void;
}

export function TaskGeneration({ vehicles, existingTasks, onTasksGenerated }: TaskGenerationProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewTasks, setPreviewTasks] = useState<MaintenanceTask[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const handlePreviewGeneration = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newTasks = generateMaintenanceTasks(vehicles, existingTasks);
      setPreviewTasks(newTasks);
      setShowPreview(true);
      setIsGenerating(false);
    }, 1500);
  };

  const handleConfirmGeneration = () => {
    onTasksGenerated(previewTasks);
    setShowPreview(false);
    setPreviewTasks([]);
  };

  const handleCancelPreview = () => {
    setShowPreview(false);
    setPreviewTasks([]);
  };

  const getVehicleDetails = (vehicleId: string) => {
    return vehicles.find(v => v.id === vehicleId);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const upcomingDueDates = vehicles.map(vehicle => {
    const lastService = new Date(vehicle.lastServiceDate);
    const nextDue = new Date(lastService);
    
    switch (vehicle.serviceInterval) {
      case 'Weekly':
        nextDue.setDate(nextDue.getDate() + 7);
        break;
      case 'Bi-weekly':
        nextDue.setDate(nextDue.getDate() + 14);
        break;
      case 'Monthly':
        nextDue.setMonth(nextDue.getMonth() + 1);
        break;
    }
    
    return { vehicle, nextDue };
  }).filter(item => item.nextDue <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Maintenance Task Generation</h1>
          <p className="mt-2 text-gray-600">Automatically generate and schedule maintenance tasks for your fleet</p>
        </div>
      </div>

      {/* Generation Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Truck className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Vehicles</p>
              <p className="text-2xl font-bold text-gray-900">{vehicles.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Due This Month</p>
              <p className="text-2xl font-bold text-gray-900">{upcomingDueDates.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
              <p className="text-2xl font-bold text-gray-900">
                {existingTasks.filter(task => task.status === 'Pending').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-emerald-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {existingTasks.filter(task => task.status === 'Completed').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Due Dates */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicles Due for Maintenance (Next 30 Days)</h3>
        {upcomingDueDates.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No vehicles due for maintenance in the next 30 days</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingDueDates.map(({ vehicle, nextDue }) => (
              <div key={vehicle.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{vehicle.id}</h4>
                  <span className="text-sm text-gray-500">{vehicle.type}</span>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Due: {nextDue.toLocaleDateString()}</p>
                  <p>Interval: {vehicle.serviceInterval}</p>
                  <p>Location: {vehicle.locationBase}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Task Generation Controls */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Generate Maintenance Tasks</h3>
            <p className="text-gray-600">Create automated maintenance tasks for the upcoming month</p>
          </div>
          <button
            onClick={handlePreviewGeneration}
            disabled={isGenerating}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Generate Tasks
              </>
            )}
          </button>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Task Generation Process:</p>
              <ul className="mt-2 list-disc list-inside space-y-1">
                <li>Analyzes each vehicle's last service date and interval</li>
                <li>Calculates next due dates within the upcoming month</li>
                <li>Creates appropriate maintenance tasks based on service type</li>
                <li>Avoids duplicate tasks for vehicles already scheduled</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Task Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Preview Generated Tasks</h3>
              <p className="text-gray-600 mt-1">Review and confirm the {previewTasks.length} new tasks to be created</p>
            </div>
            
            <div className="p-6 max-h-96 overflow-y-auto">
              {previewTasks.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No new tasks need to be generated</p>
              ) : (
                <div className="space-y-4">
                  {previewTasks.map(task => {
                    const vehicle = getVehicleDetails(task.vehicleId);
                    return (
                      <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">{task.title}</h4>
                            <p className="text-sm text-gray-600">{task.description}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Vehicle:</span>
                            <p className="font-medium">{task.vehicleId}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Location:</span>
                            <p className="font-medium">{vehicle?.locationBase}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Scheduled:</span>
                            <p className="font-medium">{new Date(task.scheduledDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Duration:</span>
                            <p className="font-medium">{task.estimatedDuration}h</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={handleConfirmGeneration}
                disabled={previewTasks.length === 0}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
              >
                Confirm & Create {previewTasks.length} Tasks
              </button>
              <button
                onClick={handleCancelPreview}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}