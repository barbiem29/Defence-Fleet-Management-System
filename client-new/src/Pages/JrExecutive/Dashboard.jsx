import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { maintenanceAPI, handleAPIError } from "../../utils/api";
import {
  CheckCircle2,
  XCircle,
  Eye,
  Clock,
  FileText,
  AlertCircle,
} from "lucide-react";

const JrExecutiveDashboard = () => {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const stats = {
    total: requests.length,
    pending: requests.filter(
      (r) => (r.approvalByJEE || "pending") === "pending"
    ).length,
    approved: requests.filter(
      (r) => (r.approvalByJEE || "pending") === "approved"
    ).length,
    rejected: requests.filter(
      (r) => (r.approvalByJEE || "pending") === "rejected"
    ).length,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await maintenanceAPI.getAll();
        const allRequests = Array.isArray(data) ? data : [];

        setRequests(allRequests);
        setRecentRequests(allRequests.slice(0, 5));
      } catch (err) {
        setError(handleAPIError(err));
        setRequests([]);
        setRecentRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const StatCard = ({ icon: Icon, label, value, color, bgColor, onClick }) => (
    <div
      onClick={onClick}
      className={`card card-hover p-6 relative overflow-hidden ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      <div
        className={`absolute top-0 right-0 w-32 h-32 ${bgColor} opacity-10 rounded-full -mr-16 -mt-16`}
      />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}
          >
            <Icon className={`w-6 h-6 ${color}`} />
          </div>
        </div>
        <h3 className="text-3xl font-bold text-military-100 mb-1">{value}</h3>
        <p className="text-military-400 text-sm font-medium">{label}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="loading-spinner" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-military-100 mb-2">
            Jr Executive Dashboard
          </h1>
          <p className="text-military-400">
            Quick overview of maintenance requests requiring your attention
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={FileText}
            label="Total Issues Raised"
            value={stats.total}
            color="text-blue-400"
            bgColor="bg-blue-500"
            onClick={() => navigate("/dashboard/jr-executive/all-issues")}
          />
          <StatCard
            icon={Clock}
            label="Pending Issues"
            value={stats.pending}
            color="text-amber-400"
            bgColor="bg-amber-500"
            onClick={() => navigate("/dashboard/jr-executive/pending-approvals")}
          />
          <StatCard
            icon={CheckCircle2}
            label="Approved Issues"
            value={stats.approved}
            color="text-green-400"
            bgColor="bg-green-500"
            onClick={() => navigate("/dashboard/jr-executive/approved")}
          />
          <StatCard
            icon={XCircle}
            label="Rejected Issues"
            value={stats.rejected}
            color="text-red-400"
            bgColor="bg-red-500"
            onClick={() => navigate("/dashboard/jr-executive/rejected")}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ActionCard
            icon={Clock}
            title="Review Pending Requests"
            description={`${stats.pending} requests awaiting your approval`}
            color="text-amber-400"
            onClick={() => navigate("/dashboard/jr-executive/pending-approvals")}
          />

          <ActionCard
            icon={FileText}
            title="View All Issues"
            description="Complete list of maintenance requests"
            color="text-olive-400"
            onClick={() => navigate("/dashboard/jr-executive/all-issues")}
          />
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-semibold text-military-100">
              Recent Requests
            </h2>
            <button
              onClick={() => navigate("/dashboard/jr-executive/pending-approvals")}
              className="text-olive-400 hover:text-olive-300 text-sm font-medium transition-colors"
            >
              View All →
            </button>
          </div>

          {recentRequests.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <p className="text-military-400">No requests found.</p>
            </div>
          ) : (
            <Table requests={recentRequests} navigate={navigate} />
          )}
        </div>
      </div>
    </Layout>
  );
};

const ActionCard = ({ icon: Icon, title, description, color, onClick }) => (
  <button
    onClick={onClick}
    className="card card-hover p-6 text-left transition-all duration-200"
  >
    <Icon className={`w-8 h-8 ${color} mb-3`} />
    <h3 className="text-lg font-semibold text-military-100 mb-1">{title}</h3>
    <p className="text-military-400 text-sm">{description}</p>
  </button>
);

const getJeeStatusBadge = (status) => {
  const normalized = (status || "pending").toLowerCase();

  if (normalized === "approved") {
    return <span className="status-approved">Approved</span>;
  }
  if (normalized === "rejected") {
    return <span className="status-rejected">Rejected</span>;
  }
  return <span className="status-pending">Pending</span>;
};

const Table = ({ requests, navigate }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b border-military-700">
          <th className="table-header text-left py-3 px-4">Vehicle ID</th>
          <th className="table-header text-left py-3 px-4">Description</th>
          <th className="table-header text-left py-3 px-4">Date Reported</th>
          <th className="table-header text-left py-3 px-4">JEE Status</th>
          <th className="table-header text-center py-3 px-4">Action</th>
        </tr>
      </thead>
      <tbody>
        {requests.map((r) => (
          <tr key={r._id} className="table-row">
            <td className="py-4 px-4 text-military-100 font-medium">
              {r.vehicleId || "N/A"}
            </td>
            <td className="py-4 px-4 text-military-300">
              {r.description
                ? r.description.length > 50
                  ? `${r.description.substring(0, 50)}...`
                  : r.description
                : "N/A"}
            </td>
            <td className="py-4 px-4 text-military-400 text-sm">
              {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "N/A"}
            </td>
            <td className="py-4 px-4">
              {getJeeStatusBadge(r.approvalByJEE)}
            </td>
            <td className="py-4 px-4 text-center">
              <button
                onClick={() => navigate(`/dashboard/jr-executive/issue/${r._id}`)}
                className="inline-flex items-center gap-1 text-olive-400 hover:text-olive-300 font-medium text-sm transition-colors"
              >
                <Eye className="w-4 h-4" />
                Review
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default JrExecutiveDashboard;