import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { maintenanceAPI, handleAPIError } from "../../utils/api";
import { CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";

const PendingApprovals = () => {
  const [requests, setRequests] = useState([]);
  const [counts, setCounts] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadPage();
  }, []);

  const loadPage = async () => {
    try {
      setLoading(true);
      setError("");

      const [pendingRes, countsRes] = await Promise.all([
        maintenanceAPI.getPendingForJrExec(),
        maintenanceAPI.getCounts(),
      ]);

      const pendingData = pendingRes?.data ?? [];
      const countsData = countsRes?.data ?? {};

      setRequests(Array.isArray(pendingData) ? pendingData : []);
      setCounts({
        total: countsData.total || 0,
        pending: countsData.pending || 0,
        approved: countsData.approved || 0,
        rejected: countsData.rejected || 0,
      });
    } catch (err) {
      setError(handleAPIError(err));
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      setActionLoadingId(id);
      await maintenanceAPI.approveByJrExec(id, "Approved by Jr Executive");
      await loadPage();
    } catch (err) {
      setError(handleAPIError(err));
    } finally {
      setActionLoadingId("");
    }
  };

  const handleReject = async (id) => {
    try {
      setActionLoadingId(id);
      await maintenanceAPI.rejectByJrExec(id, "Rejected by Jr Executive");
      await loadPage();
    } catch (err) {
      setError(handleAPIError(err));
    } finally {
      setActionLoadingId("");
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
        <div>
          <h1 className="text-3xl font-display font-bold text-military-100 mb-2">
            Pending Approvals
          </h1>
          <p className="text-military-400">
            Review requests submitted by Vehicle Manager
          </p>
        </div>

        {error && (
          <div className="card p-4 bg-red-500/10 border-red-500/30">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-300">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card p-5">
            <p className="text-military-400 text-sm">Total Submitted</p>
            <p className="text-3xl font-bold text-military-100 mt-2">{counts.total}</p>
          </div>

          <div className="card p-5">
            <p className="text-military-400 text-sm">Pending</p>
            <p className="text-3xl font-bold text-amber-400 mt-2">{counts.pending}</p>
          </div>

          <div className="card p-5">
            <p className="text-military-400 text-sm">Approved</p>
            <p className="text-3xl font-bold text-green-400 mt-2">{counts.approved}</p>
          </div>

          <div className="card p-5">
            <p className="text-military-400 text-sm">Rejected</p>
            <p className="text-3xl font-bold text-red-400 mt-2">{counts.rejected}</p>
          </div>
        </div>

        {requests.length === 0 ? (
          <div className="card p-8 text-center">
            <Clock className="w-10 h-10 text-military-500 mx-auto mb-3" />
            <p className="text-military-300">No pending requests found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request._id} className="card p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="text-xl font-semibold text-military-100">
                        {request.vehicleId || "N/A"}
                      </h2>
                      <span className="status-pending">
                        {request.approvalByJEE || "pending"}
                      </span>
                    </div>

                    <div>
                      <p className="text-military-400 text-sm mb-1">Description</p>
                      <p className="text-military-200">{request.description || "N/A"}</p>
                    </div>

                    <div>
                      <p className="text-military-400 text-sm mb-1">Current State</p>
                      <p className="text-military-200">{request.currentState || "N/A"}</p>
                    </div>

                    <div>
                      <p className="text-military-400 text-sm mb-1">Required Parts</p>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(request.requiredParts) &&
                        request.requiredParts.length > 0 ? (
                          request.requiredParts.map((part, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-military-800 text-military-200 text-xs rounded"
                            >
                              {part}
                            </span>
                          ))
                        ) : (
                          <span className="text-military-400">No parts listed</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div>
                        <p className="text-military-400 text-sm mb-1">Estimated Bill</p>
                        <p className="text-military-100 font-semibold">
                          ₹{Number(request.estimatedBill || 0).toLocaleString("en-IN")}
                        </p>
                      </div>

                      <div>
                        <p className="text-military-400 text-sm mb-1">Submitted On</p>
                        <p className="text-military-100">
                          {request.createdAt
                            ? new Date(request.createdAt).toLocaleString("en-IN")
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 min-w-[180px]">
                    <button
                      onClick={() => handleApprove(request._id)}
                      disabled={actionLoadingId === request._id}
                      className="btn-success flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      {actionLoadingId === request._id ? "Processing..." : "Approve"}
                    </button>

                    <button
                      onClick={() => handleReject(request._id)}
                      disabled={actionLoadingId === request._id}
                      className="btn-danger flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" />
                      {actionLoadingId === request._id ? "Processing..." : "Reject"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PendingApprovals;