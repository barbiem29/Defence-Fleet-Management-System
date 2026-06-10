import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { maintenanceAPI, handleAPIError } from '../../utils/Api';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Calendar,
  User,
  Wrench,
  DollarSign,
  Clock,
  AlertTriangle,
  Info,
  FileText,
  Truck,
  Shield,
  MessageSquare,
  ChevronRight,
  X,
  Loader2,
} from "lucide-react";

/* ─────────────────────────────────────────
   Main Page
───────────────────────────────────────── */
const IssueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [showApprovalPanel, setShowApprovalPanel] = useState(false);
  const [actionType, setActionType] = useState("");
  const [inspectionNotes, setInspectionNotes] = useState("");
  const [safetyRemarks, setSafetyRemarks] = useState("");

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const { data } = await maintenanceAPI.getById(id);
        setIssue(data);
      } catch (err) {
        console.error(handleAPIError(err));
        alert("Failed to load issue details");
        navigate("/dashboard/jr-executive/all-issues");
      } finally {
        setLoading(false);
      }
    };
    fetchIssue();
  }, [id, navigate]);

  const openPanel = (type) => {
    setActionType(type);
    setInspectionNotes("");
    setSafetyRemarks("");
    setShowApprovalPanel(true);
  };

  const handleAction = async () => {
    if (!inspectionNotes.trim()) return alert("Please provide inspection notes");
    setActionLoading(true);

    const comment = [
      `Inspection Notes: ${inspectionNotes}`,
      safetyRemarks && `Safety Remarks: ${safetyRemarks}`,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      if (actionType === "approve")
        await maintenanceAPI.approveByJrExec(id, comment);
      else if (actionType === "reject")
        await maintenanceAPI.rejectByJrExec(id, comment);
      else
        return alert("Request for more information functionality to be implemented");

      navigate("/dashboard/jr-executive/pending-approvals");
    } catch (err) {
      alert(handleAPIError(err));
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const formatTime = (d) => new Date(d).toLocaleTimeString("en-IN");

  if (loading)
    return (
      <Layout>
        <CenterLoader />
      </Layout>
    );

  if (!issue)
    return (
      <Layout>
        <div className="text-center py-12 text-military-400">Issue not found</div>
      </Layout>
    );

  const jeStatus = (issue?.approvalByJEE || "pending").toLowerCase();
  const oicStatus = (issue?.approvalByOIC || "pending").toLowerCase();
  const jeeComment = issue?.jeeComment || "";
  const oicComment = issue?.oicComment || "";

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-wrap items-start gap-4">
          <button
            onClick={() => navigate("/dashboard/jr-executive/all-issues")}
            className="p-2 hover:bg-military-800 rounded-sm border border-transparent hover:border-olive-700/30 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-military-300" />
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-display text-3xl font-bold text-military-100 tracking-wide">
                Issue Details
              </h1>
              <span className="font-mono text-sm text-military-500 bg-military-900 border border-military-700 px-2 py-0.5 rounded-sm">
                #{issue._id.slice(-6).toUpperCase()}
              </span>
            </div>
            <p className="text-military-500 text-sm mt-1 font-mono">
              Vehicle: {issue.vehicleId || "N/A"} &nbsp;·&nbsp; Reported:{" "}
              {issue.createdAt ? formatDate(issue.createdAt) : "N/A"}
            </p>
          </div>

          {jeStatus === "pending" && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => openPanel("approve")}
                className="btn-success flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Approve
              </button>
              <button
                onClick={() => openPanel("reject")}
                className="btn-danger flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </button>
              <button
                onClick={() => openPanel("more-info")}
                className="btn-secondary flex items-center gap-2"
              >
                <Info className="w-4 h-4" />
                More Info
              </button>
            </div>
          )}
        </div>

        {/* ── Approval Status Banner ── */}
        {jeStatus !== "pending" && (
          <StatusBanner status={jeStatus} comment={jeeComment} role="JEE" />
        )}
        {oicStatus !== "pending" && (
          <StatusBanner status={oicStatus} comment={oicComment} role="OIC" />
        )}

        {/* ── Approval Pipeline ── */}
        <ApprovalPipeline jeStatus={jeStatus} oicStatus={oicStatus} />

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: description + state */}
          <div className="lg:col-span-2 space-y-6">
            <DetailSection
              icon={<AlertTriangle className="w-5 h-5 text-amber-400" />}
              title="Fault Description"
              accentColor="amber"
            >
              <p className="text-military-200 leading-relaxed">{issue.description || "No description provided."}</p>
            </DetailSection>

            <DetailSection
              icon={<Truck className="w-5 h-5 text-blue-400" />}
              title="Current Vehicle State"
              accentColor="blue"
            >
              <p className="text-military-200 leading-relaxed">{issue.currentState || "No state information provided."}</p>
            </DetailSection>

            {/* Estimated Cost */}
            {issue.estimatedBill != null && (
              <DetailSection
                icon={<DollarSign className="w-5 h-5 text-olive-400" />}
                title="Cost Estimate"
                accentColor="olive"
              >
                <CostBreakdown issue={issue} />
              </DetailSection>
            )}

            {/* JEE Comment if exists */}
            {jeeComment && (
              <DetailSection
                icon={<MessageSquare className="w-5 h-5 text-military-400" />}
                title="JEE Inspection Notes"
                accentColor="military"
              >
                <p className="text-military-300 leading-relaxed font-mono text-sm whitespace-pre-line">{jeeComment}</p>
              </DetailSection>
            )}
          </div>

          {/* Right: parts + metadata */}
          <div className="space-y-6">
            <RequiredParts parts={issue.requiredParts} />
            <MetadataCard issue={issue} formatDate={formatDate} formatTime={formatTime} />
          </div>
        </div>
      </div>

      {/* ── Modal ── */}
      {showApprovalPanel && (
        <ApprovalModal
          actionType={actionType}
          inspectionNotes={inspectionNotes}
          setInspectionNotes={setInspectionNotes}
          safetyRemarks={safetyRemarks}
          setSafetyRemarks={setSafetyRemarks}
          actionLoading={actionLoading}
          onConfirm={handleAction}
          onClose={() => setShowApprovalPanel(false)}
        />
      )}
    </Layout>
  );
};

