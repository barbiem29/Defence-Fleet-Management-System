import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Shield, Mail, Lock, AlertCircle } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(email, password);

      switch (user.role) {
        case "manager":
          navigate("/dashboard/vehicle-manager");
          break;
        case "jee":
          navigate("/dashboard/jr-executive");
          break;
        case "oic":
          navigate("/dashboard/oic");
          break;
        case "supplier":
          navigate("/dashboard/supplier");
          break;
        default:
          navigate("/login");
      }
    } catch (err) {
      setError(typeof err === "string" ? err : "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-military-950 via-military-900 to-olive-950 p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(121, 132, 99, 0.1) 35px, rgba(121, 132, 99, 0.1) 70px)",
          }}
        />
      </div>

      <div className="relative w-full max-w-md">
        <div className="absolute -inset-1 bg-gradient-to-r from-olive-600 to-olive-800 rounded-2xl blur opacity-20"></div>

        <div className="relative card p-8 animate-fade-in">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-olive-600 rounded-2xl mb-4 shadow-lg glow">
              <Shield className="w-12 h-12 text-white" />
            </div>
            <h1 className="font-display text-4xl font-bold text-olive-400 mb-2">
              DFMS
            </h1>
            <p className="text-military-400 text-sm font-medium">
              Defence Fleet Management System
            </p>
            <div className="mt-4 h-1 w-20 bg-olive-600 mx-auto rounded-full"></div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3 animate-slide-in">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label-field">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="your.email@defence.mil"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="label-field">
                <Lock className="w-4 h-4 inline mr-2" />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-8 p-4 bg-military-800/50 border border-military-700/50 rounded-lg">
            <p className="text-xs text-military-400 text-center font-mono">
              Secure military-grade authentication
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;