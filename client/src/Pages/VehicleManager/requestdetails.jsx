import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../Components/Layout';
import { maintenanceAPI, handleAPIError } from '../../utils/Api';
import {
  ArrowLeft,
  Truck,
  Package,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  FileText,
  Wrench,
  DollarSign,
  Shield,
  User,
  MessageSquare,
  Info,
} from 'lucide-react';

/* ─────────────────────────────────────────
   Main Page
───────────────────────────────────────── */
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
      const data = response?.data?.data ?? response?.data ?? response;
      setRequest(data);
    } catch (err) {
      setError(handleAPIError(err));
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <Layout>
        <div className="flex items-center justify-center h-full min-h-64">
          <div className="loading-spinner" />
        </div>
      </Layout>
    );

  if (error || !request)
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
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

  const jeeStatus = (request.approvalByJEE || 'pending').toLowerCase();
  const oicStatus = (request.approvalByOIC || 'pending').toLowerCase();
  const supplierStatus = (request.supplierStatus || 'pending').toLowerCase();

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-wrap items-start gap-4">
          <button
            onClick={() => navigate('/dashboard/vehicle-manager/requests')}
            className="p-2 hover:bg-military-800 rounded-sm border border-transparent hover:border-olive-700/30 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-military-300" />
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-display text-3xl font-bold text-military-100 tracking-wide">
                Maintenance Request
              </h1>
              <span className="font-mono text-sm text-military-500 bg-military-900 border border-military-700 px-2 py-0.5 rounded-sm">
                #{request._id?.slice(-6).toUpperCase() || 'N/A'}
              </span>
              <OverallBadge request={request} />
            </div>
            <p className="text-military-500 text-sm mt-1 font-mono">
              Vehicle: {request.vehicleId || 'N/A'} &nbsp;·&nbsp; Reported:{' '}
              {request.createdAt
                ? new Date(request.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })
                : 'N/A'}
            </p>
          </div>
        </div>

        {/* ── Approval Pipeline ── */}
        <ApprovalPipeline
          jeeStatus={jeeStatus}
          oicStatus={oicStatus}
          supplierStatus={supplierStatus}
        />

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left col */}
          <div className="lg:col-span-2 space-y-6">

            <DetailSection
              icon={<AlertCircle className="w-5 h-5 text-amber-400" />}
              title="Fault Description"
              accentColor="amber"
            >
              <p className="text-military-200 leading-relaxed">
                {request.description || 'No description provided.'}
              </p>
            </DetailSection>

            <DetailSection
              icon={<Truck className="w-5 h-5 text-blue-400" />}
              title="Current Vehicle Condition"
              accentColor="blue"
            >
              <p className="text-military-200 leading-relaxed">
                {request.currentState || 'No condition information provided.'}
              </p>
            </DetailSection>

            <DetailSection
              icon={<DollarSign className="w-5 h-5 text-olive-400" />}
              title="Estimated Bill"
              accentColor="olive"
            >
              <div className="flex justify-between items-center py-2 px-3 rounded-sm bg-olive-800/20 border border-olive-700/30">
                <span className="text-sm uppercase tracking-wider text-olive-400 font-semibold">
                  Total Estimated Cost
                </span>
                <span className="font-mono font-bold text-olive-300 text-2xl">
                  ₹{Number(request.estimatedBill || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </DetailSection>

            {/* Approval comments */}
            <ApprovalComments request={request} />

          </div>

          {/* Right col */}
          <div className="space-y-6">
            <RequiredParts parts={request.requiredParts} />
            <MetadataCard request={request} />
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default RequestDetail;

/* ─────────────────────────────────────────
   Sub-components
───────────────────────────────────────── */

const OverallBadge = ({ request }) => {
  const jee = (request?.approvalByJEE || 'pending').toLowerCase();
  const oic = (request?.approvalByOIC || 'pending').toLowerCase();

  if (jee === 'rejected' || oic === 'rejected')
    return <span className="status-rejected">Rejected</span>;
  if (jee === 'approved' && oic === 'approved')
    return <span className="status-approved">Fully Approved</span>;
  if (jee === 'approved')
    return <span className="status-pending">Awaiting OIC</span>;
  return <span className="status-pending">Awaiting Jr Exec</span>;
};

const ApprovalPipeline = ({ jeeStatus, oicStatus, supplierStatus }) => {
  const steps = [
    { label: 'Submitted', status: 'approved', sub: '' },
    { label: 'JEE Review', status: jeeStatus, sub: 'Jr. Executive Eng.' },
    { label: 'OIC Review', status: oicStatus, sub: 'Officer In Charge' },
    { label: 'Supply', status: supplierStatus === 'supplied' ? 'approved' : supplierStatus, sub: 'Supplier' },
  ];

  return (
    <div className="card p-5">
      <p className="text-xs text-military-500 uppercase tracking-widest font-mono mb-4">
        Approval Pipeline
      </p>
      <div className="flex items-center">
        {steps.map((step, i) => {
          const isApproved = step.status === 'approved';
          const isRejected = step.status === 'rejected';

          const dotColor = isApproved
            ? 'bg-olive-500 border-olive-400'
            : isRejected
            ? 'bg-red-600 border-red-500'
            : 'bg-military-800 border-military-600';

          const labelColor = isApproved
            ? 'text-olive-400'
            : isRejected
            ? 'text-red-400'
            : 'text-military-500';

          return (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full border-2 ${dotColor}`} />
                <p className={`text-xs font-semibold mt-2 uppercase tracking-wide text-center ${labelColor}`}>
                  {step.label}
                </p>
                {step.sub && (
                  <p className="text-xs text-military-600 mt-0.5 text-center hidden md:block">
                    {step.sub}
                  </p>
                )}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`flex-1 h-px mx-2 mb-5 ${
                    isApproved ? 'bg-olive-600' : 'bg-military-700'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const DetailSection = ({ icon, title, accentColor, children }) => {
  const borderColors = {
    amber: 'border-l-amber-500',
    blue: 'border-l-blue-500',
    olive: 'border-l-olive-500',
    military: 'border-l-military-600',
    green: 'border-l-green-500',
    red: 'border-l-red-500',
  };

  return (
    <div className={`card p-5 border-l-4 ${borderColors[accentColor] || 'border-l-military-600'}`}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className="font-display font-semibold text-military-200 uppercase tracking-wider text-sm">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
};

const ApprovalComments = ({ request }) => {
  const comments = [
    { label: 'JEE Comment', value: request.jeeComment, color: 'green' },
    { label: 'OIC Comment', value: request.oicComment, color: 'amber' },
    { label: 'Supplier Comment', value: request.supplierComment, color: 'blue' },
  ].filter((c) => c.value);

  if (comments.length === 0) return null;

  const borderMap = { green: 'border-green-700/30', amber: 'border-amber-700/30', blue: 'border-blue-700/30' };
  const bgMap = { green: 'bg-green-900/15', amber: 'bg-amber-900/15', blue: 'bg-blue-900/15' };
  const textMap = { green: 'text-green-400', amber: 'text-amber-400', blue: 'text-blue-400' };

  return (
    <DetailSection
      icon={<MessageSquare className="w-5 h-5 text-military-400" />}
      title="Decision Comments"
      accentColor="military"
    >
      <div className="space-y-3">
        {comments.map((c) => (
          <div
            key={c.label}
            className={`p-3 rounded-sm border ${borderMap[c.color]} ${bgMap[c.color]}`}
          >
            <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${textMap[c.color]}`}>
              {c.label}
            </p>
            <p className="text-military-300 text-sm font-mono whitespace-pre-line">{c.value}</p>
          </div>
        ))}
      </div>
    </DetailSection>
  );
};

const RequiredParts = ({ parts = [] }) => (
  <div className="card p-5">
    <div className="flex items-center gap-2 mb-4">
      <Wrench className="w-5 h-5 text-olive-400" />
      <h3 className="font-display font-semibold text-military-200 uppercase tracking-wider text-sm">
        Required Parts
      </h3>
      <span className="ml-auto text-xs font-mono text-military-500 bg-military-900 border border-military-700 px-2 py-0.5 rounded-sm">
        {parts.length}
      </span>
    </div>
    {parts.length === 0 ? (
      <p className="text-military-500 text-sm text-center py-4">No parts listed.</p>
    ) : (
      <div className="space-y-2">
        {parts.map((p, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 bg-military-900/60 border border-military-800 rounded-sm hover:border-olive-700/40 transition-colors"
          >
            <span className="w-6 h-6 bg-olive-700/40 border border-olive-700/50 rounded-sm flex items-center justify-center text-olive-400 font-mono text-xs flex-shrink-0">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="text-military-200 text-sm">{p}</span>
          </div>
        ))}
      </div>
    )}
  </div>
);

const MetadataCard = ({ request }) => {
  const rows = [
    { icon: <FileText className="w-4 h-4" />, label: 'Request ID', value: `#${request._id?.slice(-6).toUpperCase() || 'N/A'}`, mono: true },
    { icon: <Truck className="w-4 h-4" />, label: 'Vehicle ID', value: request.vehicleId || 'N/A', mono: true },
    { icon: <User className="w-4 h-4" />, label: 'Reported By', value: request.reportedBy?.name || request.createdBy || 'N/A' },
    {
      icon: <Calendar className="w-4 h-4" />, label: 'Date Reported',
      value: request.createdAt
        ? new Date(request.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
        : 'N/A',
    },
    {
      icon: <Clock className="w-4 h-4" />, label: 'Last Updated',
      value: request.updatedAt
        ? new Date(request.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
        : 'N/A',
    },
    { icon: <Package className="w-4 h-4" />, label: 'Supply Status', value: request.supplierStatus || 'Pending', badge: true },
  ];

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Info className="w-5 h-5 text-military-400" />
        <h3 className="font-display font-semibold text-military-200 uppercase tracking-wider text-sm">
          Request Info
        </h3>
      </div>
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-start gap-2">
            <span className="text-military-600 mt-0.5 flex-shrink-0">{row.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-military-500 uppercase tracking-wider">{row.label}</p>
              {row.badge ? (
                <div className="mt-1">
                  <SupplierBadge status={row.value} />
                </div>
              ) : (
                <p className={`text-sm text-military-200 mt-0.5 truncate ${row.mono ? 'font-mono' : ''}`}>
                  {row.value}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* Badge helpers */
const StatusBadge = ({ status }) => {
  const normalized = (status || 'pending').toLowerCase();
  if (normalized === 'approved') return <span className="status-approved">Approved</span>;
  if (normalized === 'rejected') return <span className="status-rejected">Rejected</span>;
  return <span className="status-pending">Pending</span>;
};

const SupplierBadge = ({ status }) => {
  const normalized = (status || 'pending').toLowerCase();
  if (normalized === 'supplied') return <span className="status-approved">Supplied</span>;
  if (normalized === 'not available') return <span className="status-rejected">Not Available</span>;
  return <span className="status-pending">Pending</span>;
};