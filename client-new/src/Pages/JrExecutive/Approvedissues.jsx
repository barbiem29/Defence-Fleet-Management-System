import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../Components/Layout';
import { maintenanceAPI, handleAPIError } from '../../utils/api';
import { CheckCircle2, Eye, Search, Filter } from 'lucide-react';

const ApprovedIssues = () => {
  const navigate = useNavigate();

  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOICStatus, setFilterOICStatus] = useState('all');

  useEffect(() => {
    const fetchApprovedIssues = async () => {
      try {
        const { data } = await maintenanceAPI.getAll();
        setIssues(
          data.filter(
            i => (i.approvalByJEE || '').toLowerCase() === 'approved'
          )
        );
      } catch (error) {
        console.error('Error fetching approved issues:', handleAPIError(error));
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedIssues();
  }, []);

  useEffect(() => {
    let filtered = issues;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(i =>
        (i.vehicleId || '').toLowerCase().includes(term) ||
        (i.description || '').toLowerCase().includes(term)
      );
    }

    if (filterOICStatus !== 'all') {
      filtered = filtered.filter(
        i => (i.approvalByOIC || '').toLowerCase() === filterOICStatus.toLowerCase()
      );
    }

    setFilteredIssues(filtered);
  }, [issues, searchTerm, filterOICStatus]);

  const getStatusBadge = status => {
    const normalizedStatus = (status || 'pending').toLowerCase();

    const styles = {
      pending: 'status-pending',
      approved: 'status-approved',
      rejected: 'status-rejected',
    };

    return (
      <span className={styles[normalizedStatus] || styles.pending}>
        {normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1)}
      </span>
    );
  };

  const countByStatus = status =>
    issues.filter(
      i => (i.approvalByOIC || '').toLowerCase() === status.toLowerCase()
    ).length;

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
            Approved Issues
          </h1>
          <p className="text-military-400">
            Issues you have approved - tracking OIC decisions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Stat title="Total Approved by You" value={issues.length} color="green" />
          <Stat title="Awaiting OIC" value={countByStatus('pending')} color="amber" />
          <Stat title="OIC Approved" value={countByStatus('approved')} color="blue" />
          <Stat title="OIC Rejected" value={countByStatus('rejected')} color="red" />
        </div>

        <div className="card p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-military-500" />
              <input
                type="text"
                placeholder="Search approved issues..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="input-field pl-10 w-full"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-military-400" />
              <select
                value={filterOICStatus}
                onChange={e => setFilterOICStatus(e.target.value)}
                className="input-field w-48"
              >
                <option value="all">All OIC Status</option>
                <option value="Pending">Pending OIC</option>
                <option value="Approved">OIC Approved</option>
                <option value="Rejected">OIC Rejected</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-display font-semibold text-military-100 mb-6">
            Your Approved Issues ({filteredIssues.length})
          </h2>

          {filteredIssues.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <p className="text-military-400">No approved issues found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-military-700">
                    <th className="table-header text-left py-3 px-4">Request ID</th>
                    <th className="table-header text-left py-3 px-4">Vehicle</th>
                    <th className="table-header text-left py-3 px-4">Description</th>
                    <th className="table-header text-left py-3 px-4">Your Comment</th>
                    <th className="table-header text-left py-3 px-4">OIC Status</th>
                    <th className="table-header text-left py-3 px-4">Approved Date</th>
                    <th className="table-header text-center py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIssues.map(issue => (
                    <tr key={issue._id} className="table-row">
                      <td className="py-4 px-4 text-military-300 font-mono text-sm">
                        #{issue._id?.slice(-6).toUpperCase() || 'N/A'}
                      </td>
                      <td className="py-4 px-4 text-military-100 font-medium">
                        {issue.vehicleId || 'N/A'}
                      </td>
                      <td className="py-4 px-4 text-military-300">
                        <div className="max-w-xs truncate">
                          {issue.description || 'No description'}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-military-400 text-sm truncate max-w-xs">
                        {issue.jeeComment || 'No comment'}
                      </td>
                      <td className="py-4 px-4">
                        {getStatusBadge(issue.approvalByOIC)}
                      </td>
                      <td className="py-4 px-4 text-military-400 text-sm">
                        {issue.updatedAt ? new Date(issue.updatedAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => navigate(`/dashboard/jr-executive/issue/${issue._id}`)}
                          className="inline-flex items-center gap-1 text-olive-400 hover:text-olive-300 font-medium text-sm transition-colors"
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

const Stat = ({ title, value, color }) => {
  const borderColors = {
    green: 'border-green-500',
    amber: 'border-amber-500',
    blue: 'border-blue-500',
    red: 'border-red-500',
  };

  return (
    <div className={`card p-6 border-l-4 ${borderColors[color] || 'border-green-500'}`}>
      <h3 className="text-military-400 text-sm mb-2">{title}</h3>
      <p className="text-3xl font-bold text-military-100">{value}</p>
    </div>
  );
};

export default ApprovedIssues;