import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/ManagerDashboard.css";

function ManagerDashboard() {
  const navigate = useNavigate();

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchPendingLeaves();
  }, []);

  // Get pending leave requests
  const fetchPendingLeaves = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/leaves/pending");

      setLeaves(response.data.data || []);
    } catch (error) {
      console.error("Pending leaves error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load pending leave requests"
      );
    } finally {
      setLoading(false);
    }
  };

  // Approve leave
  const handleApprove = async (leaveId) => {
    try {
      setProcessingId(leaveId);
      setError("");
      setMessage("");

      const response = await api.put(
        `/leaves/${leaveId}/approve`
      );

      setMessage(
        response.data.message ||
          "Leave approved successfully"
      );

      // Remove processed leave from pending list
      setLeaves((previousLeaves) =>
        previousLeaves.filter(
          (leave) => leave._id !== leaveId
        )
      );
    } catch (error) {
      console.error("Approve leave error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to approve leave"
      );
    } finally {
      setProcessingId(null);
    }
  };

  // Reject leave
  const handleReject = async (leaveId) => {
    try {
      setProcessingId(leaveId);
      setError("");
      setMessage("");

      const response = await api.put(
        `/leaves/${leaveId}/reject`
      );

      setMessage(
        response.data.message ||
          "Leave rejected successfully"
      );

      // Remove processed leave from pending list
      setLeaves((previousLeaves) =>
        previousLeaves.filter(
          (leave) => leave._id !== leaveId
        )
      );
    } catch (error) {
      console.error("Reject leave error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to reject leave"
      );
    } finally {
      setProcessingId(null);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  return (
    <div className="manager-dashboard">
      <div className="manager-container">

        {/* Header */}
        <header className="manager-header">
          <div>
            <h1>Manager Dashboard</h1>

            <p>
              Review and manage employee leave requests
            </p>
          </div>

          <button
            className="manager-logout-btn"
            onClick={logout}
          >
            Logout
          </button>
        </header>

        {/* Success Message */}
        {message && (
          <div className="manager-success">
            {message}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="manager-error">
            {error}
          </div>
        )}

        {/* Pending Requests */}
        <div className="manager-card">

          <div className="manager-section-header">
            <div>
              <h2>Pending Leave Requests</h2>

              <p>
                Review employee requests and take action.
              </p>
            </div>

            <button
              className="refresh-btn"
              onClick={fetchPendingLeaves}
              disabled={loading}
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="manager-empty">
              <p>Loading pending requests...</p>
            </div>
          ) : leaves.length === 0 ? (
            /* No Requests */
            <div className="manager-empty">
              <h3>No Pending Requests</h3>

              <p>
                There are currently no leave requests
                waiting for approval.
              </p>
            </div>
          ) : (
            /* Requests */
            <div className="pending-list">

              {leaves.map((leave) => (
                <div
                  className="pending-item"
                  key={leave._id}
                >

                  {/* Employee Information */}
                  <div className="employee-info">
                    <h3>
                      {leave.employee?.name ||
                        "Unknown Employee"}
                    </h3>

                    <p>
                      <strong>Email:</strong>{" "}
                      {leave.employee?.email ||
                        "N/A"}
                    </p>

                    <p>
                      <strong>Role:</strong>{" "}
                      {leave.employee?.role ||
                        "employee"}
                    </p>
                  </div>

                  {/* Leave Information */}
                  <div className="leave-details">

                    <div className="detail-row">
                      <span>Leave Type</span>

                      <strong>
                        {leave.leaveType === "casual"
                          ? "Casual Leave"
                          : "Sick Leave"}
                      </strong>
                    </div>

                    <div className="detail-row">
                      <span>Start Date</span>

                      <strong>
                        {new Date(
                          leave.startDate
                        ).toLocaleDateString()}
                      </strong>
                    </div>

                    <div className="detail-row">
                      <span>End Date</span>

                      <strong>
                        {new Date(
                          leave.endDate
                        ).toLocaleDateString()}
                      </strong>
                    </div>

                    <div className="detail-row reason-row">
                      <span>Reason</span>

                      <strong>
                        {leave.reason}
                      </strong>
                    </div>

                  </div>

                  {/* Status + Actions */}
                  <div className="leave-actions">

                    <span className="pending-status">
                      PENDING
                    </span>

                    <div className="action-buttons">

                      <button
                        className="approve-btn"
                        onClick={() =>
                          handleApprove(leave._id)
                        }
                        disabled={
                          processingId === leave._id
                        }
                      >
                        {processingId === leave._id
                          ? "Processing..."
                          : "Approve"}
                      </button>

                      <button
                        className="reject-btn"
                        onClick={() =>
                          handleReject(leave._id)
                        }
                        disabled={
                          processingId === leave._id
                        }
                      >
                        {processingId === leave._id
                          ? "Processing..."
                          : "Reject"}
                      </button>

                    </div>

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

export default ManagerDashboard;