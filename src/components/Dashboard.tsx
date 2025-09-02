import React from 'react';
import { MaintenanceTask, Technician, Vehicle, DashboardMetrics } from '../types';
import { 
  BarChart3, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users,
  Camera,
  TrendingUp,
  Calendar,
  MapPin
} from 'lucide-react';

interface DashboardProps {
  tasks: MaintenanceTask[];
  technicians: Technician[];
  vehicles: Vehicle[];
}

export function Dashboard({ tasks, technicians, vehicles }: DashboardProps) {
  // Calculate metrics
  const totalTasks = tasks.length;
  const overdueTasks = tasks.filter(task => {
    if (task.status === 'Completed') return false;
    return new Date(task.scheduledDate) < new Date();
  }).length;
  const completedTasks = tasks.filter(task => task.status === 'Completed').length;
  const pendingTasks = tasks.filter(task => task.status === 'Pending').length;
  const inProgressTasks = tasks.filter(task => task.status === 'In Progress').length;

  // Technician workload
  const technicianWorkload = technicians.map(tech => {
    const assignedTasks = tasks.filter(task => 
      task.technicianId === tech.id && 
      ['Assigned', 'In Progress'].includes(task.status)
    );
    return {
      ...tech,
      currentTasks: assignedTasks.length,
      workloadPercentage: (assignedTasks.length / tech.maxTasks) * 100
    };
  });

  // Recent completions with photos
  const recentCompletions = tasks
    .filter(task => task.status === 'Completed' && task.completedDate)
    .sort((a, b) => new Date(b.completedDate!).getTime() - new Date(a.completedDate!).getTime())
    .slice(0, 6);

  // Vehicle status summary
  const vehiclesByLocation = vehicles.reduce((acc, vehicle) => {
    acc[vehicle.locationBase] = (acc[vehicle.locationBase] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Upcoming tasks (next 7 days)
  const upcomingTasks = tasks.filter(task => {
    if (task.status === 'Completed') return false;
    const taskDate = new Date(task.scheduledDate);
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return taskDate >= today && taskDate <= nextWeek;
  }).sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());

  const getVehicleDetails = (vehicleId: string) => {
    return vehicles.find(v => v.id === vehicleId);
  };

  const getTechnicianDetails = (technicianId: string) => {
    return technicians.find(t => t.id === technicianId);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fleet Maintenance Dashboard</h1>
          <p className="mt-2 text-gray-600">Real-time overview of your maintenance operations</p>
        </div>
        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
          <Calendar className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{overdueTasks}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingTasks}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-purple-600">{inProgressTasks}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Technician Workload */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Technician Workload Distribution
          </h3>
          
          <div className="space-y-4">
            {technicianWorkload.map(tech => (
              <div key={tech.id} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-900">{tech.name}</span>
                    <span className="text-sm text-gray-600">{tech.currentTasks}/{tech.maxTasks}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        tech.workloadPercentage >= 100 ? 'bg-red-500' : 
                        tech.workloadPercentage >= 75 ? 'bg-yellow-500' : 
                        'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(tech.workloadPercentage, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{tech.assignedDepots.join(', ')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fleet Overview */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Fleet Distribution by Location
          </h3>
          
          <div className="space-y-4">
            {Object.entries(vehiclesByLocation).map(([location, count]) => (
              <div key={location} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium text-gray-900">{location}</span>
                  <p className="text-sm text-gray-600">{count} vehicles</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-blue-600">{count}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">Total Fleet</span>
              <span className="text-lg font-bold text-gray-900">{vehicles.length} vehicles</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Tasks and Recent Completions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Tasks (Next 7 Days)</h3>
          {upcomingTasks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No tasks scheduled for the next 7 days</p>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {upcomingTasks.map(task => {
                const vehicle = getVehicleDetails(task.vehicleId);
                const technician = getTechnicianDetails(task.technicianId || '');
                const isToday = new Date(task.scheduledDate).toDateString() === new Date().toDateString();
                
                return (
                  <div key={task.id} className={`border rounded-lg p-3 ${isToday ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{task.vehicleId}</h4>
                        <p className="text-sm text-gray-600">{task.title}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>
                        {isToday ? 'Today' : new Date(task.scheduledDate).toLocaleDateString()}
                        {vehicle && ` • ${vehicle.locationBase}`}
                      </span>
                      {technician && (
                        <span className="font-medium">{technician.name}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Completions Gallery */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Recent Completed Tasks
          </h3>
          {recentCompletions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No completed tasks yet</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
              {recentCompletions.map(task => {
                const vehicle = getVehicleDetails(task.vehicleId);
                const technician = getTechnicianDetails(task.technicianId || '');
                
                return (
                  <div key={task.id} className="border border-green-200 bg-green-50 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-gray-900 text-sm truncate">{task.vehicleId}</h4>
                        <p className="text-xs text-gray-600 truncate">{task.title}</p>
                      </div>
                    </div>
                    
                    {task.afterPhotos && task.afterPhotos.length > 0 && (
                      <div className="mb-2">
                        <img 
                          src={task.afterPhotos[0]} 
                          alt="Completion"
                          className="w-full h-16 object-cover rounded"
                        />
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500">
                      <p className="truncate">
                        {technician?.name} • {vehicle?.locationBase}
                      </p>
                      <p>
                        {task.completedDate ? new Date(task.completedDate).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    
                    {task.partsUsed && task.partsUsed.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-600 font-medium">Parts Used:</p>
                        <div className="text-xs text-gray-500">
                          {task.partsUsed.slice(0, 2).map((part, index) => (
                            <span key={index} className="block truncate">
                              {part.partName} ({part.quantity})
                            </span>
                          ))}
                          {task.partsUsed.length > 2 && (
                            <span className="text-gray-400">+{task.partsUsed.length - 2} more</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Overdue Tasks Alert */}
      {overdueTasks > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <h3 className="text-lg font-semibold text-red-800">
              {overdueTasks} Overdue Task{overdueTasks > 1 ? 's' : ''} Require Attention
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tasks
              .filter(task => {
                if (task.status === 'Completed') return false;
                return new Date(task.scheduledDate) < new Date();
              })
              .slice(0, 4)
              .map(task => {
                const vehicle = getVehicleDetails(task.vehicleId);
                const technician = getTechnicianDetails(task.technicianId || '');
                
                return (
                  <div key={task.id} className="bg-white border border-red-300 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{task.vehicleId}</h4>
                        <p className="text-sm text-gray-600">{task.title}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-red-600 font-medium">
                        Due: {new Date(task.scheduledDate).toLocaleDateString()}
                      </span>
                      <span className="text-gray-500">
                        {technician ? technician.name : 'Unassigned'}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}