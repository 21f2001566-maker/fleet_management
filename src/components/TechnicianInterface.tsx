import React, { useState } from 'react';
import { MaintenanceTask, Technician, Vehicle, PartUsed } from '../types';
import { 
  Camera, 
  CheckCircle, 
  Clock, 
  User, 
  Car,
  Calendar,
  AlertTriangle,
  Package,
  FileText,
  Upload,
  X,
  Plus,
  Trash2
} from 'lucide-react';
import { availableParts } from '../data/mockData';

interface TechnicianInterfaceProps {
  tasks: MaintenanceTask[];
  technicians: Technician[];
  vehicles: Vehicle[];
  currentUserId?: string;
  onTaskUpdate: (task: MaintenanceTask) => void;
}

export function TechnicianInterface({ 
  tasks, 
  technicians, 
  vehicles, 
  currentUserId = 'TECH-001',
  onTaskUpdate 
}: TechnicianInterfaceProps) {
  const [selectedTask, setSelectedTask] = useState<MaintenanceTask | null>(null);
  const [completionForm, setCompletionForm] = useState({
    beforePhotos: [] as string[],
    afterPhotos: [] as string[],
    partsUsed: [] as PartUsed[],
    notes: '',
    digitalSignature: ''
  });

  const currentTechnician = technicians.find(t => t.id === currentUserId);
  const myTasks = tasks.filter(task => task.technicianId === currentUserId);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Assigned': return 'bg-purple-100 text-purple-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStartTask = (task: MaintenanceTask) => {
    const updatedTask = { ...task, status: 'In Progress' as const };
    onTaskUpdate(updatedTask);
  };

  const handleOpenTaskCompletion = (task: MaintenanceTask) => {
    setSelectedTask(task);
    setCompletionForm({
      beforePhotos: task.beforePhotos || [],
      afterPhotos: task.afterPhotos || [],
      partsUsed: task.partsUsed || [],
      notes: task.notes || '',
      digitalSignature: task.digitalSignature || ''
    });
  };

  const handleCompleteTask = () => {
    if (!selectedTask || !completionForm.digitalSignature) return;

    const updatedTask: MaintenanceTask = {
      ...selectedTask,
      status: 'Completed',
      completedDate: new Date().toISOString().split('T')[0],
      beforePhotos: completionForm.beforePhotos,
      afterPhotos: completionForm.afterPhotos,
      partsUsed: completionForm.partsUsed,
      notes: completionForm.notes,
      digitalSignature: completionForm.digitalSignature
    };

    onTaskUpdate(updatedTask);
    setSelectedTask(null);
    setCompletionForm({
      beforePhotos: [],
      afterPhotos: [],
      partsUsed: [],
      notes: '',
      digitalSignature: ''
    });
  };

  const addPartUsed = () => {
    setCompletionForm(prev => ({
      ...prev,
      partsUsed: [...prev.partsUsed, { partName: '', quantity: 1, cost: 0 }]
    }));
  };

  const updatePartUsed = (index: number, field: keyof PartUsed, value: string | number) => {
    setCompletionForm(prev => ({
      ...prev,
      partsUsed: prev.partsUsed.map((part, i) => 
        i === index ? { ...part, [field]: value } : part
      )
    }));
  };

  const removePartUsed = (index: number) => {
    setCompletionForm(prev => ({
      ...prev,
      partsUsed: prev.partsUsed.filter((_, i) => i !== index)
    }));
  };

  const simulatePhotoUpload = (type: 'before' | 'after') => {
    // Simulate photo upload with Pexels URLs
    const samplePhotos = [
      'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg',
      'https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg',
      'https://images.pexels.com/photos/159293/car-engine-motor-clean-159293.jpeg',
      'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg'
    ];
    
    const randomPhoto = samplePhotos[Math.floor(Math.random() * samplePhotos.length)];
    
    setCompletionForm(prev => ({
      ...prev,
      [type === 'before' ? 'beforePhotos' : 'afterPhotos']: [
        ...prev[type === 'before' ? 'beforePhotos' : 'afterPhotos'],
        randomPhoto
      ]
    }));
  };

  const removePhoto = (type: 'before' | 'after', index: number) => {
    setCompletionForm(prev => ({
      ...prev,
      [type === 'before' ? 'beforePhotos' : 'afterPhotos']: 
        prev[type === 'before' ? 'beforePhotos' : 'afterPhotos'].filter((_, i) => i !== index)
    }));
  };

  const isOverdue = (scheduledDate: string) => {
    return new Date(scheduledDate) < new Date();
  };

  const pendingTasks = myTasks.filter(task => task.status === 'Assigned');
  const inProgressTasks = myTasks.filter(task => task.status === 'In Progress');
  const completedTasks = myTasks.filter(task => task.status === 'Completed');
  const overdueTasks = myTasks.filter(task => isOverdue(task.scheduledDate) && task.status !== 'Completed');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
          <p className="mt-2 text-gray-600">Welcome back, {currentTechnician?.name}</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-600">Active Workload</p>
            <p className="text-lg font-semibold">
              {myTasks.filter(t => ['Assigned', 'In Progress'].includes(t.status)).length} / {currentTechnician?.maxTasks}
            </p>
          </div>
        </div>
      </div>

      {/* Task Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Assigned</p>
              <p className="text-2xl font-bold text-gray-900">{pendingTasks.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{inProgressTasks.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedTasks.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">{overdueTasks.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Task Lists */}
      <div className="space-y-6">
        {/* Overdue Tasks */}
        {overdueTasks.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Overdue Tasks ({overdueTasks.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {overdueTasks.map(task => {
                const vehicle = getVehicleDetails(task.vehicleId);
                return (
                  <div key={task.id} className="bg-white border border-red-300 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{task.title}</h4>
                        <p className="text-sm text-gray-600">{task.vehicleId} - {vehicle?.locationBase}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{task.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-red-600 font-medium">
                        Due: {new Date(task.scheduledDate).toLocaleDateString()}
                      </span>
                      <div className="space-x-2">
                        {task.status === 'Assigned' && (
                          <button
                            onClick={() => handleStartTask(task)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            Start Task
                          </button>
                        )}
                        {task.status === 'In Progress' && (
                          <button
                            onClick={() => handleOpenTaskCompletion(task)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Current Tasks */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Tasks</h3>
          {pendingTasks.length === 0 && inProgressTasks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No active tasks assigned</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...pendingTasks, ...inProgressTasks].map(task => {
                const vehicle = getVehicleDetails(task.vehicleId);
                const isDueToday = new Date(task.scheduledDate).toDateString() === new Date().toDateString();
                
                return (
                  <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{task.title}</h4>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Car className="h-3 w-3" />
                          {task.vehicleId} - {vehicle?.locationBase}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-3">{task.description}</p>
                    
                    <div className="flex justify-between items-center text-sm mb-3">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{task.estimatedDuration}h</span>
                    </div>
                    
                    <div className="flex justify-between items-center mb-3">
                      <span className={`text-xs ${isDueToday ? 'text-orange-600 font-medium' : 'text-gray-500'}`}>
                        <Calendar className="h-3 w-3 inline mr-1" />
                        Due: {new Date(task.scheduledDate).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      {task.status === 'Assigned' && (
                        <button
                          onClick={() => handleStartTask(task)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors"
                        >
                          Start Task
                        </button>
                      )}
                      {task.status === 'In Progress' && (
                        <button
                          onClick={() => handleOpenTaskCompletion(task)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm transition-colors"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Completions */}
        {completedTasks.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Completions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedTasks.slice(0, 6).map(task => {
                const vehicle = getVehicleDetails(task.vehicleId);
                return (
                  <div key={task.id} className="border border-green-200 bg-green-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{task.title}</h4>
                        <p className="text-sm text-gray-600">{task.vehicleId} - {vehicle?.locationBase}</p>
                      </div>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Completed
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Completed: {task.completedDate ? new Date(task.completedDate).toLocaleDateString() : 'N/A'}
                    </p>
                    {task.afterPhotos && task.afterPhotos.length > 0 && (
                      <div className="mt-2">
                        <img 
                          src={task.afterPhotos[0]} 
                          alt="Completion"
                          className="w-full h-20 object-cover rounded"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Task Completion Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedTask.title}</h3>
                  <p className="text-gray-600 mt-1">{selectedTask.vehicleId} - Complete Task</p>
                </div>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Before Photos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Before Photos</label>
                <div className="grid grid-cols-3 gap-4 mb-3">
                  {completionForm.beforePhotos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img src={photo} alt={`Before ${index + 1}`} className="w-full h-24 object-cover rounded" />
                      <button
                        onClick={() => removePhoto('before', index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => simulatePhotoUpload('before')}
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors"
                >
                  <Camera className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">Add Before Photo</p>
                </button>
              </div>

              {/* After Photos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">After Photos</label>
                <div className="grid grid-cols-3 gap-4 mb-3">
                  {completionForm.afterPhotos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img src={photo} alt={`After ${index + 1}`} className="w-full h-24 object-cover rounded" />
                      <button
                        onClick={() => removePhoto('after', index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => simulatePhotoUpload('after')}
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors"
                >
                  <Camera className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">Add After Photo</p>
                </button>
              </div>

              {/* Parts Used */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">Parts Used</label>
                  <button
                    onClick={addPartUsed}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                    Add Part
                  </button>
                </div>
                <div className="space-y-3">
                  {completionForm.partsUsed.map((part, index) => (
                    <div key={index} className="grid grid-cols-12 gap-3 items-center">
                      <div className="col-span-5">
                        <select
                          value={part.partName}
                          onChange={(e) => updatePartUsed(index, 'partName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                          <option value="">Select Part</option>
                          {availableParts.map(partName => (
                            <option key={partName} value={partName}>{partName}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-3">
                        <input
                          type="number"
                          min="1"
                          value={part.quantity}
                          onChange={(e) => updatePartUsed(index, 'quantity', parseInt(e.target.value) || 1)}
                          placeholder="Qty"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={part.cost || ''}
                          onChange={(e) => updatePartUsed(index, 'cost', parseFloat(e.target.value) || 0)}
                          placeholder="Cost"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <div className="col-span-1">
                        <button
                          onClick={() => removePartUsed(index)}
                          className="text-red-600 hover:text-red-700 p-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={completionForm.notes}
                  onChange={(e) => setCompletionForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any additional notes about the maintenance work..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              {/* Digital Signature */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Digital Signature *</label>
                <input
                  type="text"
                  value={completionForm.digitalSignature}
                  onChange={(e) => setCompletionForm(prev => ({ ...prev, digitalSignature: e.target.value }))}
                  placeholder="Type your full name to sign"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  By typing your name, you confirm the completion of this maintenance task.
                </p>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={handleCompleteTask}
                disabled={!completionForm.digitalSignature}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Complete Task
              </button>
              <button
                onClick={() => setSelectedTask(null)}
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