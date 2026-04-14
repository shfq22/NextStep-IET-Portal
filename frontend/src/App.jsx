import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import {
  loginUser,
  signupUser,
  submitGrievanceAPI,
  getAllGrievances,
  getStudentGrievances,
  updateGrievanceAPI,
  applyScholarshipAPI,
  getAllScholarships,
  getStudentScholarships,
  updateScholarshipDocStatus,
  requestScholarshipCorrectionAPI,
  studentReuploadAPI,
  addScholarshipRequiredDocAPI,
  markScholarshipVerifiedAPI,
  postAnnouncementAPI,
  getAnnouncementsAPI,
  createDocTicket,
} from './api/api';
import Navbar from './components/Navbar';
import LoadingScreen from './components/common/LoadingScreen';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import CollegeConnectHome from './pages/CollegeConnectHome';
import PlacementRoutes from './placement-portal/PlacementRoutes';
import StudentHome from './pages/studentsDashboard/StudentHome';
import Announcements from './pages/studentsDashboard/Announcements';
import Tickets from './pages/studentsDashboard/Tickets';
import Uploads from './pages/studentsDashboard/DocumentVault';
import Forum from './pages/studentsDashboard/Forum';
import AskDoubt from './pages/studentsDashboard/forum/AskDoubt';
import AdminHome from './pages/adminDashboard/AdminHome';
import AdminGrievances from './pages/adminDashboard/AdminGrievances';
import AdminScholarships from './pages/adminDashboard/AdminScholarships';
import AdminAnnouncements from './pages/adminDashboard/AdminAnnouncements';
import AdminDocTickets from './pages/adminDashboard/AdminDocTickets';
import AdminForum from './pages/adminDashboard/AdminForum';
import AdminForumResolve from './pages/adminDashboard/AdminForumResolve';
import StudentDocTickets from './pages/studentsDashboard/StudentDocTickets';
import ProfileSettings from './pages/common/ProfileSettings';
import PrivacySecurity from './pages/common/PrivacySecurity';
import TeacherDashboard from './pages/teacherDashboard/TeacherDashboard';

const scholarshipCatalog = {
  'UP Post-Matric Scholarship': [
    'Income Certificate',
    'Caste Certificate',
    'Previous Year Marksheet',
    'Fee Receipt',
  ],
  'NSP Central Sector Scholarship': [
    'Class 12 Marksheet',
    'Bonafide Certificate',
    'Bank Passbook',
    'Aadhaar Card',
  ],
};

const DashboardLayout = ({ children, theme, toggleTheme, role, userName, onSignOut }) => (
  <div
    className="dashboard-shell flex min-h-screen transition-colors duration-300"
    style={{ backgroundColor: 'var(--bg-color)' }}
  >
    <Sidebar theme={theme} toggleTheme={toggleTheme} role={role} />
    <div className="flex-1 flex flex-col">
      <Navbar role={role} userName={userName} onSignOut={onSignOut} />
      <main className="flex-1 overflow-y-auto p-4 md:p-7 lg:p-8">
        <div className="dashboard-content w-full max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  </div>
);

function LoginWrapper({ theme, toggleTheme, signIn }) {
  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    const user = await signIn(credentials);
    if (!user) return;
    if (user.role === 'admin') navigate('/dsw/admin');
    else if (user.role === 'teacher') navigate('/dsw/teacher');
    else navigate('/dsw/student');
  };

  return <Login theme={theme} toggleTheme={toggleTheme} onLogin={handleLogin} />;
}

function SignupWrapper({ signUp }) {
  const navigate = useNavigate();

  const handleSignup = async (data) => {
    const user = await signUp(data);
    if (!user) return;
    if (user.role === 'admin') navigate('/dsw/admin');
    else if (user.role === 'teacher') navigate('/dsw/teacher');
    else navigate('/dsw/student');
  };

  return <Signup onSignUp={handleSignup} />;
}

