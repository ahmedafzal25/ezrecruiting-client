import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';

const ManageApplicants = () => {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterJob, setFilterJob] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Modals
  const [messageModal, setMessageModal] = useState(false);
  const [interviewModal, setInterviewModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  // Message Form
  const [msgSubject, setMsgSubject] = useState('');
  const [msgContent, setMsgContent] = useState('');

  // Interview Form
  const [intDate, setIntDate] = useState('');
  const [intMode, setIntMode] = useState('online');
  const [intLocation, setIntLocation] = useState('');
  const [intMessage, setIntMessage] = useState('');

  const fetchJobs = async () => {
    try {
      const { data } = await api.get('/jobs?all=true');
      setJobs(data);
    } catch (e) {}
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/applications', {
        params: { jobId: filterJob, status: filterStatus }
      });
      setApplications(data);
    } catch (error) {
      toast.error('Failed to load applications');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [filterJob, filterStatus]);

  const handleStatusChange = async (appId, newStatus) => {
    const toastId = toast.loading('Updating status...');
    try {
      await api.put(`/applications/${appId}/status`, { status: newStatus });
      toast.success(`Status updated to ${newStatus}. Email sent to candidate.`, { id: toastId });
      fetchApplications();
    } catch (error) {
      toast.error('Failed to update status', { id: toastId });
    }
  };

  const openMessageModal = (app) => {
    setSelectedApp(app);
    setMsgSubject('');
    setMsgContent('');
    setMessageModal(true);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Sending message...');
    try {
      await api.post(`/applications/${selectedApp._id}/message`, { subject: msgSubject, message: msgContent });
      toast.success('Message sent successfully', { id: toastId });
      setMessageModal(false);
    } catch (error) {
      toast.error('Failed to send message', { id: toastId });
    }
  };

  const openInterviewModal = (app) => {
    setSelectedApp(app);
    setIntDate('');
    setIntMode('online');
    setIntLocation('');
    setIntMessage('');
    setInterviewModal(true);
  };

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Scheduling interview...');
    try {
      await api.post('/interviews', {
        applicationId: selectedApp._id,
        scheduledAt: intDate,
        mode: intMode,
        location: intLocation,
        message: intMessage
      });
      toast.success('Interview scheduled and candidate notified', { id: toastId });
      setInterviewModal(false);
      fetchApplications(); // status will automatically change to Interview Scheduled
    } catch (error) {
      toast.error('Failed to schedule interview', { id: toastId });
    }
  };

  const exportToCSV = () => {
    if (applications.length === 0) return toast.error('No data to export');
    
    const headers = ['Candidate Name', 'Email', 'Phone', 'Job Title', 'Branch', 'Applied Date', 'Status'];
    const rows = applications.map(app => [
      app.candidate?.name || 'N/A',
      app.candidate?.email || 'N/A',
      app.candidate?.phone || 'N/A',
      app.job?.title || 'N/A',
      app.job?.branch?.name || 'N/A',
      new Date(app.createdAt).toLocaleDateString(),
      app.status
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `applications_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ color: '#2d3748', margin: 0 }}>Manage Applicants</h1>
        <button className="btn btn-primary" onClick={exportToCSV}>⬇️ Export to CSV</button>
      </div>

      <div className="card" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label>Filter by Job</label>
          <select className="input" value={filterJob} onChange={e => setFilterJob(e.target.value)} style={{ marginBottom: 0 }}>
            <option value="">All Jobs</option>
            {jobs.map(j => <option key={j._id} value={j._id}>{j.title} ({j.branch?.name})</option>)}
          </select>
        </div>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label>Filter by Status</label>
          <select className="input" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ marginBottom: 0 }}>
            <option value="">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Interview Scheduled">Interview Scheduled</option>
            <option value="Rejected">Rejected</option>
            <option value="Selected">Selected</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center' }}>Loading applicants...</div>
      ) : (
        <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f7fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '1rem' }}>Candidate</th>
                <th style={{ padding: '1rem' }}>Job</th>
                <th style={{ padding: '1rem' }}>Applied Date</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem' }}>Documents</th>
                <th style={{ padding: '1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: '500' }}>{app.candidate?.name}</div>
                    <div style={{ fontSize: '0.85rem', color: '#718096' }}>{app.candidate?.email}</div>
                    <div style={{ fontSize: '0.85rem', color: '#718096' }}>{app.candidate?.phone}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div>{app.job?.title}</div>
                    <div style={{ fontSize: '0.85rem', color: '#718096' }}>{app.job?.branch?.name}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>{new Date(app.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem' }}>
                    <select 
                      className="input" 
                      style={{ marginBottom: 0, padding: '0.25rem 0.5rem', width: 'auto' }}
                      value={app.status}
                      onChange={(e) => handleStatusChange(app._id, e.target.value)}
                    >
                      <option value="Submitted">Submitted</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Interview Scheduled" disabled>Interview Scheduled</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Selected">Selected</option>
                    </select>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <a href={app.resumeUrl} target="_blank" rel="noreferrer" style={{ color: '#3182ce', textDecoration: 'none', fontSize: '0.9rem' }}>📄 Resume</a>
                      {app.coverLetterUrl && (
                        <a href={app.coverLetterUrl} target="_blank" rel="noreferrer" style={{ color: '#3182ce', textDecoration: 'none', fontSize: '0.9rem' }}>📝 Cover Letter</a>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <button className="btn" style={{ padding: '0.25rem 0.5rem', backgroundColor: '#edf2f7', fontSize: '0.85rem' }} onClick={() => openMessageModal(app)}>✉️ Message</button>
                      <button 
                        className="btn" 
                        style={{ padding: '0.25rem 0.5rem', backgroundColor: app.status === 'Shortlisted' ? '#faf5ff' : '#edf2f7', color: app.status === 'Shortlisted' ? '#6b46c1' : '#a0aec0', fontSize: '0.85rem', cursor: app.status === 'Shortlisted' ? 'pointer' : 'not-allowed' }} 
                        disabled={app.status !== 'Shortlisted'}
                        onClick={() => openInterviewModal(app)}
                      >
                        📅 Schedule Interview
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {applications.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: '1rem', textAlign: 'center', color: '#718096' }}>No applications found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Message Modal */}
      {messageModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
            <h2 style={{ marginTop: 0 }}>Message Candidate</h2>
            <p style={{ color: '#4a5568', marginBottom: '1rem' }}>To: {selectedApp?.candidate?.name}</p>
            <form onSubmit={handleSendMessage}>
              <label>Subject</label>
              <input className="input" required value={msgSubject} onChange={e => setMsgSubject(e.target.value)} />
              
              <label>Message</label>
              <textarea className="input" rows="5" required value={msgContent} onChange={e => setMsgContent(e.target.value)}></textarea>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary">Send Email</button>
                <button type="button" className="btn" style={{ backgroundColor: '#e2e8f0' }} onClick={() => setMessageModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interview Modal */}
      {interviewModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
            <h2 style={{ marginTop: 0 }}>Schedule Interview</h2>
            <p style={{ color: '#4a5568', marginBottom: '1rem' }}>For: {selectedApp?.candidate?.name} - {selectedApp?.job?.title}</p>
            <form onSubmit={handleScheduleInterview}>
              <label>Date & Time</label>
              <input type="datetime-local" className="input" required value={intDate} onChange={e => setIntDate(e.target.value)} />
              
              <label>Mode</label>
              <select className="input" value={intMode} onChange={e => setIntMode(e.target.value)}>
                <option value="online">Online</option>
                <option value="onsite">Onsite</option>
              </select>

              <label>Location / Meeting Link</label>
              <input className="input" required value={intLocation} onChange={e => setIntLocation(e.target.value)} />

              <label>Notes to Candidate</label>
              <textarea className="input" rows="3" value={intMessage} onChange={e => setIntMessage(e.target.value)}></textarea>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary">Schedule & Notify</button>
                <button type="button" className="btn" style={{ backgroundColor: '#e2e8f0' }} onClick={() => setInterviewModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default ManageApplicants;