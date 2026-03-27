import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../../components/Layout';
import { maintenanceAPI, handleAPIError } from '../../utils/api';
import { Search, Filter, Eye, AlertTriangle, ArrowUpDown } from 'lucide-react';

const AllIssues = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [issues, setIssues] = useState([]);
    const [filteredIssues, setFilteredIssues] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState(searchParams.get('status') || 'all');
    const [sortBy, setSortBy] = useState('date-desc');

    useEffect(() => { fetchIssues(); }, []);
    useEffect(() => { applyFilters(); }, [issues, searchTerm, filterStatus, sortBy]);

    const fetchIssues = async () => {
        try {
            const { data } = await maintenanceAPI.getAll();
            setIssues(data);
        } catch (err) {
            console.error('Error fetching issues:', handleAPIError(err));
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        const term = searchTerm.toLowerCase();

        let list = issues.filter(issue => {
            const matchesSearch =
                !term ||
                issue.vehicleId?.toLowerCase().includes(term) ||
                issue.description?.toLowerCase().includes(term) ||
                issue._id.toLowerCase().includes(term);

            const issueStatus = (issue.approvalByJEE || 'pending').toLowerCase();
            const matchesStatus =
                filterStatus === 'all' ||
                issueStatus === filterStatus.toLowerCase();

            return matchesSearch && matchesStatus;
        });

        list.sort((a, b) => {
            if (sortBy === 'date-asc') return new Date(a.createdAt) - new Date(b.createdAt);
            if (sortBy === 'vehicle')
                return (a.vehicleId || '').localeCompare(b.vehicleId || '');
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        setFilteredIssues(list);
    };

    const getStatusBadge = (status = 'pending') => (
        <span className={`status-${status.toLowerCase()}`}>{status}</span>
    );

    if (loading)
        return (
            <Layout>
                <div className="flex items-center justify-center h-full">
                    <div className="loading-spinner" />
                </div>
            </Layout>
        );

    const pendingCount = issues.filter(i => (i.approvalByJEE || 'pending').toLowerCase() === 'pending').length;
    const approvedCount = issues.filter(i => (i.approvalByJEE || 'pending').toLowerCase() === 'approved').length;

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-display font-bold text-military-100 mb-2">
                        All Reported Issues
                    </h1>
                    <p className="text-military-400">
                        Complete list of maintenance requests for review
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Stat title="Total Issues" value={issues.length} color="blue" />
                    <Stat title="Pending" value={pendingCount} color="amber" />
                    <Stat title="Approved" value={approvedCount} color="green" />
                </div>

                {/* Filters */}
                <div className="card p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div className="lg:col-span-2 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-military-500" />
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by vehicle ID, description..."
                                className="input-field pl-10 w-full"
                            />
                        </div>

                        <Select
                            icon={<Filter className="w-5 h-5 text-military-400" />}
                            value={filterStatus}
                            onChange={setFilterStatus}
                            options={['all', 'pending', 'approved', 'rejected']}
                            labels={['All Status', 'pending', 'approved', 'rejected']}
                        />

                        <Select
                            icon={<ArrowUpDown className="w-5 h-5 text-military-400" />}
                            value={sortBy}
                            onChange={setSortBy}
                            options={['date-desc', 'date-asc', 'vehicle']}
                            labels={['Newest First', 'Oldest First', 'By Vehicle']}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="card p-6">
                    <h2 className="text-xl font-display font-semibold text-military-100 mb-4">
                        Issues List ({filteredIssues.length})
                    </h2>

                    {filteredIssues.length === 0 ? (
                        <div className="text-center py-12">
                            <AlertTriangle className="w-16 h-16 text-military-600 mx-auto mb-4" />
                            <p className="text-military-400">
                                No issues found matching your filters
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-military-700">
                                        {['Request ID', 'Vehicle ID', 'Issue Description', 'Required Parts', 'Date Reported', 'Current Status', 'Action']
                                            .map(h => (
                                                <th key={h} className="table-header text-left py-3 px-4">{h}</th>
                                            ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredIssues.map(issue => (
                                        <tr
                                            key={issue._id}
                                            className="table-row cursor-pointer"
                                            onClick={() => navigate(`/dashboard/jr-executive/issue/${issue._id}`)}
                                        >
                                            <td className="py-4 px-4 text-military-300 font-mono text-sm">
                                                #{issue._id.slice(-6).toUpperCase()}
                                            </td>
                                            <td className="py-4 px-4 text-military-100 font-medium">
                                                {issue.vehicleId || 'N/A'}
                                            </td>
                                            <td className="py-4 px-4 text-military-300">
                                                <div className="max-w-xs truncate">
                                                    {issue.description}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <Parts parts={issue.requiredParts} />
                                            </td>
                                            <td className="py-4 px-4 text-military-400 text-sm">
                                                {new Date(issue.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="py-4 px-4">
                                                {getStatusBadge(issue.approvalByJEE || 'pending')}
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/dashboard/jr-executive/issue/${issue._id}`);
                                                    }}
                                                    className="inline-flex items-center gap-1 text-olive-400 hover:text-olive-300 font-medium text-sm"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default AllIssues;

/* small helpers */

const Stat = ({ title, value, color }) => (
    <div className={`card p-4 border-l-4 border-${color}-500`}>
        <p className="text-military-400 text-xs mb-1">{title}</p>
        <p className="text-2xl font-bold text-military-100">{value}</p>
    </div>
);

const Select = ({ icon, value, onChange, options, labels }) => (
    <div className="flex items-center gap-2">
        {icon}
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="input-field w-full"
        >
            {options.map((opt, i) => (
                <option key={opt} value={opt}>
                    {labels[i]}
                </option>
            ))}
        </select>
    </div>
);

const Parts = ({ parts = [] }) => (
    <div className="flex flex-wrap gap-1 max-w-xs">
        {parts.slice(0, 2).map((p, i) => (
            <span key={i} className="px-2 py-0.5 bg-military-800 text-military-300 text-xs rounded">
                {p}
            </span>
        ))}
        {parts.length > 2 && (
            <span className="px-2 py-0.5 bg-military-800 text-military-300 text-xs rounded">
                +{parts.length - 2}
            </span>
        )}
    </div>
);