export default IssueDetails;

/* ─────────────────────────────────────────
   Sub-components
───────────────────────────────────────── */

const CenterLoader = () => (
  <div className="flex items-center justify-center h-full min-h-64">
    <div className="loading-spinner" />
  </div>
);

/* Status banner shown when already actioned */
const StatusBanner = ({ status, comment, role }) => {
  const isApproved = status === "approved";
  const isRejected = status === "rejected";

  const styles = isApproved
    ? "bg-green-900/20 border-green-700/40 text-green-300"
    : isRejected
      ? "bg-red-900/20 border-red-700/40 text-red-300"
      : "bg-amber-900/20 border-amber-700/40 text-amber-300";

  const Icon = isApproved ? CheckCircle2 : isRejected ? XCircle : Clock;

  return (
    <div className={`border rounded-sm p-4 flex items-start gap-3 ${styles}`}>
      <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
      <div>
        <p className="font-semibold text-sm uppercase tracking-wider">
          {role} Decision: {status.toUpperCase()}
        </p>
        {comment && (
          <p className="text-sm mt-1 opacity-80 font-mono whitespace-pre-line">{comment}</p>
        )}
      </div>
    </div>
  );
};

/* Approval pipeline stepper */
const ApprovalPipeline = ({ jeStatus, oicStatus }) => {
  const steps = [
    { label: "Submitted", status: "approved", role: "" },
    { label: "JEE Review", status: jeStatus, role: "Jr. Executive Engineer" },
    { label: "OIC Review", status: oicStatus, role: "Officer In Charge" },
    { label: "Supply", status: "pending", role: "Supplier" },
  ];

  return (
    <div className="card p-5">
      <p className="text-xs text-military-500 uppercase tracking-widest font-mono mb-4">Approval Pipeline</p>
      <div className="flex items-center gap-0">
        {steps.map((step, i) => {
          const isApproved = step.status === "approved";
          const isRejected = step.status === "rejected";
          const isPending = step.status === "pending";

          const dotColor = isApproved
            ? "bg-olive-500 border-olive-400"
            : isRejected
              ? "bg-red-600 border-red-500"
              : "bg-military-800 border-military-600";

          const labelColor = isApproved
            ? "text-olive-400"
            : isRejected
              ? "text-red-400"
              : "text-military-500";

          return (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full border-2 ${dotColor}`} />
                <p className={`text-xs font-semibold mt-2 uppercase tracking-wide text-center ${labelColor}`}>
                  {step.label}
                </p>
                {step.role && (
                  <p className="text-xs text-military-600 mt-0.5 text-center hidden md:block">{step.role}</p>
                )}
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-px mx-2 mb-5 ${isApproved ? "bg-olive-600" : "bg-military-700"}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* Generic detail section card */
const DetailSection = ({ icon, title, accentColor, children }) => {
  const borderColors = {
    amber: "border-l-amber-500",
    blue: "border-l-blue-500",
    olive: "border-l-olive-500",
    military: "border-l-military-600",
    green: "border-l-green-500",
    red: "border-l-red-500",
  };

  return (
    <div className={`card p-5 border-l-4 ${borderColors[accentColor] || "border-l-military-600"}`}>
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

/* Cost breakdown */
const CostBreakdown = ({ issue }) => {
  if (issue.estimatedBill == null)
    return <p className="text-military-500 text-sm">No cost data available.</p>;

  return (
    <div className="flex justify-between items-center py-2 px-3 rounded-sm bg-olive-800/20 border border-olive-700/30">
      <span className="text-sm uppercase tracking-wider text-olive-400 font-semibold">
        Estimated Bill
      </span>
      <span className="font-mono font-semibold text-olive-300 text-lg">
        ₹{Number(issue.estimatedBill).toLocaleString("en-IN")}
      </span>
    </div>
  );
};

/* Required parts list */
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
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-military-200 text-sm">{p}</span>
          </div>
        ))}
      </div>
    )}
  </div>
);

/* Metadata card */
const MetadataCard = ({ issue, formatDate, formatTime }) => {
  const rows = [
    { icon: <FileText className="w-4 h-4" />, label: "Request ID", value: `#${issue._id.slice(-6).toUpperCase()}`, mono: true },
    { icon: <Truck className="w-4 h-4" />, label: "Vehicle ID", value: issue.vehicleId || "N/A", mono: true },
    { icon: <User className="w-4 h-4" />, label: "Raised By", value: issue.raisedBy || issue.createdBy || "N/A" },
    { icon: <Calendar className="w-4 h-4" />, label: "Date Reported", value: issue.createdAt ? formatDate(issue.createdAt) : "N/A" },
    { icon: <Clock className="w-4 h-4" />, label: "Time Reported", value: issue.createdAt ? formatTime(issue.createdAt) : "N/A" },
    { icon: <Shield className="w-4 h-4" />, label: "Priority", value: issue.priority || "Normal" },
    { icon: <Calendar className="w-4 h-4" />, label: "Last Updated", value: issue.updatedAt ? formatDate(issue.updatedAt) : "N/A" },
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
              <p className={`text-sm text-military-200 mt-0.5 truncate ${row.mono ? "font-mono" : ""}`}>
                {row.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* Approval / Rejection modal */
const ApprovalModal = ({
  actionType,
  inspectionNotes,
  setInspectionNotes,
  safetyRemarks,
  setSafetyRemarks,
  actionLoading,
  onConfirm,
  onClose,
}) => {
  const isApprove = actionType === "approve";
  const isReject = actionType === "reject";
  const isMoreInfo = actionType === "more-info";

  const config = isApprove
    ? {
      title: "Approve Issue",
      subtitle: "Confirm your inspection and approve this maintenance request.",
      confirmClass: "btn-success",
      confirmLabel: "Confirm Approval",
      icon: <CheckCircle2 className="w-6 h-6 text-green-400" />,
      accent: "border-green-700/40 bg-green-900/10",
    }
    : isReject
      ? {
        title: "Reject Issue",
        subtitle: "Provide your findings and reject this maintenance request.",
        confirmClass: "btn-danger",
        confirmLabel: "Confirm Rejection",
        icon: <XCircle className="w-6 h-6 text-red-400" />,
        accent: "border-red-700/40 bg-red-900/10",
      }
      : {
        title: "Request More Information",
        subtitle: "Specify what additional information is required.",
        confirmClass: "btn-secondary",
        confirmLabel: "Send Request",
        icon: <Info className="w-6 h-6 text-military-400" />,
        accent: "border-military-600/40 bg-military-900/20",
      };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`relative w-full max-w-lg mx-4 card border ${config.accent} shadow-2xl`}>
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-military-800">
          <div className="flex items-center gap-3">
            {config.icon}
            <div>
              <h2 className="font-display text-xl font-bold text-military-100 tracking-wide">
                {config.title}
              </h2>
              <p className="text-xs text-military-500 mt-0.5">{config.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-military-800 rounded-sm transition-colors text-military-500 hover:text-military-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div>
            <label className="label-field">
              Inspection Notes <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={4}
              value={inspectionNotes}
              onChange={(e) => setInspectionNotes(e.target.value)}
              placeholder="Describe your inspection findings, observations, and rationale..."
              className="input-field resize-none"
            />
          </div>

          <div>
            <label className="label-field">Safety Remarks</label>
            <textarea
              rows={3}
              value={safetyRemarks}
              onChange={(e) => setSafetyRemarks(e.target.value)}
              placeholder="Any safety concerns or compliance notes (optional)..."
              className="input-field resize-none"
            />
          </div>

          {isReject && (
            <div className="flex items-start gap-2 p-3 bg-red-900/20 border border-red-700/30 rounded-sm">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-300">
                Rejecting this request will notify the requesting officer. Ensure your inspection notes clearly explain the reason for rejection.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-military-800 bg-military-950/40">
          <button
            onClick={onClose}
            disabled={actionLoading}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={actionLoading || !inspectionNotes.trim()}
            className={`${config.confirmClass} flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {actionLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              config.confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
};