import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../Components/Layout';
import { vehicleAPI, handleAPIError } from '../../utils/api';
import { Save, ArrowLeft, Truck, AlertCircle, CheckCircle } from 'lucide-react';

const VEHICLE_CLASSES = [
  { value: 'A', label: 'Class A', desc: 'Fully operational — perfect condition' },
  { value: 'B', label: 'Class B', desc: 'Minor issues, repairable in unit workshop' },
  { value: 'C', label: 'Class C', desc: 'Has used ~60% of service life' },
  { value: 'D', label: 'Class D', desc: 'Retired — completed service life' },
];

const AddVehicle = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    vehicleId: '',
    description: '',
    status: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (error) setError('');
  };

  const validate = () => {
    if (!formData.vehicleId.trim()) return 'Vehicle ID is required.';
    if (!formData.description.trim()) return 'Vehicle description is required.';
    if (!formData.status) return 'Vehicle class/status is required.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setLoading(true);

    try {
      const payload = {
        vehicleId: formData.vehicleId.trim(),
        description: formData.description.trim(),
        status: formData.status, // A | B | C | D
      };

      await vehicleAPI.create(payload);

      setSuccess(true);
      setFormData({
        vehicleId: '',
        description: '',
        status: '',
      });

      setTimeout(() => {
        navigate('/dashboard/vehicle-manager/vehicles');
      }, 1500);
    } catch (err) {
      setError(handleAPIError(err));
      console.error('Add vehicle error:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectedClass = VEHICLE_CLASSES.find((c) => c.value === formData.status);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard/vehicle-manager/vehicles')}
            className="p-2 hover:bg-military-800 rounded-lg transition-colors"
            type="button"
          >
            <ArrowLeft className="w-6 h-6 text-military-300" />
          </button>

          <div>
            <h1 className="text-3xl font-display font-bold text-military-100">
              Add New Vehicle
            </h1>
            <p className="text-military-400 mt-1">
              Register a new vehicle in the fleet
            </p>
          </div>
        </div>

        {success && (
          <div className="card p-4 bg-green-500/10 border border-green-500/30 animate-slide-in">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <p className="text-green-300">
                Vehicle added successfully! Redirecting...
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="card p-4 bg-red-500/10 border border-red-500/30 animate-slide-in">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-300">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="card p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-military-700">
            <div className="w-10 h-10 bg-olive-600 rounded-lg flex items-center justify-center">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-military-100">Vehicle Details</h2>
          </div>

          <div>
            <label className="label-field">Vehicle ID *</label>
            <input
              type="text"
              name="vehicleId"
              value={formData.vehicleId}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g. BA-1024, TATA-07, VEH-001"
              required
            />
          </div>

          <div>
            <label className="label-field">Vehicle Description *</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g. TATA 407, BMP-II, Stallion Truck"
              required
            />
          </div>

          <div>
            <label className="label-field">Vehicle Class / Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="">Select class...</option>
              {VEHICLE_CLASSES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {selectedClass && (
            <div className="p-3 rounded-lg bg-military-800 border border-military-600 text-sm text-military-300">
              <span className="font-semibold text-military-100">{selectedClass.label}:</span>{' '}
              {selectedClass.desc}
            </div>
          )}

          <div className="flex gap-4 pt-4 border-t border-military-700">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Add Vehicle
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate('/dashboard/vehicle-manager/vehicles')}
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

export default AddVehicle;