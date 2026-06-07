import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../Components/Layout';
import { maintenanceAPI, vehicleAPI, handleAPIError } from '../../utils/api';
import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

const CreateRequest = () => {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [fetchingVehicles, setFetchingVehicles] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    vehicle: '',
    description: '',
    currentState: '',
    requiredParts: [''],
    estimatedBill: '',
  });

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setFetchingVehicles(true);
        setError('');

        const response = await vehicleAPI.getAll();

        const vehicleData =
          Array.isArray(response?.data) ? response.data :
          Array.isArray(response?.data?.data) ? response.data.data :
          Array.isArray(response?.data?.vehicles) ? response.data.vehicles :
          Array.isArray(response) ? response :
          [];

        setVehicles(vehicleData);
      } catch (err) {
        setVehicles([]);
        setError(handleAPIError(err));
        console.error('Vehicle fetch error:', err);
      } finally {
        setFetchingVehicles(false);
      }
    };

    fetchVehicles();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (error) setError('');
  };

  const handlePartChange = (index, value) => {
    const updatedParts = [...formData.requiredParts];
    updatedParts[index] = value;

    setFormData((prev) => ({
      ...prev,
      requiredParts: updatedParts,
    }));
  };

  const addPart = () => {
    setFormData((prev) => ({
      ...prev,
      requiredParts: [...prev.requiredParts, ''],
    }));
  };

  const removePart = (index) => {
    if (formData.requiredParts.length === 1) return;

    const updatedParts = formData.requiredParts.filter((_, i) => i !== index);

    setFormData((prev) => ({
      ...prev,
      requiredParts: updatedParts,
    }));
  };

  const validateForm = () => {
    if (!formData.vehicle) return 'Please select a vehicle.';
    if (!formData.description.trim()) return 'Please enter fault description.';
    if (!formData.currentState.trim()) return 'Please enter current vehicle condition.';
    if (formData.requiredParts.filter((part) => part.trim()).length === 0) {
      return 'Please add at least one required part.';
    }
    if (!formData.estimatedBill || Number(formData.estimatedBill) < 0) {
      return 'Please enter a valid estimated bill amount.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess(false);

      const requestData = {
        vehicleId: formData.vehicle,
        description: formData.description.trim(),
        currentState: formData.currentState.trim(),
        requiredParts: formData.requiredParts.filter((part) => part.trim()),
        estimatedBill: parseFloat(formData.estimatedBill),
      };

      await maintenanceAPI.create(requestData);

      setSuccess(true);

      setFormData({
        vehicle: '',
        description: '',
        currentState: '',
        requiredParts: [''],
        estimatedBill: '',
      });

      setTimeout(() => {
        navigate('/dashboard/vehicle-manager/requests');
      }, 1500);
    } catch (err) {
      setError(handleAPIError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard/vehicle-manager')}
            className="p-2 hover:bg-military-800 rounded-lg transition-colors"
            type="button"
          >
            <ArrowLeft className="w-6 h-6 text-military-300" />
          </button>

          <div>
            <h1 className="text-3xl font-display font-bold text-military-100">
              Create Maintenance Request
            </h1>
            <p className="text-military-400 mt-1">
              Submit a new maintenance request for a vehicle
            </p>
          </div>
        </div>

        {success && (
          <div className="card p-4 bg-green-500/10 border border-green-500/30">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <p className="text-green-300">Request created successfully.</p>
            </div>
          </div>
        )}

        {error && (
          <div className="card p-4 bg-red-500/10 border border-red-500/30">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-300">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="card p-8 space-y-6">
          <div>
            <label className="label-field">Select Vehicle *</label>

            {fetchingVehicles ? (
              <div className="input-field flex items-center gap-2 text-military-400">
                <div className="w-4 h-4 border-2 border-olive-400 border-t-transparent rounded-full animate-spin" />
                Loading vehicles...
              </div>
            ) : (
              <select
                name="vehicle"
                value={formData.vehicle}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Choose a vehicle</option>

                {vehicles.map((vehicle) => (
                  <option
                    key={vehicle._id || vehicle.vehicleId}
                    value={vehicle.vehicleId}
                  >
                    {vehicle.description || 'No description'} - {vehicle.vehicleId} (Class {vehicle.status || 'N/A'})
                  </option>
                ))}
              </select>
            )}

            {!fetchingVehicles && vehicles.length === 0 && (
              <p className="text-yellow-400 text-sm mt-2">
                No vehicles found in the database.
              </p>
            )}
          </div>

          <div>
            <label className="label-field">Fault Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input-field h-32 resize-none"
              placeholder="Describe the issue in detail."
              required
            />
          </div>

          <div>
            <label className="label-field">Current Vehicle Condition *</label>
            <textarea
              name="currentState"
              value={formData.currentState}
              onChange={handleChange}
              className="input-field h-24 resize-none"
              placeholder="Describe the current state of the vehicle."
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="label-field mb-0">Required Parts *</label>

              <button
                type="button"
                onClick={addPart}
                className="text-olive-400 hover:text-olive-300 text-sm font-medium flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Part
              </button>
            </div>

            <div className="space-y-3">
              {formData.requiredParts.map((part, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={part}
                    onChange={(e) => handlePartChange(index, e.target.value)}
                    className="input-field flex-1"
                    placeholder={`Part ${index + 1}`}
                    required
                  />

                  {formData.requiredParts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePart(index)}
                      className="p-2.5 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="label-field">Estimated Bill (₹) *</label>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-military-400 font-semibold">
                ₹
              </span>

              <input
                type="number"
                name="estimatedBill"
                value={formData.estimatedBill}
                onChange={handleChange}
                className="input-field pl-8"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-military-700">
            <button
              type="submit"
              disabled={loading || fetchingVehicles}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Submit Request
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate('/dashboard/vehicle-manager')}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreateRequest;