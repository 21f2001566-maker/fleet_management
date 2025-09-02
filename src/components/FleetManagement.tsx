import React, { useState } from 'react';
import { Vehicle } from '../types';
import { Truck, MapPin, Calendar, Settings, Plus, Search, Filter } from 'lucide-react';

interface FleetManagementProps {
  vehicles: Vehicle[];
  onVehicleUpdate: (vehicle: Vehicle) => void;
}

export function FleetManagement({ vehicles, onVehicleUpdate }: FleetManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [filterLocation, setFilterLocation] = useState<string>('All');
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || vehicle.type === filterType;
    const matchesLocation = filterLocation === 'All' || vehicle.locationBase === filterLocation;
    return matchesSearch && matchesType && matchesLocation;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'In Service': return 'bg-yellow-100 text-yellow-800';
      case 'Out of Service': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    return <Truck className="h-5 w-5" />;
  };

  const handleEditSave = (vehicle: Vehicle) => {
    onVehicleUpdate(vehicle);
    setEditingVehicle(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fleet Management</h1>
          <p className="mt-2 text-gray-600">Manage your vehicle fleet and track maintenance schedules</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus className="h-4 w-4" />
          Add Vehicle
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search vehicles..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="Truck">Trucks</option>
            <option value="Van">Vans</option>
            <option value="Car">Cars</option>
            <option value="Motorcycle">Motorcycles</option>
          </select>
          
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
          >
            <option value="All">All Locations</option>
            <option value="Depot A">Depot A</option>
            <option value="Depot B">Depot B</option>
            <option value="Field Office">Field Office</option>
          </select>
        </div>
      </div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map(vehicle => (
          <div key={vehicle.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getTypeIcon(vehicle.type)}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{vehicle.id}</h3>
                    <p className="text-sm text-gray-600">{vehicle.type}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vehicle.status)}`}>
                  {vehicle.status}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{vehicle.locationBase}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Last Service: {new Date(vehicle.lastServiceDate).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Mileage:</span>
                  <span className="font-medium">{vehicle.mileage.toLocaleString()} mi</span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Interval:</span>
                  <span className="font-medium">{vehicle.serviceInterval}</span>
                </div>
              </div>
              
              <button
                onClick={() => setEditingVehicle(vehicle)}
                className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Settings className="h-4 w-4" />
                Edit Vehicle
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Vehicle Modal */}
      {editingVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Edit Vehicle: {editingVehicle.id}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
                <select
                  value={editingVehicle.type}
                  onChange={(e) => setEditingVehicle({
                    ...editingVehicle,
                    type: e.target.value as Vehicle['type']
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Truck">Truck</option>
                  <option value="Van">Van</option>
                  <option value="Car">Car</option>
                  <option value="Motorcycle">Motorcycle</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location Base</label>
                <select
                  value={editingVehicle.locationBase}
                  onChange={(e) => setEditingVehicle({
                    ...editingVehicle,
                    locationBase: e.target.value as Vehicle['locationBase']
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Depot A">Depot A</option>
                  <option value="Depot B">Depot B</option>
                  <option value="Field Office">Field Office</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mileage</label>
                <input
                  type="number"
                  value={editingVehicle.mileage}
                  onChange={(e) => setEditingVehicle({
                    ...editingVehicle,
                    mileage: parseInt(e.target.value) || 0
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Interval</label>
                <select
                  value={editingVehicle.serviceInterval}
                  onChange={(e) => setEditingVehicle({
                    ...editingVehicle,
                    serviceInterval: e.target.value as Vehicle['serviceInterval']
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Weekly">Weekly</option>
                  <option value="Bi-weekly">Bi-weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Service Date</label>
                <input
                  type="date"
                  value={editingVehicle.lastServiceDate}
                  onChange={(e) => setEditingVehicle({
                    ...editingVehicle,
                    lastServiceDate: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => handleEditSave(editingVehicle)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditingVehicle(null)}
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