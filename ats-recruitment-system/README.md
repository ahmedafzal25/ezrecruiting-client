# ATS Recruitment System (EzRecruiting)

An advanced Applicant Tracking System built on the MERN stack with dynamic status triggers, candidate dashboards, real-time analytics, and secure recruitment workflows.

**Live Demo:** `<will-be-filled-after-deploy>`

---

## 🏗️ Architecture

```text
[ React Frontend (Vite) ] <---> [ REST API (Express) ] <---> [ MongoDB ]
        |                              |
[ Client Browser ]            [ Cloudinary (Images/Resumes) ]
                              [ Gmail SMTP (Automated Email) ]
```

## 🛠️ Technology Stack

- **Frontend:** React, Vite, React Router, Recharts, React-Hot-Toast
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT (JSON Web Tokens), bcryptjs
- **File Storage:** Cloudinary, Multer
- **Email:** Nodemailer (Gmail SMTP)
- **Styling:** Custom CSS with CSS Variables for Dark Mode

---

## 🚀 Local Setup Steps

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd ats-recruitment-system
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory mapping to `.env.example`:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   SETUP_KEY=your_secret_admin_bootstrap_key

   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   GMAIL_USER=your_gmail_address
   GMAIL_PASS=your_gmail_app_password
   ```

4. **Run the Database Seeder (Optional):**
   ```bash
   npm run seed
   ```

5. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   *(This launches both the Vite frontend and Express backend concurrently).*

---

## 👨‍💻 Team Members

- **Ahmed Afzal** - [GitHub Profile](https://github.com/ahmedafzal25)
- **[Team Member 2]** - [GitHub Profile](#)
