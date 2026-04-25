# Alumni Sangham - IIT Patna Alumni Network

Alumni Sangham is a premium, full-stack ecosystem designed to bridge the gap between students and alumni at **IIT Patna**. It provides a structured space for networking, mentorship, referrals, and community growth.

![IITP Banner](images/about2.png)

## Key Features

- **Smart Directory:** Deep-filter alumni by batch, department, location, industry, and company.
- **Referral Engine:** A structured workflow for students to request referrals and alumni to manage incoming asks with ease.
- **Pro Profiles:** Rich profiles including dynamic external links, resume management, and role-specific highlights.
- **Community Content:** Dedicated spaces for blogs, job postings, and discussions to keep the network vibrant.
- **Hall of Fame:** Recognizing outstanding achievements within the IIT Patna community.
- **Secure Onboarding:** OTP-based verification for both students and alumni to ensure a verified network.

---

## Tech Stack

### Frontend
- **Framework:** React 19 + Vite 8
- **Styling:** Tailwind CSS (Custom Design System)
- **Animations:** Framer Motion, GSAP, OGL
- **Icons:** Lucide React, Font Awesome

### Backend
- **Runtime:** Node.js + Express 5
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (Access + Refresh Token flow)
- **Communication:** Nodemailer (SMTP OTP Service)
- **Storage:** Multer & Cloudinary (Integrated)

---

## Getting Started

### Prerequisites
- Node.js 20+
- MongoDB (Local or Atlas)

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/prateekg7/Alumni-Sangham.git
cd Alumni-Sangham

# Install Backend dependencies
cd backend && npm install

# Install Frontend dependencies
cd ../frontend && npm install
```

### 2. Environment Setup
Create a `.env` file in the `backend/` directory:
```env
PORT=8000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

# SMTP Config (Optional for local testing)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### 3. Run Locally
```bash
# Terminal 1 (Backend)
cd backend && npm run dev

# Terminal 2 (Frontend)
cd frontend && npm run dev
```

---

## Contributing

We welcome contributions from the community! To maintain code quality, please follow these steps:

1.  **Fork** the repository.
2.  **Create a Branch:** `git checkout -b feature/amazing-feature`.
3.  **Commit Changes:** `git commit -m 'Add some amazing feature'`.
4.  **Push:** `git push origin feature/amazing-feature`.
5.  **Open a Pull Request:** Describe your changes in detail and include screenshots if it's a UI update.

### Guidelines:
- Keep pull requests small and focused.
- Ensure your code follows the existing style patterns.
- Run the smoke test (`npm run smoke` in backend) before submitting.

---

## The Team

Meet the minds behind Alumni Sangham:

- **Prateek Gupta**
- **Nakshtra Goyal**
- **Ansh Goyal**
- **Vaibhavi Parmar**
- **Vaishnavy**

---

## License
This project is for internal use and community growth at IIT Patna. Contact the maintainers for licensing inquiries.

---
*Built for the IIT Patna Community.*
