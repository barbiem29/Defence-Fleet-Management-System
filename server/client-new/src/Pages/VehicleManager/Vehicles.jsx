import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../Components/Layout';
import { vehicleAPI, handleAPIError } from '../../utils/api';
import { Truck, Search, Filter, Plus } from 'lucide-react';

const Vehicles = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    filterVehicles();
  }, [vehicles, searchTerm, filterClass, filterStatus]);

  const fetchVehicles = async () => {
    try {
      const response = await vehicleAPI.getAll();
      const data = Array.isArray(response) ? response : response.data || [];
      setVehicles(data);
    } catch (error) {
      console.error('Error fetching vehicles:', handleAPIError(error));
    } finally {
      setLoading(false);
    }
  };

  const filterVehicles = () => {
    let filtered = [...vehicles];

    if (searchTerm) {
      filtered = filtered.filter((vehicle) =>
        vehicle.vehicleId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterClass !== 'all') {
      filtered = filtered.filter((vehicle) => vehicle.vehicleClass === filterClass);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((vehicle) => vehicle.status === filterStatus);
    }

    setFilteredVehicles(filtered);
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      Active: 'status-approved',
      'Under Repair': 'status-pending',
      Inactive: 'status-rejected',
    };
    return <span className={statusColors[status] || 'status-badge'}>{status}</span>;
  };

  const getClassColor = (vehicleClass) => {
    const colors = {
      A: 'bg-red-500/20 text-red-300 border-red-500/30',
      B: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      C: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      D: 'bg-green-500/20 text-green-300 border-green-500/30',
    };
    return colors[vehicleClass] || 'bg-military-700 text-military-300';
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="loading-spinner"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-military-100 mb-2">
              Fleet Vehicles
            </h1>
            <p className="text-military-400">View and manage all vehicles in the fleet</p>
          </div>
          <button
            onClick={() => navigate('/dashboard/vehicle-manager/vehicles/add')}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Vehicle
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card p-6">
            <h3 className="text-military-400 text-sm mb-2">Total Vehicles</h3>
            <p className="text-3xl font-bold text-military-100">{vehicles.length}</p>
          </div>
          <div className="card p-6 border-l-4 border-green-500">
            <h3 className="text-military-400 text-sm mb-2">Active</h3>
            <p className="text-3xl font-bold text-military-100">
              {vehicles.filter((v) => v.status === 'Active').length}
            </p>
          </div>
          <div className="card p-6 border-l-4 border-amber-500">
            <h3 className="text-military-400 text-sm mb-2">Under Repair</h3>
            <p className="text-3xl font-bold text-military-100">
              {vehicles.filter((v) => v.status === 'Under Repair').length}
            </p>
          </div>
          <div className="card p-6 border-l-4 border-red-500">
            <h3 className="text-military-400 text-sm mb-2">Inactive</h3>
            <p className="text-3xl font-bold text-military-100">
              {vehicles.filter((v) => v.status === 'Inactive').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-military-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search vehicles..."
                className="input-field pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-military-400" />
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="input-field w-40"
              >
                <option value="all">All Classes</option>
                <option value="A">Class A</option>
                <option value="B">Class B</option>
                <option value="C">Class C</option>
                <option value="D">Class D</option>
              </select>
            </div>
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field w-48"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Under Repair">Under Repair</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Vehicles Grid */}
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-display font-semibold text-military-100">
              All Vehicles ({filteredVehicles.length})
            </h2>
          </div>

          {filteredVehicles.length === 0 ? (
            <div className="text-center py-12">
              <Truck className="w-16 h-16 text-military-600 mx-auto mb-4" />
              <p className="text-military-400 mb-4">No vehicles found</p>
              <button
                onClick={() => navigate('/dashboard/vehicle-manager/vehicles/add')}
                className="btn-primary"
              >
                Add Your First Vehicle
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVehicles.map((vehicle) => (
                <div key={vehicle._id} className="card card-hover p-6 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-olive-600 rounded-lg flex items-center justify-center">
                        <Truck className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-military-100">{vehicle.name}</h3>
                        <span
                          className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-semibold border ${getClassColor(
                            vehicle.vehicleClass
                          )}`}
                        >
                          Class {vehicle.vehicleClass}
                        </span>
                      </div>
                    </div>
                  </div>

                  {vehicle.registrationNumber && (
                    <p className="text-military-500 text-xs font-mono">
                      {vehicle.registrationNumber}
                    </p>
                  )}

                  <div className="pt-3 border-t border-military-700">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-military-500">Status</span>
                      {getStatusBadge(vehicle.status)}
                    </div>
                    {vehicle.serviceLifePercent !== undefined && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-military-500 mb-1">
                          <span>Service Life Used</span>
                          <span>{vehicle.serviceLifePercent}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-military-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              vehicle.serviceLifePercent >= 80
                                ? 'bg-red-500'
                                : vehicle.serviceLifePercent >= 50
                                ? 'bg-amber-500'
                                : 'bg-green-500'
                            }`}
                            style={{ width: `${vehicle.serviceLifePercent}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Vehicles;