import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from '../../Components/Layout';
import { maintenanceAPI, handleAPIError } from "../../utils/api";
import { XCircle, Eye, Search, AlertTriangle } from "lucide-react";

const RejectedIssues = () => {
    const navigate = useNavigate();

    const [issues, setIssues] = useState([]);
    const [filteredIssues, setFilteredIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("date-desc");

    useEffect(() => {
        fetchRejectedIssues();
    }, []);

    useEffect(() => {
        filterIssues();
    }, [issues, searchTerm, sortBy]);

    const fetchRejectedIssues = async () => {
        try {
            const { data } = await maintenanceAPI.getAll();
            setIssues(data.filter(i => (i.approvalByJEE || '').toLowerCase() === 'rejected'));
        } catch (err) {
            console.error("Error:", handleAPIError(err));
        } finally {
            setLoading(false);
        }
    };

    const filterIssues = () => {
        const term = searchTerm.toLowerCase();

        let filtered = issues.filter(issue =>
            !term ||
            issue.vehicleId?.toLowerCase().includes(term) ||
            issue.description.toLowerCase().includes(term) ||
            issue.jeeComment.toLowerCase().includes(term)
        );

        filtered.sort((a, b) =>
            sortBy === "date-asc"
                ? new Date(a.updatedAt) - new Date(b.updatedAt)
                : new Date(b.updatedAt) - new Date(a.updatedAt)
        );

        setFilteredIssues(filtered);
    };

    if (loading)
        return (
            <Layout>
                <div className="flex items-center justify-center h-full">
                    <div className="loading-spinner" />
                </div>
            </Layout>
        );

    const totalRejectedValue = issues
        .reduce((sum, i) => sum + (i.estimatedBill || 0), 0)
        .toLocaleString();

    const latestRejection =
        issues.length > 0
            ? new Date(
                Math.max(...issues.map(i => new Date(i.updatedAt)))
            ).toLocaleDateString()
            : "N/A";

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-display font-bold text-military-100 mb-2">
                        Rejected Issues
                    </h1>
                    <p className="text-military-400">
                        Issues you have rejected - complete rejection history with reasons
                    </p>
                </div>

                {/* Stats */}
                <div className="grid md:grid-cols-4 gap-6">
                    <div className="card p-6 border-l-4 border-red-500">
                        <div className="flex items-center gap-3 mb-2">
                            <XCircle className="w-5 h-5 text-red-400" />
                            <h3 className="text-military-400 text-sm font-medium">
                                Total Rejected
                            </h3>
                        </div>
                        <p className="text-3xl font-bold text-military-100">
                            {issues.length}
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="card p-6">
                    <div className="grid md:grid-cols-4 gap-4">
                        <div className="md:col-span-2 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-military-500" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                placeholder="Search by vehicle, description, or rejection reason..."
                                className="input-field pl-10 w-full"
                            />
                        </div>

                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                            className="input-field w-full"
                        >
                            <option value="date-desc">Recently Rejected</option>
                            <option value="date-asc">Oldest First</option>
                        </select>
                    </div>
                </div>

                {/* Insights */}
                {issues.length > 0 && (
                    <div className="card p-6">
                        <h2 className="text-lg font-display font-semibold text-military-100 mb-4">
                            Quick Insights
                        </h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            <InsightCard
                                label="Total Value Rejected"
                                value={`₹${totalRejectedValue}`}
                                color="amber"
                            />
                            <InsightCard
                                label="Latest Rejection"
                                value={latestRejection}
                                color="blue"
                            />
                        </div>
                    </div>
                )}

                {/* Table */}
                <div className="card p-6">
                    <h2 className="text-xl font-display font-semibold text-military-100 mb-4">
                        Rejection History ({filteredIssues.length})
                    </h2>

                    {filteredIssues.length === 0 ? (
                        <div className="text-center py-12">
                            <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4 opacity-50" />
                            <p className="text-military-400">
                                {issues.length === 0
                                    ? "No rejected issues yet"
                                    : "No rejected issues found matching your filters"}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-military-700">
                                        <th className="table-header py-3 px-4 text-left">Request ID</th>
                                        <th className="table-header py-3 px-4 text-left">Vehicle</th>
                                        <th className="table-header py-3 px-4 text-left">Issue</th>
                                        <th className="table-header py-3 px-4 text-left">Reason</th>
                                        <th className="table-header py-3 px-4 text-left">Date</th>
                                        <th className="table-header py-3 px-4 text-left">Bill</th>
                                        <th className="table-header py-3 px-4 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredIssues.map(issue => {
                                        const date = new Date(issue.updatedAt);
                                        return (
                                            <tr key={issue._id} className="table-row">
                                                <td className="py-4 px-4 font-mono text-sm text-military-300">
                                                    #{issue._id.slice(-6).toUpperCase()}
                                                </td>
                                                <td className="py-4 px-4 font-medium text-military-100">
                                                    {issue.vehicleId|| "N/A"}
                                                </td>
                                                <td className="py-4 px-4 text-military-300 max-w-xs truncate">
                                                    {issue.description}
                                                </td>
                                                <td className="py-4 px-4 text-military-400 text-sm max-w-xs truncate">
                                                    {issue.jeeComment
                                                        ? issue.jeeComment .substring(0, 60) + "..."
                                                        : "No reason provided"}
                                                </td>
                                                <td className="py-4 px-4 text-military-400 text-sm">
                                                    {date.toLocaleDateString()}
                                                    <p className="text-xs text-military-500">
                                                        {date.toLocaleTimeString("en-IN", {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </p>
                                                </td>
                                                <td className="py-4 px-4 font-semibold text-military-300">
                                                    ₹{issue.estimatedBill?.toLocaleString() || "0"}
                                                </td>
                                                <td className="py-4 px-4 text-center">
                                                    <button
                                                        onClick={() =>
                                                            navigate(`/dashboard/jr-executive/issue/${issue._id}`)
                                                        }
                                                        className="inline-flex items-center gap-1 text-olive-400 hover:text-olive-300 text-sm font-medium"
                                                    >
                                                        <Eye className="w-4 h-4" /> View
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="card p-6 bg-blue-500/10 border-blue-500/30">
                    <div className="flex gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-blue-300 font-semibold mb-2">
                                About Rejected Issues
                            </h3>
                            <p className="text-military-300 text-sm leading-relaxed">
                                This page shows all maintenance requests you've rejected as Jr Executive Engineer.
                                Review your past decisions, track rejection patterns, and maintain a complete audit trail.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default RejectedIssues;

/* reusable */
const InsightCard = ({ label, value, color }) => (
    <div className={`p-4 bg-${color}-500/10 border border-${color}-500/30 rounded-lg`}>
        <p className={`text-${color}-400 text-sm font-medium mb-1`}>{label}</p>
        <p className="text-military-100 font-semibold text-lg">{value}</p>
    </div>
);
