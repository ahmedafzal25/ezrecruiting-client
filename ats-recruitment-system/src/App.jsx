import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import JobDetails from './pages/JobDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import Profile from './pages/candidate/Profile';
import MyApplications from './pages/candidate/MyApplications';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageJobs from './pages/admin/ManageJobs';
import ManageApplicants from './pages/admin/ManageApplicants';
import ManageInterviews from './pages/admin/ManageInterviews';
import ManageBranches from './pages/admin/ManageBranches';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <Toaster position="top-right" />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/jobs/:id" element={<JobDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Candidate Routes */}
              <Route path="/candidate" element={<ProtectedRoute roles={['candidate']}><CandidateDashboard /></ProtectedRoute>} />
              <Route path="/candidate/profile" element={<ProtectedRoute roles={['candidate']}><Profile /></ProtectedRoute>} />
              <Route path="/candidate/applications" element={<ProtectedRoute roles={['candidate']}><MyApplications /></ProtectedRoute>} />

              {/* Admin/HR Routes */}
              <Route path="/admin" element={<ProtectedRoute roles={['admin', 'hr']}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/jobs" element={<ProtectedRoute roles={['admin', 'hr']}><ManageJobs /></ProtectedRoute>} />
              <Route path="/admin/applicants" element={<ProtectedRoute roles={['admin', 'hr']}><ManageApplicants /></ProtectedRoute>} />
              <Route path="/admin/interviews" element={<ProtectedRoute roles={['admin', 'hr']}><ManageInterviews /></ProtectedRoute>} />
              <Route path="/admin/branches" element={<ProtectedRoute roles={['admin', 'hr']}><ManageBranches /></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
