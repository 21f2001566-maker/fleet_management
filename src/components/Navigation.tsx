import React from 'react';
import { 
  Truck, 
  Users, 
  ClipboardList, 
  BarChart3, 
  Settings,
  Bell,
  User
} from 'lucide-react';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  userRole: 'admin' | 'technician';
  overdueCount: number;
}

export function Navigation({ currentView, onViewChange, userRole, overdueCount }: NavigationProps) {
  const adminNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'fleet', label: 'Fleet Management', icon: Truck },
    { id: 'tasks', label: 'Task Generation', icon: ClipboardList },
    { id: 'assignments', label: 'Task Assignments', icon: Users },
  ];

  const technicianNavItems = [
    { id: 'technician', label: 'My Tasks', icon: ClipboardList },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  ];

  const navItems = userRole === 'admin' ? adminNavItems : technicianNavItems;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Truck className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">FleetMaintain Pro</span>
            </div>
            
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              {navItems.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onViewChange(item.id)}
                    className={`${
                      currentView === item.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {overdueCount > 0 && (
              <div className="relative">
                <Bell className="h-6 w-6 text-red-500" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {overdueCount}
                </span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <User className="h-6 w-6 text-gray-400" />
              <span className="text-sm font-medium text-gray-700 capitalize">{userRole}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}