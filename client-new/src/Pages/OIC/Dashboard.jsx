import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../Components/Layout';
import { maintenanceAPI, handleAPIError } from '../../utils/Api';
import { CheckCircle2, XCircle, Shield } from 'lucide-react';

const OICDashboard = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [comment, setComment] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const response = await maintenanceAPI.getPendingForOIC();
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', handleAPIError(error));
    } finally {
      setLoading(false);
    }
  };

  const openActionModal = (request, action) => {
    setSelectedRequest(request);
    setActionType(action);
    setComment('');
    setShowModal(true);
  };

  const handleAction = async () => {
    if (!comment.trim()) {
      alert('Please provide a comment');
      return;
    }

    setActionLoading(true);
    try {
      if (actionType === 'approve') {
        await maintenanceAPI.approveByOIC(selectedRequest._id, comment);
      } else {
        await maintenanceAPI.rejectByOIC(selectedRequest._id, comment);
      }
      
      await fetchPendingRequests();
      setShowModal(false);
      setSelectedRequest(null);
      setComment('');
    } catch (error) {
      alert(handleAPIError(error));
    } finally {
      setActionLoading(false);
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
          <div className="w-14 h-14 bg-amber-600 rounded-xl flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-military-100 mb-1">
              OIC Final Approvals
            </h1>
            <p className="text-military-400">
              Review requests approved by Jr Executive Engineer
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6 border-l-4 border-amber-500">
            <h3 className="text-military-400 text-sm mb-2">Awaiting Final Approval</h3>
            <p className="text-3xl font-bold text-military-100">{requests.length}</p>
          </div>
        </div>

        {/* Requests List */}
        <div className="card p-6">
          <h2 className="text-xl font-display font-semibold text-military-100 mb-6">
            Requests for Final Review
          </h2>

          {requests.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="w-16 h-16 text-amber-400 mx-auto mb-4" />
              <p className="text-military-400">No requests pending final approval</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request._id}
                  className="card card-hover p-6 border-l-4 border-amber-500"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-military-100">
                          {request.vehicleId || 'N/A'}
                        </h3>
                        <span className="text-xs font-mono text-military-500">
                          #{request._id.slice(-6)}
                        </span>
                        <span className="status-approved text-xs">
                          Jr Exec Approved
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
                          <p className="text-xs text-military-500 mb-1">Reported By</p>
                          <p className="text-military-300">{request.reportedBy?.name || 'N/A'}</p>
                        </div>
                      </div>

                      {/* Jr Executive Comment */}
                      {request.jeeComment  && (
                        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                          <p className="text-xs text-green-400 mb-1">Jr Executive Comment:</p>
                          <p className="text-military-300 text-sm">{request.jeeComment}</p>
                        </div>
                      )}

                      <div className="flex gap-3">
                        <button
                          onClick={() => openActionModal(request, 'approve')}
                          className="btn-success flex items-center gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Final Approve
                        </button>
                        <button
                          onClick={() => openActionModal(request, 'reject')}
                          className="btn-danger flex items-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card p-8 max-w-lg w-full animate-fade-in">
            <h3 className="text-2xl font-display font-bold text-military-100 mb-4">
              {actionType === 'approve' ? 'Final Approval' : 'Reject Request'}
            </h3>
            
            <div className="mb-6">
              <p className="text-military-400 mb-4">
                Vehicle: <span className="text-military-100 font-semibold">
                  {selectedRequest?.vehicleId}
                </span>
              </p>
              
              <label className="label-field">
                OIC Comment / Decision *
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="input-field h-32 resize-none"
                placeholder="Provide your final decision and comments..."
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAction}
                disabled={actionLoading}
                className={`flex-1 ${
                  actionType === 'approve' ? 'btn-success' : 'btn-danger'
                } disabled:opacity-50`}
              >
                {actionLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </span>
                ) : (
                  `Confirm ${actionType === 'approve' ? 'Approval' : 'Rejection'}`
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

export default OICDashboard;