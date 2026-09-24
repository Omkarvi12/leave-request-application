import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/EmployeeDashboard.css";

function EmployeeDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [leaves, setLeaves] = useState([]);

  const [leaveType, setLeaveType] = useState("casual");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    await Promise.all([fetchProfile(), fetchLeaves()]);
  };

  // Get employee profile
  const fetchProfile = async () => {
    try {
      const response = await api.get("/auth/me");

      const employee = response.data.data;

      setUser(employee);
      localStorage.setItem("user", JSON.stringify(employee));
    } catch (error) {
      console.error("Profile error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load employee profile"
      );
    }
  };

  // Get employee leaves
  const fetchLeaves = async () => {
    try {
      const response = await api.get("/leaves/my");

      setLeaves(response.data.data || []);
    } catch (error) {
      console.error("Leaves error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load leave requests"
      );
    } finally {
      setLoading(false);
    }
  };

  // Apply leave
  const handleApplyLeave = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!startDate || !endDate || !reason.trim()) {
      setError("Please fill all fields");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError("Start date cannot be after end date");
      return;
    }

    try {
      setApplying(true);

      const response = await api.post("/leaves", {
        leaveType,
        startDate,
        endDate,
        reason: reason.trim(),
      });

      setMessage(
        response.data.message || "Leave applied successfully"
      );

      // Reset form
      setLeaveType("casual");
      setStartDate("");
      setEndDate("");
      setReason("");

      // Refresh dashboard data
      await fetchLeaves();
      await fetchProfile();
    } catch (error) {
      console.error("Apply leave error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to apply leave"
      );
    } finally {
      setApplying(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  // Status class
  const getStatusClass = (status) => {
    return `status ${status}`;
  };

  return (
    <div className="employee-dashboard">
      <div className="dashboard-container">

        {/* Header */}
        <header className="dashboard-header">
          <div>
            <h1>Employee Dashboard</h1>

            {user && (
              <p>
                Welcome, <strong>{user.name}</strong>
              </p>
            )}
          </div>

          <button
            className="logout-btn"
            onClick={logout}
          >
            Logout
          </button>
        </header>

        {/* Messages */}
        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Profile */}
        {user && (
          <div className="card profile-card">
            <h2>My Profile</h2>

            <div className="profile-grid">

              <div className="profile-item">
                <span>Name</span>
                <strong>{user.name}</strong>
              </div>

              <div className="profile-item">
                <span>Email</span>
                <strong>{user.email}</strong>
              </div>

              <div className="profile-item">
                <span>Role</span>
                <strong>{user.role}</strong>
              </div>

            </div>
          </div>
        )}

        {/* Leave Balance */}
        {user && (
          <div className="balance-grid">

            <div className="balance-card casual">
              <h3>Casual Leave</h3>

              <div className="balance-number">
                {user.casualLeaveBalance}
              </div>

              <p>Days Available</p>
            </div>

            <div className="balance-card sick">
              <h3>Sick Leave</h3>

              <div className="balance-number">
                {user.sickLeaveBalance}
              </div>

              <p>Days Available</p>
            </div>

          </div>
        )}

        {/* Apply Leave */}
        <div className="card">
          <div className="section-header">
            <h2>Apply for Leave</h2>
            <p>Submit a new leave request</p>
          </div>

          <form
            className="leave-form"
            onSubmit={handleApplyLeave}
          >

            {/* Leave Type */}
            <div className="form-group">
              <label>Leave Type</label>

              <select
                value={leaveType}
                onChange={(e) =>
                  setLeaveType(e.target.value)
                }
              >
                <option value="casual">
                  Casual Leave
                </option>

                <option value="sick">
                  Sick Leave
                </option>
              </select>
            </div>

            {/* Dates */}
            <div className="form-row">

              <div className="form-group">
                <label>Start Date</label>

                <input
                  type="date"
                  value={startDate}
                  onChange={(e) =>
                    setStartDate(e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label>End Date</label>

                <input
                  type="date"
                  value={endDate}
                  onChange={(e) =>
                    setEndDate(e.target.value)
                  }
                />
              </div>

            </div>

            {/* Reason */}
            <div className="form-group">
              <label>Reason</label>

              <textarea
                rows="4"
                placeholder="Enter reason for leave"
                value={reason}
                onChange={(e) =>
                  setReason(e.target.value)
                }
              />
            </div>

            {/* Submit */}
            <button
              className="apply-btn"
              type="submit"
              disabled={applying}
            >
              {applying
                ? "Applying..."
                : "Apply Leave"}
            </button>

          </form>
        </div>

        {/* My Leave Requests */}
        <div className="card">
          <div className="section-header">
            <h2>My Leave Requests</h2>
            <p>Track your previous and current requests</p>
          </div>

          {loading ? (
            <p className="empty-message">
              Loading leave requests...
            </p>
          ) : leaves.length === 0 ? (
            <p className="empty-message">
              No leave requests found.
            </p>
          ) : (
            <div className="leave-list">

              {leaves.map((leave) => (
                <div
                  className="leave-item"
                  key={leave._id}
                >

                  <div className="leave-info">

                    <h3>
                      {leave.leaveType === "casual"
                        ? "Casual Leave"
                        : "Sick Leave"}
                    </h3>

                    <p>
                      <strong>Start:</strong>{" "}
                      {new Date(
                        leave.startDate
                      ).toLocaleDateString()}
                    </p>

                    <p>
                      <strong>End:</strong>{" "}
                      {new Date(
                        leave.endDate
                      ).toLocaleDateString()}
                    </p>

                    <p>
                      <strong>Reason:</strong>{" "}
                      {leave.reason}
                    </p>

                  </div>

                  <div className="leave-status">
                    <span
                      className={getStatusClass(
                        leave.status
                      )}
                    >
                      {leave.status.toUpperCase()}
                    </span>
                  </div>

                </div>
              ))}

            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default EmployeeDashboard;