function App() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('dsw_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [grievances, setGrievances] = useState([]);
  const [scholarshipApplications, setScholarshipApplications] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => setIsInitializing(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  // ==============================
  // DATA FETCHING
  // ==============================
  const fetchAnnouncements = useCallback(async () => {
    try {
      const res = await getAnnouncementsAPI();
      setAnnouncements(res.data.announcements || []);
    } catch (err) {
      console.error('Failed to fetch announcements', err);
    }
  }, []);

  const fetchStudentGrievances = useCallback(async (rollNo) => {
    try {
      const res = await getStudentGrievances(rollNo);
      setGrievances(res.data.grievances || []);
    } catch (err) {
      console.error('Failed to fetch grievances', err);
    }
  }, []);

  const fetchAllGrievances = useCallback(async () => {
    try {
      const res = await getAllGrievances();
      setGrievances(res.data.grievances || []);
    } catch (err) {
      console.error('Failed to fetch grievances', err);
    }
  }, []);

  const fetchStudentScholarships = useCallback(async (rollNo) => {
    try {
      const res = await getStudentScholarships(rollNo);
      setScholarshipApplications(res.data.applications || []);
    } catch (err) {
      console.error('Failed to fetch scholarships', err);
    }
  }, []);

  const fetchAllScholarships = useCallback(async () => {
    try {
      const res = await getAllScholarships();
      setScholarshipApplications(res.data.applications || []);
    } catch (err) {
      console.error('Failed to fetch scholarships', err);
    }
  }, []);

  // Fetch data when user changes
  useEffect(() => {
    if (!currentUser) return;

    fetchAnnouncements();

    if (currentUser.role === 'student') {
      fetchStudentGrievances(currentUser.rollNo);
      fetchStudentScholarships(currentUser.rollNo);
    } else if (currentUser.role === 'admin') {
      fetchAllGrievances();
      fetchAllScholarships();
    }
  }, [currentUser, fetchAnnouncements, fetchStudentGrievances, fetchAllGrievances, fetchStudentScholarships, fetchAllScholarships]);

  // ==============================
  // AUTH
  // ==============================
  const signIn = async ({ email, password, role, rollNo }) => {
    try {
      const res = await loginUser({ email, password, role, rollNo });
      const user = res?.data?.user;
      if (!user) throw new Error('Invalid response from server');
      setCurrentUser(user);
      localStorage.setItem('dsw_user', JSON.stringify(user));
      return user;
    } catch (err) {
      console.error('Login failed', err);
      alert('Invalid credentials or user not found');
      return null;
    }
  };

  const signUp = async ({ name, email, password, role, rollNo, department }) => {
    try {
      const res = await signupUser({ name, email, password, role, rollNo, department });
      const user = res?.data?.user;
      if (!user) throw new Error('Invalid response from server');
      setCurrentUser(user);
      localStorage.setItem('dsw_user', JSON.stringify(user));
      return user;
    } catch (err) {
      console.error('Signup failed', err);
      alert(err?.response?.data?.message || 'Signup failed');
      return null;
    }
  };

  const signOut = () => {
    setCurrentUser(null);
    setGrievances([]);
    setScholarshipApplications([]);
    setAnnouncements([]);
    localStorage.removeItem('dsw_user');
  };

  const updateProfile = (updates) => {
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    localStorage.setItem('dsw_user', JSON.stringify(updated));
  };

  // ==============================
  // GRIEVANCES (Backend-synced)
  // ==============================
  const submitGrievance = async ({ subject, description }) => {
    try {
      const res = await submitGrievanceAPI({
        subject,
        description,
        studentRollNo: currentUser?.rollNo || 'UNKNOWN',
      });
      const data = res.data;
      // Refresh grievances from backend
      if (currentUser?.rollNo) {
        await fetchStudentGrievances(currentUser.rollNo);
      }
      return { ticketId: data.ticketId, category: data.category };
    } catch (err) {
      console.error('Failed to submit grievance', err);
      alert('Failed to submit grievance');
      return null;
    }
  };

  const updateGrievance = async (id, payload) => {
    try {
      await updateGrievanceAPI(id, payload);
      await fetchAllGrievances();
    } catch (err) {
      console.error('Failed to update grievance', err);
    }
  };

  // ==============================
  // SCHOLARSHIPS (Backend-synced)
  // ==============================
  const applyScholarship = async ({ scholarshipName, uploadedDocs }) => {
    try {
      await applyScholarshipAPI({
        scholarshipName,
        uploadedDocs,
        studentRollNo: currentUser?.rollNo || 'UNKNOWN',
      });
      if (currentUser?.rollNo) {
        await fetchStudentScholarships(currentUser.rollNo);
      }
    } catch (err) {
      console.error('Failed to apply scholarship', err);
      alert('Failed to submit application');
    }
  };

  const updateScholarshipDoc = async (applicationId, docName, nextStatus) => {
    try {
      await updateScholarshipDocStatus(applicationId, { docName, status: nextStatus });
      await fetchAllScholarships();
    } catch (err) {
      console.error('Failed to update doc status', err);
    }
  };

  const requestScholarshipDocCorrection = async (applicationId, docName, note) => {
    try {
      await requestScholarshipCorrectionAPI(applicationId, { docName, note });
      await fetchAllScholarships();
    } catch (err) {
      console.error('Failed to request correction', err);
    }
  };

  const studentReuploadScholarshipDoc = async (applicationId, docName, fileName) => {
    try {
      await studentReuploadAPI(applicationId, { docName, fileName });
      if (currentUser?.rollNo) {
        await fetchStudentScholarships(currentUser.rollNo);
      }
    } catch (err) {
      console.error('Failed to reupload', err);
    }
  };

  const addScholarshipRequiredDoc = async (applicationId, docName) => {
    try {
      await addScholarshipRequiredDocAPI(applicationId, { docName });
      await fetchAllScholarships();
    } catch (err) {
      console.error('Failed to add doc', err);
    }
  };

  const markScholarshipVerified = async (applicationId) => {
    try {
      await markScholarshipVerifiedAPI(applicationId);
      await fetchAllScholarships();
    } catch (err) {
      console.error('Failed to verify', err);
    }
  };

  // ==============================
  // ANNOUNCEMENTS (Backend-synced)
  // ==============================
  const postAnnouncement = async ({ title, body, target }) => {
    try {
      await postAnnouncementAPI({ title, body, target });
      await fetchAnnouncements();
    } catch (err) {
      console.error('Failed to post announcement', err);
      alert('Failed to post announcement');
    }
  };

  // ==============================
  // CONTEXT OBJECTS
  // ==============================
  const studentContext = useMemo(
    () => ({
      currentUser,
      grievances,
      announcements,
      scholarshipApplications,
      scholarshipCatalog,
      submitGrievance,
      applyScholarship,
      studentReuploadScholarshipDoc,
      createDocTicket: async (ticketData) => {
        try {
          await createDocTicket(ticketData);
        } catch (err) {
          console.error('Failed to create doc ticket', err);
        }
      },
    }),
    [currentUser, grievances, announcements, scholarshipApplications],
  );

  const adminContext = useMemo(
    () => ({
      grievances,
      scholarshipApplications,
      announcements,
      updateGrievance,
      updateScholarshipDoc,
      addScholarshipRequiredDoc,
      requestScholarshipDocCorrection,
      markScholarshipVerified,
      postAnnouncement,
    }),
    [grievances, scholarshipApplications, announcements],
  );

  const studentGuard = currentUser?.role === 'student';
  const adminGuard = currentUser?.role === 'admin';
  const teacherGuard = currentUser?.role === 'teacher';

  if (isInitializing) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<CollegeConnectHome theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/placement/*" element={<PlacementRoutes />} />

        <Route path="/dsw/login" element={<LoginWrapper theme={theme} toggleTheme={toggleTheme} signIn={signIn} />} />
        <Route path="/dsw/signup" element={<SignupWrapper signUp={signUp} />} />

        <Route
          path="/dsw/teacher"
          element={
            teacherGuard ? (
              <TeacherDashboard onLogout={signOut} />
            ) : (
              <Navigate to="/dsw/login" replace />
            )
          }
        />

        <Route
          path="/dsw/student"
          element={
            studentGuard ? (
              <DashboardLayout
                theme={theme}
                toggleTheme={toggleTheme}
                role="student"
                userName={currentUser.name}
                onSignOut={signOut}
              >
                <StudentHome data={studentContext} />
              </DashboardLayout>
            ) : (
              <Navigate to="/dsw/login" replace />
            )
          }
        />
        <Route
          path="/dsw/student/announcements"
          element={
            studentGuard ? (
              <DashboardLayout
                theme={theme}
                toggleTheme={toggleTheme}
                role="student"
                userName={currentUser.name}
                onSignOut={signOut}
              >
                <Announcements data={studentContext} />
              </DashboardLayout>
            ) : (
              <Navigate to="/dsw/login" replace />
            )
          }
        />
        <Route
          path="/dsw/student/grievances"
          element={
            studentGuard ? (
              <DashboardLayout
                theme={theme}
                toggleTheme={toggleTheme}
                role="student"
                userName={currentUser.name}
                onSignOut={signOut}
              >
                <Tickets data={studentContext} />
              </DashboardLayout>
            ) : (
              <Navigate to="/dsw/login" replace />
            )
          }
        />
        <Route
          path="/dsw/student/scholarships"
          element={
            studentGuard ? (
              <DashboardLayout
                theme={theme}
                toggleTheme={toggleTheme}
                role="student"
                userName={currentUser.name}
                onSignOut={signOut}
              >
                <Uploads data={studentContext} />
              </DashboardLayout>
            ) : (
              <Navigate to="/dsw/login" replace />
            )
          }
        />
        <Route
          path="/dsw/student/doc-tickets"
          element={
            studentGuard ? (
              <DashboardLayout
                theme={theme}
                toggleTheme={toggleTheme}
                role="student"
                userName={currentUser.name}
                onSignOut={signOut}
              >
                <StudentDocTickets currentUser={currentUser} />
              </DashboardLayout>
            ) : (
              <Navigate to="/dsw/login" replace />
            )
          }
        />
        <Route
          path="/dsw/student/forum"
          element={
            studentGuard ? (
              <DashboardLayout
                theme={theme}
                toggleTheme={toggleTheme}
                role="student"
                userName={currentUser.name}
                onSignOut={signOut}
              >
                <Forum currentUser={currentUser} />
              </DashboardLayout>
            ) : (
              <Navigate to="/dsw/login" replace />
            )
          }
        />
        <Route
          path="/dsw/student/forum/ask"
          element={
            studentGuard ? (
              <DashboardLayout
                theme={theme}
                toggleTheme={toggleTheme}
                role="student"
                userName={currentUser.name}
                onSignOut={signOut}
              >
                <AskDoubt userName={currentUser.name} />
              </DashboardLayout>
            ) : (
              <Navigate to="/dsw/login" replace />
            )
          }
        />

        {/* Student Profile & Security */}
        <Route
          path="/dsw/student/profile"
          element={
            studentGuard ? (
              <DashboardLayout theme={theme} toggleTheme={toggleTheme} role="student" userName={currentUser.name} onSignOut={signOut}>
                <ProfileSettings currentUser={currentUser} onUpdateProfile={updateProfile} />
              </DashboardLayout>
            ) : (<Navigate to="/dsw/login" replace />)
          }
        />
        <Route
          path="/dsw/student/security"
          element={
            studentGuard ? (
              <DashboardLayout theme={theme} toggleTheme={toggleTheme} role="student" userName={currentUser.name} onSignOut={signOut}>
                <PrivacySecurity currentUser={currentUser} />
              </DashboardLayout>
            ) : (<Navigate to="/dsw/login" replace />)
          }
        />

        <Route
          path="/dsw/admin"
          element={
            adminGuard ? (
              <DashboardLayout
                theme={theme}
                toggleTheme={toggleTheme}
                role="admin"
                userName={currentUser.name}
                onSignOut={signOut}
              >
                <AdminHome data={adminContext} />
              </DashboardLayout>
            ) : (
              <Navigate to="/dsw/login" replace />
            )
          }
        />
        <Route
          path="/dsw/admin/grievances"
          element={
            adminGuard ? (
              <DashboardLayout
                theme={theme}
                toggleTheme={toggleTheme}
                role="admin"
                userName={currentUser.name}
                onSignOut={signOut}
              >
                <AdminGrievances data={adminContext} />
              </DashboardLayout>
            ) : (
              <Navigate to="/dsw/login" replace />
            )
          }
        />
        <Route
          path="/dsw/admin/scholarships"
          element={
            adminGuard ? (
              <DashboardLayout
                theme={theme}
                toggleTheme={toggleTheme}
                role="admin"
                userName={currentUser.name}
                onSignOut={signOut}
              >
                <AdminScholarships data={adminContext} />
              </DashboardLayout>
            ) : (
              <Navigate to="/dsw/login" replace />
            )
          }
        />
        <Route
          path="/dsw/admin/announcements"
          element={
            adminGuard ? (
              <DashboardLayout
                theme={theme}
                toggleTheme={toggleTheme}
                role="admin"
                userName={currentUser.name}
                onSignOut={signOut}
              >
                <AdminAnnouncements data={adminContext} />
              </DashboardLayout>
            ) : (
              <Navigate to="/dsw/login" replace />
            )
          }
        />
        <Route
          path="/dsw/admin/doc-tickets"
          element={
            adminGuard ? (
              <DashboardLayout
                theme={theme}
                toggleTheme={toggleTheme}
                role="admin"
                userName={currentUser.name}
                onSignOut={signOut}
              >
                <AdminDocTickets />
              </DashboardLayout>
            ) : (
              <Navigate to="/dsw/login" replace />
            )
          }
        />

        {/* Admin Forum */}
        <Route
          path="/dsw/admin/forum"
          element={
            adminGuard ? (
              <DashboardLayout theme={theme} toggleTheme={toggleTheme} role="admin" userName={currentUser.name} onSignOut={signOut}>
                <AdminForum />
              </DashboardLayout>
            ) : (<Navigate to="/dsw/login" replace />)
          }
        />
        <Route
          path="/dsw/admin/forum/:id"
          element={
            adminGuard ? (
              <DashboardLayout theme={theme} toggleTheme={toggleTheme} role="admin" userName={currentUser.name} onSignOut={signOut}>
                <AdminForumResolve />
              </DashboardLayout>
            ) : (<Navigate to="/dsw/login" replace />)
          }
        />

        {/* Admin Profile & Security */}
        <Route
          path="/dsw/admin/profile"
          element={
            adminGuard ? (
              <DashboardLayout theme={theme} toggleTheme={toggleTheme} role="admin" userName={currentUser.name} onSignOut={signOut}>
                <ProfileSettings currentUser={currentUser} onUpdateProfile={updateProfile} />
              </DashboardLayout>
            ) : (<Navigate to="/dsw/login" replace />)
          }
        />
        <Route
          path="/dsw/admin/security"
          element={
            adminGuard ? (
              <DashboardLayout theme={theme} toggleTheme={toggleTheme} role="admin" userName={currentUser.name} onSignOut={signOut}>
                <PrivacySecurity currentUser={currentUser} />
              </DashboardLayout>
            ) : (<Navigate to="/dsw/login" replace />)
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
