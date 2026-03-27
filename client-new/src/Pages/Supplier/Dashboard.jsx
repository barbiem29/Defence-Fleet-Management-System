import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { maintenanceAPI, handleAPIError } from '../../utils/api';
import { Package, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

const SupplierDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [supplyStatus, setSupplyStatus] = useState('');
  const [comment, setComment] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchApprovedRequests();
  }, []);

  const fetchApprovedRequests = async () => {
    try {
      const response = await maintenanceAPI.getApprovedForSupplier();
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', handleAPIError(error));
    } finally {
      setLoading(false);
    }
  };

  const openUpdateModal = (request) => {
    setSelectedRequest(request);
    setSupplyStatus(request.supplierStatus || 'Pending');
    setComment(request.supplierComment || '');
    setShowModal(true);
  };

  const handleUpdate = async () => {
    if (!comment.trim()) {
      alert('Please provide a comment');
      return;
    }

    setActionLoading(true);
    try {
      await maintenanceAPI.updateSupplyStatus(selectedRequest._id, supplyStatus, comment);
      await fetchApprovedRequests();
      setShowModal(false);
      setSelectedRequest(null);
      setSupplyStatus('');
      setComment('');
    } catch (error) {
      alert(handleAPIError(error));
    } finally {
      setActionLoading(false);
    }
  };

  const getSupplyStatusBadge = (status) => {
    switch (status) {
      case 'Supplied':
        return <span className="status-supplied">Supplied</span>;
      case 'Not Available':
        return <span className="status-rejected">Not Available</span>;
      default:
        return <span className="status-pending">Pending</span>;
    }
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
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center">
            <Package className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-military-100 mb-1">
              Supplier Portal
            </h1>
            <p className="text-military-400">
              Update supply status for approved maintenance requests
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card p-6">
            <h3 className="text-military-400 text-sm mb-2">Total Requests</h3>
            <p className="text-3xl font-bold text-military-100">{requests.length}</p>
          </div>
          <div className="card p-6 border-l-4 border-amber-500">
            <h3 className="text-military-400 text-sm mb-2">Pending</h3>
            <p className="text-3xl font-bold text-military-100">
              {requests.filter(r => !(r.supplierStatus || '').toLowerCase() || (r.supplierStatus || '').toLowerCase() === 'pending').length}
            </p>
          </div>
          <div className="card p-6 border-l-4 border-green-500">
            <h3 className="text-military-400 text-sm mb-2">Supplied</h3>
            <p className="text-3xl font-bold text-military-100">
              {requests.filter(r => (r.supplierStatus || '').toLowerCase() === 'supplied').length}
            </p>
          </div>
          <div className="card p-6 border-l-4 border-red-500">
            <h3 className="text-military-400 text-sm mb-2">Not Available</h3>
            <p className="text-3xl font-bold text-military-100">
              {requests.filter(r => (r.supplierStatus || '').toLowerCase() === 'not available').length}
            </p>
          </div>
        </div>

        {/* Requests List */}
        <div className="card p-6">
          <h2 className="text-xl font-display font-semibold text-military-100 mb-6">
            Approved Requests
          </h2>

          {requests.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <p className="text-military-400">No approved requests available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request._id}
                  className="card card-hover p-6 border-l-4 border-green-500"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-military-100">
                          {request.vehicleId|| 'N/A'}
                        </h3>
                        <span className="text-xs font-mono text-military-500">
                          #{request._id.slice(-6)}
                        </span>
                        <span className="status-approved text-xs">
                          Fully Approved
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-military-500 mb-1">Description</p>
                          <p className="text-military-300">{request.description}</p>
                        </div>
                        <div>
                          <p className="text-xs text-military-500 mb-1">Current State</p>
                          <p className="text-military-300">{request.currentState}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-military-500 mb-1">Required Parts</p>
                          <div className="flex flex-wrap gap-1">
                            {request.requiredParts.map((part, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-military-800 text-military-300 text-xs rounded"
                              >
                                {part}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-military-500 mb-1">Estimated Bill</p>
                          <p className="text-lg font-bold text-military-100">
                            ₹{request.estimatedBill.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-military-500 mb-1">Supply Status</p>
                          {getSupplyStatusBadge(request.supplierStatus || 'Pending')}
                        </div>
                      </div>

                      {/* Approval Comments */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {request.jeeComment && (
                          <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                            <p className="text-xs text-green-400 mb-1">Jr Executive:</p>
                            <p className="text-military-300 text-sm">{request.jeeComment  }</p>
                          </div>
                        )}
                        {request.oicComment   && (
                          <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                            <p className="text-xs text-green-400 mb-1">OIC:</p>
                            <p className="text-military-300 text-sm">{request.oicComment}</p>
                          </div>
                        )}
                      </div>

                      {/* Supplier Comment if exists */}
                      {request.supplierComment&& (
                        <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                          <p className="text-xs text-blue-400 mb-1">Your Comment:</p>
                          <p className="text-military-300 text-sm">{request.supplierComment}</p>
                        </div>
                      )}

                      <button
                        onClick={() => openUpdateModal(request)}
                        className="btn-primary flex items-center gap-2"
                      >
                        <Package className="w-4 h-4" />
                        Update Supply Status
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Update Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card p-8 max-w-lg w-full animate-fade-in">
            <h3 className="text-2xl font-display font-bold text-military-100 mb-4">
              Update Supply Status
            </h3>
            
            <div className="mb-6 space-y-4">
              <p className="text-military-400">
                Vehicle: <span className="text-military-100 font-semibold">
                  {selectedRequest?.vehicle?.name}
                </span>
              </p>
              
              <div>
                <label className="label-field">
                  Supply Status *
                </label>
                <select
                  value={supplyStatus}
                  onChange={(e) => setSupplyStatus(e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="Supplied">Supplied</option>
                  <option value="Not Available">Not Available</option>
                </select>
              </div>

              <div>
                <label className="label-field">
                  Comment / Remark *
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="input-field h-32 resize-none"
                  placeholder="Provide details about the supply status (e.g., delivery date, delays, shortages)..."
                  required
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleUpdate}
                disabled={actionLoading}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                {actionLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating...
                  </span>
                ) : (
                  'Update Status'
                )}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 btn-secondary"
                disabled={actionLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default SupplierDashboard;