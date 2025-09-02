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
  RefreshCw,
  Plus,
  Settings
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
  const [showManualForm, setShowManualForm] = useState(false);
  const [generationMode, setGenerationMode] = useState<'auto' | 'force' | 'manual'>('auto');
  const [manualTask, setManualTask] = useState({
    vehicleId: '',
    title: '',
    description: '',
    priority: 'Medium' as const,
    scheduledDate: new Date().toISOString().split('T')[0],
    estimatedDuration: 2
  });

  const handlePreviewGeneration = (mode: 'auto' | 'force' = 'auto') => {
    setGenerationMode(mode);
    setIsGenerating(true);
    setTimeout(() => {
      const newTasks = generateMaintenanceTasks(vehicles, existingTasks, mode === 'force');
      setPreviewTasks(newTasks);
      setShowPreview(true);
      setIsGenerating(false);
    }, 1500);
  };

  const handleManualTaskCreate = () => {
    if (!manualTask.vehicleId || !manualTask.title || !manualTask.description) return;
    
    const taskId = `TASK-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const newTask: MaintenanceTask = {
      id: taskId,
      vehicleId: manualTask.vehicleId,
      title: manualTask.title,
      description: manualTask.description,
      priority: manualTask.priority,
      status: 'Pending',
      scheduledDate: manualTask.scheduledDate,
      estimatedDuration: manualTask.estimatedDuration,
      beforePhotos: [],
      afterPhotos: [],
      partsUsed: [],
      createdAt: new Date().toISOString()
    };
    
    setPreviewTasks([newTask]);
    setShowPreview(true);
    setShowManualForm(false);
    
    // Reset form
    setManualTask({
      vehicleId: '',
      title: '',
      description: '',
      priority: 'Medium',
      scheduledDate: new Date().toISOString().split('T')[0],
      estimatedDuration: 2
    });
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
          <div className="flex gap-3">
            <button
              onClick={() => setShowManualForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create Task
            </button>
            <button
              onClick={() => handlePreviewGeneration('auto')}
              disabled={isGenerating}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  Auto Generate
                </>
              )}
            </button>
            <button
              onClick={() => handlePreviewGeneration('force')}
              disabled={isGenerating}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Settings className="h-4 w-4" />
                  Force Generate
                </>
              )}
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Auto Generate</p>
                <p className="mt-1">Creates tasks only for vehicles due for maintenance based on their service intervals.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Settings className="h-5 w-5 text-purple-600 mt-0.5" />
              <div className="text-sm text-purple-800">
                <p className="font-medium">Force Generate</p>
                <p className="mt-1">Creates maintenance tasks for all vehicles regardless of due dates.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Plus className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="text-sm text-green-800">
                <p className="font-medium">Create Task</p>
                <p className="mt-1">Manually create a custom maintenance task for any vehicle.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Task Creation Modal */}
      {showManualForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Create Manual Task</h3>
              <p className="text-gray-600 mt-1">Create a custom maintenance task</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle</label>
                <select
                  value={manualTask.vehicleId}
                  onChange={(e) => setManualTask(prev => ({ ...prev, vehicleId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Vehicle</option>
                  {vehicles.map(vehicle => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.id} - {vehicle.type} ({vehicle.locationBase})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
                <input
                  type="text"
                  value={manualTask.title}
                  onChange={(e) => setManualTask(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Emergency Brake Repair"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={manualTask.description}
                  onChange={(e) => setManualTask(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detailed description of the maintenance work required..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={manualTask.priority}
                    onChange={(e) => setManualTask(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (hours)</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={manualTask.estimatedDuration}
                    onChange={(e) => setManualTask(prev => ({ ...prev, estimatedDuration: parseInt(e.target.value) || 2 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled Date</label>
                <input
                  type="date"
                  value={manualTask.scheduledDate}
                  onChange={(e) => setManualTask(prev => ({ ...prev, scheduledDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={handleManualTaskCreate}
                disabled={!manualTask.vehicleId || !manualTask.title || !manualTask.description}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Create Task
              </button>
              <button
                onClick={() => setShowManualForm(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Task Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                {generationMode === 'manual' ? 'Preview New Task' : 'Preview Generated Tasks'}
              </h3>
              <p className="text-gray-600 mt-1">
                {generationMode === 'manual' 
                  ? 'Review and confirm the new task to be created'
                  : `Review and confirm the ${previewTasks.length} new tasks to be created`
                }
              </p>
            </div>
            
            <div className="p-6 max-h-96 overflow-y-auto">
              {previewTasks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No new tasks need to be generated automatically</p>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setShowPreview(false);
                        handlePreviewGeneration('force');
                      }}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg mr-2 transition-colors"
                    >
                      Force Generate Tasks
                    </button>
                    <button
                      onClick={() => {
                        setShowPreview(false);
                        setShowManualForm(true);
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Create Manual Task
                    </button>
                  </div>
                </div>
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
            
            {previewTasks.length > 0 && (
              <div className="p-6 border-t border-gray-200 flex gap-3">
                <button
                  onClick={handleConfirmGeneration}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Confirm & Create {previewTasks.length} Task{previewTasks.length > 1 ? 's' : ''}
                </button>
                <button
                  onClick={handleCancelPreview}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}