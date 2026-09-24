# LeaveFlow – Mini Leave Request Application

## Project Overview

LeaveFlow is a full-stack employee leave management application developed as part of a technical assessment.

The application allows employees to apply for leave and track their requests. Managers can view pending leave requests and approve or reject them.

## Features

### Employee

- Employee login
- JWT authentication
- View employee profile
- View Casual Leave balance
- View Sick Leave balance
- Apply for Casual Leave
- Apply for Sick Leave
- Select leave start and end dates
- Provide a reason for leave
- View previous leave requests
- View leave request status
- Overlapping leave validation
- Insufficient leave balance validation

### Manager

- Manager login
- View pending leave requests
- View employee information
- View leave details
- Approve leave requests
- Reject leave requests
- Refresh pending requests
- Leave balance deduction after approval

## Edge Case Handling

### 1. Overlapping Leave Requests

The application prevents an employee from submitting a leave request when the requested date range overlaps with an existing pending or approved leave request.

Example:

text
Existing Leave:
10 Oct - 12 Oct

New Request:
11 Oct - 14 Oct

Result:
Rejected
