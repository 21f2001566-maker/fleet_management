import React, { useState } from 'react';
import { MaintenanceTask, Technician, Vehicle } from '../types';
import { assignTasksToTechnicians } from '../utils/taskAssigner';
import { 
  Users, 
  MapPin, 
  Clock, 
  User, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  Zap,
  RefreshCw
} from 'lucide-react';

interface TaskAssignmentsProps {
  tasks: MaintenanceTask[];
  technicians: Technician[];
  vehicles: Vehicle[];
  onTasksUpdated: (tasks: MaintenanceTask[]) => void;
}

export function TaskAssignments({ tasks, technicians, vehicles, onTasksUpdated }: TaskAssignmentsProps) {
  const [isAssigning, setIsAssigning] = useState(false);

  const handleAutoAssignment = () => {
    setIsAssigning(true);
    setTimeout(async () => {
      const assignedTasks = assignTasksToTechnicians(tasks, technicians, vehicles);
      await onTasksUpdated(assignedTasks);
      setIsAssigning(false);
    }, 1500);
  };

  const getVehicleDetails = (vehicleId: string) => {
    return vehicles.find(v => v.id === vehicleId);
  };

  const getTechnicianDetails = (technicianId: string) => {
    return technicians.find(t => t.id === technicianId);
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
      case 'Pending': return 'bg-gray-100 text-gray-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const pendingTasks = tasks.filter(task => task.status === 'Pending');
  const assignedTasks = tasks.filter(task => task.status === 'Assigned' || task.status === 'In Progress');

  const technicianWorkload = technicians.map(tech => {
    const assignedToTech = tasks.filter(task => 
      task.technicianId === tech.id && 
      ['Assigned', 'In Progress'].includes(task.status)
    );
    return {
      ...tech,
      currentTasks: assignedToTech
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Task Assignments</h1>
          <p className="mt-2 text-gray-600">Manage and assign maintenance tasks to technicians</p>
        </div>
        
        {pendingTasks.length > 0 && (
          <button
            onClick={handleAutoAssignment}
            disabled={isAssigning}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            {isAssigning ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Assigning...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Auto-Assign Tasks
              </>
            )}
          </button>
        )}
      </div>

      {/* Assignment Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{pendingTasks.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Assigned Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{assignedTasks.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Active Technicians</p>
              <p className="text-2xl font-bold text-gray-900">
                {technicians.filter(tech => tech.activeTaskCount > 0).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <AlertCircle className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Available Capacity</p>
              <p className="text-2xl font-bold text-gray-900">
                {technicians.reduce((sum, tech) => sum + (tech.maxTasks - tech.activeTaskCount), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Technician Workload */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Technician Workload
          </h3>
          
          <div className="space-y-4">
            {technicianWorkload.map(tech => {
              const workloadPercentage = (tech.currentTasks.length / tech.maxTasks) * 100;
              const isOverloaded = tech.currentTasks.length >= tech.maxTasks;
              
              return (
                <div key={tech.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{tech.name}</h4>
                      <p className="text-sm text-gray-600">
                        <MapPin className="h-3 w-3 inline mr-1" />
                        {tech.assignedDepots.join(', ')}
                      </p>
                      <p className="text-sm text-gray-500">{tech.email}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-medium ${isOverloaded ? 'text-red-600' : 'text-gray-600'}`}>
                        {tech.currentTasks.length} / {tech.maxTasks}
                      </span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className={`h-2 rounded-full ${
                        isOverloaded ? 'bg-red-500' : workloadPercentage > 66 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(workloadPercentage, 100)}%` }}
                    ></div>
                  </div>
                  
                  {tech.currentTasks.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-medium text-gray-600 mb-2">Current Tasks:</p>
                      <div className="space-y-1">
                        {tech.currentTasks.map(task => (
                          <div key={task.id} className="text-xs bg-gray-50 rounded px-2 py-1">
                            <span className="font-medium">{task.vehicleId}</span> - {task.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Task Assignment Overview */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Task Assignment Overview
          </h3>
          
          <div className="space-y-4">
            {pendingTasks.length > 0 && (
              <div>
                <h4 className="font-medium text-orange-700 mb-2">Pending Assignment ({pendingTasks.length})</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {pendingTasks.map(task => {
                    const vehicle = getVehicleDetails(task.vehicleId);
                    return (
                      <div key={task.id} className="border border-orange-200 bg-orange-50 rounded p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="font-medium text-gray-900">{task.vehicleId}</span>
                            <span className="text-sm text-gray-600 ml-2">{vehicle?.locationBase}</span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{task.title}</p>
                        <p className="text-xs text-gray-500">Due: {new Date(task.scheduledDate).toLocaleDateString()}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {assignedTasks.length > 0 && (
              <div>
                <h4 className="font-medium text-blue-700 mb-2">Recently Assigned ({assignedTasks.length})</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {assignedTasks.slice(0, 5).map(task => {
                    const technician = getTechnicianDetails(task.technicianId!);
                    const vehicle = getVehicleDetails(task.vehicleId);
                    return (
                      <div key={task.id} className="border border-blue-200 bg-blue-50 rounded p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="font-medium text-gray-900">{task.vehicleId}</span>
                            <span className="text-sm text-gray-600 ml-2">{vehicle?.locationBase}</span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{task.title}</p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-blue-600 font-medium">
                            <User className="h-3 w-3 inline mr-1" />
                            {technician?.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            Due: {new Date(task.scheduledDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}