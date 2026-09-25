# LeaveFlow – Mini Leave Request Application

A full-stack leave management application built for a technical assessment.

Employees can apply for Casual/Sick leave, track requests and balances. Managers can review, approve, or reject leave requests.

##  Project Links

- **Live App:** [https://leave-request-application.vercel.app/](https://leave-request-application.vercel.app/)
- **Backend:** [https://leave-request-application.onrender.com](https://leave-request-application.onrender.com)
- **GitHub:** https://github.com/Omkarvi12/leave-request-application

##  Tech Stack

- **Frontend:** React.js, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT
- **Deployment:** Vercel + Render + MongoDB Atlas

##  Features

### Employee

- Login with JWT authentication
- View Casual/Sick leave balance
- Apply for leave
- View leave history and status
- Overlapping leave validation
- Insufficient balance validation

### Manager

- Manager login
- View pending requests
- Approve/Reject leave
- Automatic balance deduction after approval

##  Edge Cases

### Overlapping Leave

Overlapping pending or approved leave requests are rejected.

### Insufficient Balance

A request is rejected if the employee does not have enough leave balance.

### Weekend Handling

Saturday and Sunday are treated as non-working days and are not deducted from leave balance.

Example: Friday → Monday = **2 leave days**.

##  Demo Credentials

**Employee**

text
Email: second1206@test.com
Password: Second@1206


**Manager**

text
Email: manager@test.com
Password: Manager@1206



##  AI Tools Used

**ChatGPT and Claude Code** were used for:

- Project structure and architecture
- Code assistance and debugging
- API/schema suggestions
- Testing and documentation

##AI-generated code changed

AI initially suggested calculating leave days using simple date difference, which counted weekends. This was changed to exclude Saturday and Sunday according to the application's leave policy.

##  Assumptions

- Leave balance is deducted only after approval.
- Rejected/pending requests do not deduct balance.
- Employees can apply for Casual or Sick leave.
- Overlapping leave requests are not allowed.
- Start date cannot be after end date.

##  Run Locally

### Backend

bash
cd backend
npm install
npm run dev



Create .env:

env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret



### Frontend

bash
cd frontend
npm install
npm run dev



##  Author

**Omkar Vishwakarma**
B.Tech – Information Technology
