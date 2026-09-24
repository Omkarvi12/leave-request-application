const express = require("express");
const {
    applyLeave,
    getMyLeaves,
    getPendingLeaves,
    getAllLeaves,
    getLeaveById,
    approveLeave,
    rejectLeave
} = require("../controllers/leaveController");
const protect = require("../middleware/authMiddleware");
const managerOnly = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", protect, applyLeave);
router.get("/my", protect, getMyLeaves);
router.get("/pending", protect, managerOnly, getPendingLeaves);
router.get("/all", protect, managerOnly, getAllLeaves);
router.get("/:id", protect, getLeaveById);
router.put("/:id/approve", protect, managerOnly, approveLeave);
router.put("/:id/reject", protect, managerOnly, rejectLeave);

module.exports = router;