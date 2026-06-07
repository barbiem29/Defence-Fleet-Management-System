import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../Components/Layout';
import { maintenanceAPI, handleAPIError } from '../../utils/api';
import {
  ArrowLeft,
  Truck,
  Package,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';

const RequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRequest();
  }, [id]);

  const fetchRequest = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await maintenanceAPI.getById(id);

      const data =
        response?.data?.data ??
        response?.data ??
        response;

      setRequest(data);
    } catch (err) {
      setError(handleAPIError(err));
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    const normalized = (status || 'pending').toLowerCase();

    if (normalized === 'approved') {
      return <CheckCircle2 className="w-5 h-5 text-green-400" />;
    }
    if (normalized === 'rejected') {
      return <XCircle className="w-5 h-5 text-red-400" />;
    }
    return <Clock className="w-5 h-5 text-amber-400" />;
  };

  const getStatusBadge = (status) => {
    const normalized = (status || 'pending').toLowerCase();

    if (normalized === 'approved') {
      return <span className="status-approved">Approved</span>;
    }
    if (normalized === 'rejected') {
      return <span className="status-rejected">Rejected</span>;
    }
    return <span className="status-pending">Pending</span>;
  };

  const getSupplierBadge = (status) => {
    const normalized = (status || 'pending').toLowerCase();

    if (normalized === 'supplied') {
      return <span className="status-approved">Supplied</span>;
    }
    if (normalized === 'not available') {
      return <span className="status-rejected">Not Available</span>;
    }
    return <span className="status-pending">Pending</span>;
  };

  const getOverallBadge = (request) => {
    const jee = (request?.approvalByJEE || 'pending').toLowerCase();
    const oic = (request?.approvalByOIC || 'pending').toLowerCase();

    if (jee === 'rejected' || oic === 'rejected') {
      return <span className="status-rejected">Rejected</span>;
    }

    if (jee === 'approved' && oic === 'approved') {
      return <span className="status-approved">Fully Approved</span>;
    }

    if (jee === 'approved') {
      return <span className="status-pending">Awaiting OIC</span>;
    }

    return <span className="status-pending">Awaiting Jr Exec</span>;
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

  if (error || !request) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="card p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-400 mb-4">{error || 'Request not found.'}</p>
            <button
              onClick={() => navigate('/dashboard/vehicle-manager/requests')}
              className="btn-secondary"
            >
              ← Back to Requests
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard/vehicle-manager/requests')}
            className="p-2 hover:bg-military-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-military-300" />
          </button>

          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-display font-bold text-military-100">
                Maintenance Request
              </h1>
              {getOverallBadge(request)}
            </div>
            <p className="text-military-400 mt-1 font-mono text-sm">
              #{request._id?.slice(-8).toUpperCase() || 'N/A'}
            </p>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-olive-600 rounded-lg flex items-center justify-center">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-military-100">
              Vehicle Information
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-military-500 mb-1">Vehicle ID</p>
              <p className="text-military-100 font-medium">
                {request.vehicleId || 'N/A'}
              </p>
            </div>

            <div>
              <p className="text-military-500 mb-1">Vehicle Description</p>
              <p className="text-military-100 font-medium">
                {request.description || 'N/A'}
              </p>
            </div>

            <div>
              <p className="text-military-500 mb-1">Supply Status</p>
              <div className="mt-1">
                {getSupplierBadge(request.supplierStatus)}
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6 space-y-5">
          <h2 className="text-lg font-semibold text-military-100">Fault Details</h2>

          <div>
            <p className="text-military-500 text-sm mb-2">Fault Description</p>
            <p className="text-military-200 leading-relaxed">
              {request.description || 'N/A'}
            </p>
          </div>

          <div className="border-t border-military-700 pt-4">
            <p className="text-military-500 text-sm mb-2">Current Vehicle Condition</p>
            <p className="text-military-200 leading-relaxed">
              {request.currentState || 'N/A'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-olive-400" />
              <h2 className="text-lg font-semibold text-military-100">Required Parts</h2>
            </div>

            {Array.isArray(request.requiredParts) && request.requiredParts.length > 0 ? (
              <ul className="space-y-2">
                {request.requiredParts.map((part, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-military-200 text-sm"
                  >
                    <span className="w-1.5 h-1.5 bg-olive-400 rounded-full flex-shrink-0" />
                    {part}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-military-500 text-sm">No parts listed.</p>
            )}
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-semibold text-military-100 mb-4">
              Estimated Bill
            </h2>
            <p className="text-4xl font-bold text-military-100">
              ₹{Number(request.estimatedBill || 0).toLocaleString('en-IN')}
            </p>
            <p className="text-military-500 text-sm mt-1">Estimated repair cost</p>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-military-100 mb-4">
            Approval Workflow
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-military-800 border border-military-700 space-y-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(request.approvalByJEE)}
                <span className="text-military-300 text-sm font-medium">
                  Jr. Executive
                </span>
              </div>
              {getStatusBadge(request.approvalByJEE)}
              <p className="text-military-500 text-xs">
                Comment: {request.jeeComment || 'No comment'}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-military-800 border border-military-700 space-y-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(request.approvalByOIC)}
                <span className="text-military-300 text-sm font-medium">OIC</span>
              </div>
              {getStatusBadge(request.approvalByOIC)}
              <p className="text-military-500 text-xs">
                Comment: {request.oicComment || 'No comment'}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-military-800 border border-military-700 space-y-2">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-military-400" />
                <span className="text-military-300 text-sm font-medium">
                  Parts Supply
                </span>
              </div>
              {getSupplierBadge(request.supplierStatus)}
              <p className="text-military-500 text-xs">
                Comment: {request.supplierComment || 'No comment'}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-olive-400" />
            <h2 className="text-lg font-semibold text-military-100">Timeline</h2>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-military-700 pb-2">
              <span className="text-military-400">Created At</span>
              <span className="text-military-200">
                {request.createdAt
                  ? new Date(request.createdAt).toLocaleString()
                  : 'N/A'}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-military-400">Last Updated</span>
              <span className="text-military-200">
                {request.updatedAt
                  ? new Date(request.updatedAt).toLocaleString()
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RequestDetail;