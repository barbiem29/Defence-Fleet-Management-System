import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Login from "./Pages/Login";

// Vehicle Manager
import VehicleManagerDashboard from "./Pages/VehicleManager/Dashboard";
import CreateRequest from "./Pages/VehicleManager/CreateRequest";
import RequestsList from "./Pages/VehicleManager/RequestsList";
import Vehicles from "./Pages/VehicleManager/Vehicles";
import AddVehicle from "./Pages/VehicleManager/addvehicle";
import RequestDetail from "./Pages/VehicleManager/requestdetails";

// Jr Executive
import JrExecutiveDashboard from "./Pages/JrExecutive/Dashboard";
import AllIssues from "./Pages/JrExecutive/Allissues";
import IssueDetails from "./Pages/JrExecutive/IssueDetails";
import PendingApprovals from "./Pages/JrExecutive/PendingApprovals";
import ApprovedIssues from "./Pages/JrExecutive/Approvedissues";
import RejectedIssues from "./Pages/JrExecutive/RejectedIssues";

// OIC
import OICDashboard from "./Pages/OIC/Dashboard";

// Supplier
import SupplierDashboard from "./Pages/Supplier/Dashboard";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-military-950">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

const RoleBasedRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-military-950">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case "manager":
      return <Navigate to="/dashboard/vehicle-manager" replace />;
    case "jee":
      return <Navigate to="/dashboard/jr-executive" replace />;
    case "oic":
      return <Navigate to="/dashboard/oic" replace />;
    case "supplier":
      return <Navigate to="/dashboard/supplier" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<RoleBasedRedirect />} />

        <Route
          path="/dashboard/vehicle-manager"
          element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <VehicleManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/vehicle-manager/create"
          element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <CreateRequest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/vehicle-manager/requests"
          element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <RequestsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/vehicle-manager/vehicles"
          element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <Vehicles />
            </ProtectedRoute>
          }
        />
        <Route path="/dashboard/vehicle-manager/vehicles/add" element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <AddVehicle />
            </ProtectedRoute>
          }/>
          <Route path="/dashboard/vehicle-manager/requests/:id" element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <RequestDetail />
            </ProtectedRoute>
          } />

        <Route
          path="/dashboard/jr-executive"
          element={
            <ProtectedRoute allowedRoles={["jee"]}>
              <JrExecutiveDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/jr-executive/all-issues"
          element={
            <ProtectedRoute allowedRoles={["jee"]}>
              <AllIssues />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/jr-executive/issue/:id"
          element={
            <ProtectedRoute allowedRoles={["jee"]}>
              <IssueDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/jr-executive/pending-approvals"
          element={
            <ProtectedRoute allowedRoles={["jee"]}>
              <PendingApprovals />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/jr-executive/approved"
          element={
            <ProtectedRoute allowedRoles={["jee"]}>
              <ApprovedIssues />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/jr-executive/rejected"
          element={
            <ProtectedRoute allowedRoles={["jee"]}>
              <RejectedIssues />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/oic"
          element={
            <ProtectedRoute allowedRoles={["oic"]}>
              <OICDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/oic/pending"
          element={
            <ProtectedRoute allowedRoles={["oic"]}>
              <OICDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/supplier"
          element={
            <ProtectedRoute allowedRoles={["supplier"]}>
              <SupplierDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/supplier/approved"
          element={
            <ProtectedRoute allowedRoles={["supplier"]}>
              <SupplierDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/unauthorized"
          element={
            <div className="min-h-screen flex items-center justify-center bg-military-950">
              <div className="card p-8 text-center max-w-md">
                <h1 className="text-2xl font-bold text-red-400 mb-4">Unauthorized Access</h1>
                <p className="text-military-400 mb-6">
                  You don&apos;t have permission to access this page.
                </p>
                <button
                  onClick={() => (window.location.href = "/")}
                  className="btn-primary"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          }
        />

        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-military-950">
              <div className="card p-8 text-center max-w-md">
                <h1 className="text-2xl font-bold text-military-100 mb-4">404 - Page Not Found</h1>
                <p className="text-military-400 mb-6">
                  The page you&apos;re looking for doesn&apos;t exist.
                </p>
                <button
                  onClick={() => (window.location.href = "/")}
                  className="btn-primary"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          }
        />
      </Routes>
  );
}

export default App;