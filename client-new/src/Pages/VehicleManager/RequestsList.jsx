import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../Components/Layout';
import { maintenanceAPI, handleAPIError } from '../../utils/Api';
import { Search, Filter, Eye } from 'lucide-react';

const RequestsList = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [requests, searchTerm, filterStatus]);

  const fetchRequests = async () => {
    try {
      const response = await maintenanceAPI.getMyRequests();
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', handleAPIError(error));
    } finally {
      setLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = [...requests];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(req =>
        req.vehicleId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(req => {
        const status = getOverallStatus(req);
        return status === filterStatus;
      });
    }

    setFilteredRequests(filtered);
  };

  const getOverallStatus = (request) => {
    if (request.approvalByJEE?.toLowerCase() === 'rejected' || request.approvalByOIC?.toLowerCase() === 'rejected') {
      return 'rejected';
    }
    if (request.approvalByJEE?.toLowerCase() === 'approved' && request.approvalByOIC?.toLowerCase() === 'approved') {
      return 'approved';
    }
    return 'pending';
  };

  const getStatusBadge = (request) => {
    const status = getOverallStatus(request);
    
    if (status === 'rejected') {
      return <span className="status-rejected">Rejected</span>;
    }
    if (status === 'approved') {
      return <span className="status-approved">Fully Approved</span>;
    }
    if (request.approvalByJEE?.toLowerCase() === 'approved') {
      return <span className="status-pending">Awaiting OIC</span>;
    }
    return <span className="status-pending">Awaiting Jr Exec</span>;
  };


  const getSupplierStatus = (request) => {
    const status = (request.supplierStatus || 'pending').toLowerCase();
    if (status === 'pending') {
      return <span className="status-pending">Pending</span>;
    }
    if (status === 'supplied') {
      return <span className="status-supplied">Supplied</span>;
    }
    if (status === 'not available') {
      return <span className="status-rejected">Not Available</span>;
    }
    return <span className="status-pending">Pending</span>;
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
        <div>
          <h1 className="text-3xl font-display font-bold text-military-100 mb-2">
            My Maintenance Requests
          </h1>
          <p className="text-military-400">
            View and track all your submitted requests
          </p>
        </div>

        {/* Filters */}
        <div className="card p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-military-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by vehicle or description..."
                className="input-field pl-10"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-military-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field w-48"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-display font-semibold text-military-100">
              All Requests ({filteredRequests.length})
            </h2>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-military-400">No requests found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-military-700">
                    <th className="table-header text-left py-3 px-4">Request ID</th>
                    <th className="table-header text-left py-3 px-4">Vehicle</th>
                    <th className="table-header text-left py-3 px-4">Description</th>
                    <th className="table-header text-left py-3 px-4">Amount</th>
                    <th className="table-header text-left py-3 px-4">Approval Status</th>
                    <th className="table-header text-left py-3 px-4">Supply Status</th>
                    <th className="table-header text-left py-3 px-4">Created</th>
                    <th className="table-header text-center py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((request) => (
                    <tr key={request._id} className="table-row">
                      <td className="py-4 px-4 text-military-300 font-mono text-sm">
                        #{request._id.slice(-6)}
                      </td>
                      <td className="py-4 px-4 text-military-100 font-medium">
                        {request.vehicleId || 'N/A'}
                      </td>
                      <td className="py-4 px-4 text-military-300">
                        {request.description.substring(0, 40)}...
                      </td>
                      <td className="py-4 px-4 text-military-100 font-semibold">
                        ₹{request.estimatedBill.toLocaleString()}
                      </td>
                      <td className="py-4 px-4">
                        {getStatusBadge(request)}
                      </td>
                      <td className="py-4 px-4">
                        {getSupplierStatus(request)}
                      </td>
                      <td className="py-4 px-4 text-military-400 text-sm">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => navigate(`/dashboard/vehicle-manager/requests/${request._id}`)}
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

export default RequestsList;