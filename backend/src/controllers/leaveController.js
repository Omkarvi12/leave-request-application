const Leave = require("../models/Leave");
const User = require("../models/User");

// Apply Leave
const applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    // Validate required fields
    if (!leaveType || !startDate || !endDate || !reason?.trim()) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Validate leave type
    if (!["casual", "sick"].includes(leaveType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid leave type",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validate dates
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date",
      });
    }

    // Start date cannot be after end date
    if (start > end) {
      return res.status(400).json({
        success: false,
        message: "Start date cannot be after end date",
      });
    }

    // Calculate total leave days
    const totalDays =
      Math.ceil(
        (end - start) / (1000 * 60 * 60 * 24)
      ) + 1;

    // Find employee
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check overlapping leave requests
    const overlappingLeave = await Leave.findOne({
      employee: user._id,
      status: {
        $in: ["pending", "approved"],
      },
      startDate: {
        $lte: end,
      },
      endDate: {
        $gte: start,
      },
    });

    if (overlappingLeave) {
      return res.status(400).json({
        success: false,
        message:
          "You already have a pending or approved leave request for these dates",
      });
    }

    // Get leave balance
    const balance =
      leaveType === "casual"
        ? user.casualLeaveBalance
        : user.sickLeaveBalance;

    // Check insufficient balance
    if (totalDays > balance) {
      return res.status(400).json({
        success: false,
        message: `Insufficient ${leaveType} leave balance. Available: ${balance} day(s), Requested: ${totalDays} day(s)`,
      });
    }

    // Create leave request
    const leave = await Leave.create({
      employee: user._id,
      leaveType,
      startDate: start,
      endDate: end,
      reason: reason.trim(),
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Leave applied successfully",
      data: leave,
    });
  } catch (error) {
    console.error("Apply leave error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to apply leave",
      error: error.message,
    });
  }
};

// Get My Leaves
const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({
      employee: req.user.userId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: leaves,
    });
  } catch (error) {
    console.error("Get my leaves error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch leaves",
      error: error.message,
    });
  }
};

// Get Pending Leaves
const getPendingLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({
      status: "pending",
    })
      .populate("employee", "name email role")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      data: leaves,
    });
  } catch (error) {
    console.error("Get pending leaves error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch pending leaves",
      error: error.message,
    });
  }
};

// Get All Leaves
const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate("employee", "name email role")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      data: leaves,
    });
  } catch (error) {
    console.error("Get all leaves error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch all leaves",
      error: error.message,
    });
  }
};

// Approve Leave
const approveLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found",
      });
    }

    // Already processed
    if (leave.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Leave request already processed",
      });
    }

    // Find employee
    const user = await User.findById(leave.employee);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Calculate leave days
    const totalDays =
      Math.ceil(
        (leave.endDate - leave.startDate) /
          (1000 * 60 * 60 * 24)
      ) + 1;

    // Deduct casual leave
    if (leave.leaveType === "casual") {
      if (user.casualLeaveBalance < totalDays) {
        return res.status(400).json({
          success: false,
          message: `Insufficient casual leave balance. Available: ${user.casualLeaveBalance} day(s), Required: ${totalDays} day(s)`,
        });
      }

      user.casualLeaveBalance -= totalDays;
    }

    // Deduct sick leave
    else {
      if (user.sickLeaveBalance < totalDays) {
        return res.status(400).json({
          success: false,
          message: `Insufficient sick leave balance. Available: ${user.sickLeaveBalance} day(s), Required: ${totalDays} day(s)`,
        });
      }

      user.sickLeaveBalance -= totalDays;
    }

    // Update status
    leave.status = "approved";

    // Save changes
    await user.save();
    await leave.save();

    res.status(200).json({
      success: true,
      message: "Leave approved successfully",
      data: leave,
    });
  } catch (error) {
    console.error("Approve leave error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to approve leave",
      error: error.message,
    });
  }
};

// Reject Leave
const rejectLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found",
      });
    }

    // Already processed
    if (leave.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Leave request already processed",
      });
    }

    // Update status
    leave.status = "rejected";

    await leave.save();

    res.status(200).json({
      success: true,
      message: "Leave rejected successfully",
      data: leave,
    });
  } catch (error) {
    console.error("Reject leave error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to reject leave",
      error: error.message,
    });
  }
};

// Get Leave By ID
const getLeaveById = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id).populate(
      "employee",
      "name email role"
    );

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found",
      });
    }

    // Manager can access any leave
    // Employee can access only own leave
    if (
      req.user.role !== "manager" &&
      leave.employee._id.toString() !== req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You can only access your own leave requests",
      });
    }

    res.status(200).json({
      success: true,
      data: leave,
    });
  } catch (error) {
    console.error("Get leave by ID error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch leave request",
      error: error.message,
    });
  }
};

module.exports = {
  applyLeave,
  getMyLeaves,
  getPendingLeaves,
  getAllLeaves,
  approveLeave,
  rejectLeave,
  getLeaveById,
};