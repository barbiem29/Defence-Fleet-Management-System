import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { maintenanceAPI, handleAPIError } from "../../utils/api";
import {
  ArrowLeft, CheckCircle2, XCircle, Calendar, User,
  Wrench, DollarSign, Clock, AlertTriangle, Info
} from "lucide-react";

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

  const openPanel = type => {
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
    ].filter(Boolean).join("\n");

    try {
      if (actionType === "approve")
        await maintenanceAPI.approveByJrExec(id, comment);
      else if (actionType === "reject")
        await maintenanceAPI.rejectByJrExec(id, comment);
      else return alert("Request for more information functionality to be implemented");

      navigate("/dashboard/jr-executive/pending-approvals");
    } catch (err) {
      alert(handleAPIError(err));
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = d =>
    new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  const formatTime = d => new Date(d).toLocaleTimeString("en-IN");

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
  const comment = issue?.jeeComment || "";

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center gap-4">
          <BackBtn onClick={() => navigate("/dashboard/jr-executive/all-issues")} />

          <div className="flex-1">
            <h1 className="text-3xl font-display font-bold text-military-100">
              Issue Details
            </h1>
            <p className="text-military-400 mt-1">
              Request ID:
              <span className="font-mono">#{issue._id.slice(-6).toUpperCase()}</span>
            </p>
          </div>

          {jeStatus === "pending" && (
            <div className="flex gap-3">
              <ActionBtn onClick={() => openPanel("approve")} icon={<CheckCircle2 />} className="btn-success" label="Approve Issue" />
              <ActionBtn onClick={() => openPanel("reject")} icon={<XCircle />} className="btn-danger" label="Reject Issue" />
              <ActionBtn onClick={() => openPanel("more-info")} icon={<Info />} className="btn-secondary" label="Need More Info" />
            </div>
          )}
        </div>

        {jeStatus !== "pending" && <StatusBanner status={jeStatus} comment={comment} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Section icon={<AlertTriangle />} title="Fault Description" text={issue.description} />
            <Section icon={<Info />} title="Current Vehicle State" text={issue.currentState} />
          </div>

          <RequiredParts parts={issue.requiredParts} />
        </div>

        <Metadata
          issue={issue}
          formatDate={formatDate}
          formatTime={formatTime}
          jeStatus={jeStatus}
        />
      </div>

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

/* ---------- Reusable Components ---------- */

const CenterLoader = () => (
  <div className="flex items-center justify-center h-full">
    <div className="loading-spinner" />
  </div>
);

const BackBtn = ({ onClick }) => (
  <button onClick={onClick} className="p-2 hover:bg-military-800 rounded-lg">
    <ArrowLeft className="w-6 h-6 text-military-300" />
  </button>
);

const ActionBtn = ({ onClick, icon, label, className }) => (
  <button onClick={onClick} className={`${className} flex items-center gap-2`}>
    {icon}
    {label}
  </button>
);

const Section = ({ icon, title, text }) => (
  <div>
    <h3 className="text-sm font-semibold mb-2 flex gap-2">{icon} {title}</h3>
    <p className="bg-military-900/50 p-4 rounded-lg">{text}</p>
  </div>
);

const RequiredParts = ({ parts = [] }) => (
  <div className="card p-6">
    <h3 className="text-lg font-semibold mb-4 flex gap-2">
      <Wrench className="w-5 h-5 text-olive-400" /> Required Parts
    </h3>
    <div className="grid md:grid-cols-2 gap-3">
      {parts.map((p, i) => (
        <div key={i} className="flex gap-3 p-3 bg-military-900/50 rounded-lg border border-military-700">
          <div className="w-8 h-8 bg-olive-600 rounded-lg flex items-center justify-center text-white text-sm font-semibold">
            {i + 1}
          </div>
          <span>{p}</span>
        </div>
      ))}
    </div>
  </div>
);
