const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { connectDB } = require('./config/db.js');
const documentRoutes = require('./routes/documentRoutes');
const User = require('./models/User');

dotenv.config();

const app = express();

app.use(cors({
  origin: function (origin, callback) {
    // Allow any localhost origin (any port) for development
    if (!origin || /^http:\/\/localhost(:\d+)?$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==============================
// IN-MEMORY DATA STORES
// ==============================
const users = [];
const grievances = [];
const scholarshipApplications = [];
const docTickets = [];
const attendanceRecords = [];
let docTicketSerial = 1000;
const announcements = [
  {
    id: 'ANN-2026-100',
    title: 'UP Scholarship document correction window open',
    body: 'Students with rejected income/caste documents can re-upload until Apr 10.',
    target: 'All',
    postedBy: 'Admin Office',
    date: 'Mar 27, 2026',
  },
];
const forumPosts = [
  { id: 1, user: 'Ankit S.', query: 'Gemini API rejected my Income Certificate. What should I check?', category: 'Scholarship', replies: 4, votes: 12, time: '10m ago', resolved: false, adminReply: '', resolvedAt: null, likedBy: [], comments: [] },
  { id: 2, user: 'Riya V.', query: 'Do we need to submit physical copies at the Registrar office this year?', category: 'Academic', replies: 2, votes: 5, time: '1h ago', resolved: false, adminReply: '', resolvedAt: null, likedBy: [], comments: [] },
  { id: 3, user: 'Sumit K.', query: 'Difference between Post-Matric and Dashmottar schemes for OBC?', category: 'Scholarship', replies: 8, votes: 21, time: '3h ago', resolved: false, adminReply: '', resolvedAt: null, likedBy: [], comments: [] },
  { id: 4, user: 'Neha P.', query: 'Is the server down for Aadhaar seeding?', category: 'Technical', replies: 12, votes: 3, time: '5h ago', resolved: false, adminReply: '', resolvedAt: null, likedBy: [], comments: [] },
  { id: 5, user: 'Vikram M.', query: 'My attendance is 74.8%. Will the AI verify my application?', category: 'Verification', replies: 15, votes: 45, time: '8h ago', resolved: false, adminReply: '', resolvedAt: null, likedBy: [], comments: [] },
  { id: 6, user: 'Sara H.', query: 'Which bank accounts are valid for DBT (Direct Benefit Transfer)?', category: 'Scholarship', replies: 1, votes: 2, time: '12h ago', resolved: false, adminReply: '', resolvedAt: null, likedBy: [], comments: [] },
  { id: 7, user: 'Rahul G.', query: 'Can I apply for both NSP and UP Scholarship together?', category: 'Scholarship', replies: 6, votes: 18, time: '1d ago', resolved: false, adminReply: '', resolvedAt: null, likedBy: [], comments: [] },
  { id: 8, user: 'Priya D.', query: 'Correction window dates for SC/ST category?', category: 'Scholarship', replies: 3, votes: 7, time: '1d ago', resolved: false, adminReply: '', resolvedAt: null, likedBy: [], comments: [] },
];
let forumNextId = 9;

// Scholarship catalog (shared with frontend)
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

// ==============================
// HELPER FUNCTIONS
// ==============================
const getAiCategory = (text) => {
  const lower = text.toLowerCase();
  if (lower.includes('scholarship') || lower.includes('income') || lower.includes('document')) return 'Scholarship';
  if (lower.includes('attendance') || lower.includes('exam') || lower.includes('academic')) return 'Academic';
  if (lower.includes('fee') || lower.includes('payment') || lower.includes('refund')) return 'Finance';
  return 'General';
};

const makeTicketId = () => {
  const year = new Date().getFullYear();
  const serial = Math.floor(Math.random() * 9000 + 1000);
  return `GRV-${year}-${serial}`;
};

// ==============================
// AUTH ROUTES
// ==============================
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, role, rollNo, department, year } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const exists = await User.findOne({ $or: [{ email }, ...(rollNo ? [{ rollNo }] : [])] }).lean();
    if (exists) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      role,
      rollNo: role === 'student' ? (rollNo || '') : '',
      department: department || '',
    });

    return res.status(201).json({
      message: 'Signup successful',
      user: { id: newUser._id.toString(), name: newUser.name, email: newUser.email, role: newUser.role, rollNo: newUser.rollNo, department: newUser.department }
    });
  } catch (error) {
    console.error('Signup error', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Hardcoded credentials for admin and teacher
    const hardcodedUsers = {
      admin: {
        email: 'admin@ietlucknow.edu',
        password: 'admin123',
        name: 'System Administrator',
        role: 'admin'
      },
      teacher: {
        email: 'teacher@ietlucknow.edu',
        password: 'teacher123',
        name: 'Faculty Member',
        role: 'teacher',
        department: 'Computer Science'
      }
    };

    if (role === 'admin' && email === hardcodedUsers.admin.email && password === hardcodedUsers.admin.password) {
      return res.json({
        message: 'Login successful',
        user: {
          id: 'admin-hardcoded',
          role: 'admin',
          name: hardcodedUsers.admin.name,
          email: hardcodedUsers.admin.email
        }
      });
    }

    if (role === 'teacher' && email === hardcodedUsers.teacher.email && password === hardcodedUsers.teacher.password) {
      return res.json({
        message: 'Login successful',
        user: {
          id: 'teacher-hardcoded',
          role: 'teacher',
          name: hardcodedUsers.teacher.name,
          email: hardcodedUsers.teacher.email,
          department: hardcodedUsers.teacher.department
        }
      });
    }

    // Check MongoDB for the user
    const user = await User.findOne({ email, password, role }).lean();

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    return res.json({
      message: 'Login successful',
      user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role, rollNo: user.rollNo, department: user.department }
    });
  } catch (error) {
    console.error('Login error', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// ==============================
// GRIEVANCE ROUTES
// ==============================
app.post('/api/grievances', (req, res) => {
  const { subject, description, studentRollNo } = req.body;

  if (!subject || !description) {
    return res.status(400).json({ message: 'Subject and description required' });
  }

  const ticketId = makeTicketId();
  const category = getAiCategory(`${subject} ${description}`);
  const grievance = {
    id: ticketId,
    studentRollNo: studentRollNo || 'UNKNOWN',
    subject,
    description,
    category,
    status: 'Open',
    reply: '',
    createdAt: new Date().toLocaleString(),
  };

  grievances.unshift(grievance);

  return res.status(201).json({
    message: 'Grievance submitted',
    grievance,
    ticketId,
    category,
  });
});

app.get('/api/grievances', (req, res) => {
  return res.json({ grievances });
});

app.get('/api/grievances/student/:rollNo', (req, res) => {
  const filtered = grievances.filter((g) => g.studentRollNo === req.params.rollNo);
  return res.json({ grievances: filtered });
});

app.put('/api/grievances/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body; // { reply, status }
  const idx = grievances.findIndex((g) => g.id === id);

  if (idx === -1) {
    return res.status(404).json({ message: 'Grievance not found' });
  }

  grievances[idx] = { ...grievances[idx], ...updates };

  return res.json({ message: 'Grievance updated', grievance: grievances[idx] });
});

// ==============================
// SCHOLARSHIP ROUTES
// ==============================
app.get('/api/scholarships/catalog', (req, res) => {
  return res.json({ catalog: scholarshipCatalog });
});

app.post('/api/scholarships/apply', (req, res) => {
  const { scholarshipName, uploadedDocs, studentRollNo } = req.body;

  if (!scholarshipName) {
    return res.status(400).json({ message: 'Scholarship name required' });
  }

  const allDocs = scholarshipCatalog[scholarshipName];
  if (!allDocs) {
    return res.status(400).json({ message: 'Unknown scholarship' });
  }

  const docs = allDocs.map((docName) => ({
    name: docName,
    fileName: (uploadedDocs && uploadedDocs[docName]) || '',
    status: (uploadedDocs && uploadedDocs[docName]) ? 'Pending' : 'Missing',
    note: '',
  }));

  const application = {
    id: `SCH-${Date.now()}`,
    studentRollNo: studentRollNo || 'UNKNOWN',
    scholarshipName,
    status: 'Under Review',
    docs,
    studentMessage: '',
    submittedAt: new Date().toLocaleString(),
  };

  scholarshipApplications.unshift(application);

  return res.status(201).json({ message: 'Application submitted', application });
});

app.get('/api/scholarships', (req, res) => {
  return res.json({ applications: scholarshipApplications });
});

app.get('/api/scholarships/student/:rollNo', (req, res) => {
  const filtered = scholarshipApplications.filter((s) => s.studentRollNo === req.params.rollNo);
  return res.json({ applications: filtered });
});

app.put('/api/scholarships/:id/doc-status', (req, res) => {
  const { id } = req.params;
  const { docName, status } = req.body;
  const app = scholarshipApplications.find((a) => a.id === id);
  if (!app) return res.status(404).json({ message: 'Application not found' });

  app.docs = app.docs.map((doc) =>
    doc.name === docName ? { ...doc, status } : doc
  );

  return res.json({ message: 'Doc status updated', application: app });
});

app.put('/api/scholarships/:id/correction', (req, res) => {
  const { id } = req.params;
  const { docName, note } = req.body;
  const app = scholarshipApplications.find((a) => a.id === id);
  if (!app) return res.status(404).json({ message: 'Application not found' });

  app.status = 'Under Review';
  app.docs = app.docs.map((doc) =>
    doc.name === docName ? { ...doc, status: 'Reupload Requested', note: (note || '').trim() } : doc
  );

  return res.json({ message: 'Correction requested', application: app });
});

app.put('/api/scholarships/:id/reupload', (req, res) => {
  const { id } = req.params;
  const { docName, fileName } = req.body;
  const trimmedName = (fileName || '').trim();
  if (!trimmedName) return res.status(400).json({ message: 'File name required' });

  const app = scholarshipApplications.find((a) => a.id === id);
  if (!app) return res.status(404).json({ message: 'Application not found' });

  app.status = 'Under Review';
  app.docs = app.docs.map((doc) =>
    doc.name === docName
      ? { ...doc, fileName: trimmedName, status: 'Pending', note: '' }
      : doc
  );
  app.studentMessage = '';

  return res.json({ message: 'Document reuploaded', application: app });
});

app.put('/api/scholarships/:id/add-doc', (req, res) => {
  const { id } = req.params;
  const { docName } = req.body;
  const trimmed = (docName || '').trim();
  if (!trimmed) return res.status(400).json({ message: 'Document name required' });

  const app = scholarshipApplications.find((a) => a.id === id);
  if (!app) return res.status(404).json({ message: 'Application not found' });

  if (app.docs.some((d) => d.name.toLowerCase() === trimmed.toLowerCase())) {
    return res.status(409).json({ message: 'Document already exists' });
  }

  app.docs.push({ name: trimmed, fileName: '', status: 'Missing', note: '' });

  return res.json({ message: 'Document added', application: app });
});

app.put('/api/scholarships/:id/verify', (req, res) => {
  const { id } = req.params;
  const app = scholarshipApplications.find((a) => a.id === id);
  if (!app) return res.status(404).json({ message: 'Application not found' });

  app.status = 'Verified Complete';
  app.studentMessage = '✅ All documents verified. Await final submission dates.';

  return res.json({ message: 'Application verified', application: app });
});

// ==============================
// ANNOUNCEMENT ROUTES
// ==============================
app.post('/api/announcements', (req, res) => {
  const { title, body, target } = req.body;

  if (!title || !body) {
    return res.status(400).json({ message: 'Title and body required' });
  }

  const announcement = {
    id: `ANN-${new Date().getFullYear()}-${Math.floor(Math.random() * 900 + 100)}`,
    title,
    body,
    target: target || 'All',
    postedBy: 'Admin Desk',
    date: new Date().toLocaleDateString(),
  };

  announcements.unshift(announcement);

  return res.status(201).json({ message: 'Announcement posted', announcement });
});

app.get('/api/announcements', (req, res) => {
  return res.json({ announcements });
});

// ==============================
// FORUM ROUTES
// ==============================
app.post('/api/forum', (req, res) => {
  const { title, description, category, userName } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description required' });
  }

  const post = {
    id: forumNextId++,
    user: userName || 'Anonymous',
    query: title,
    category: category || 'General',
    description,
    replies: 0,
    votes: 0,
    time: 'just now',
    resolved: false,
    adminReply: '',
    resolvedAt: null,
    likedBy: [],
    comments: [],
  };

  forumPosts.unshift(post);

  return res.status(201).json({ message: 'Doubt posted', post });
});

app.get('/api/forum', (req, res) => {
  return res.json({ posts: forumPosts });
});

app.put('/api/forum/:id/resolve', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { resolved, adminReply } = req.body || {};
  const post = forumPosts.find((p) => p.id === id);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  const hasResolvedPayload = typeof resolved === 'boolean';
  const nextResolved = hasResolvedPayload ? resolved : !post.resolved;
  post.resolved = nextResolved;

  if (typeof adminReply === 'string') {
    post.adminReply = adminReply.trim();
  }

  if (post.resolved) {
    if (!post.adminReply) {
      return res.status(400).json({ message: 'Admin reply is required to resolve a query' });
    }
    post.resolvedAt = new Date().toLocaleString();
  } else {
    post.resolvedAt = null;
  }

  return res.json({ message: 'Status toggled', post });
});

// Toggle like/vote on a forum post
app.put('/api/forum/:id/vote', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: 'userId required' });

  const post = forumPosts.find((p) => p.id === id);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  const idx = post.likedBy.indexOf(userId);
  if (idx === -1) {
    post.likedBy.push(userId);
    post.votes++;
  } else {
    post.likedBy.splice(idx, 1);
    post.votes--;
  }

  return res.json({ message: 'Vote toggled', post });
});

// Add a comment to a forum post
app.post('/api/forum/:id/comment', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { userName, text } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ message: 'Comment text required' });

  const post = forumPosts.find((p) => p.id === id);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  const comment = {
    id: Date.now(),
    user: userName || 'Anonymous',
    text: text.trim(),
    time: new Date().toLocaleString(),
  };
  post.comments.push(comment);
  post.replies = post.comments.length;

  return res.status(201).json({ message: 'Comment added', post });
});

// ==============================
// DOC-TICKET ROUTES
// ==============================
app.post('/api/doc-tickets', (req, res) => {
  const { studentRollNo, studentName, scholarshipName, docs } = req.body;

  if (!studentRollNo || !docs || !docs.length) {
    return res.status(400).json({ message: 'Student rollNo and docs required' });
  }

  const ticketId = `DOC-${new Date().getFullYear()}-${++docTicketSerial}`;
  const ticket = {
    id: ticketId,
    studentRollNo,
    studentName: studentName || 'Student',
    scholarshipName: scholarshipName || '',
    status: 'Pending Review',
    docs: docs.map((d) => ({
      name: d.name,
      fileName: d.fileName || '',
      fileSize: d.fileSize || 0,
      status: d.fileName ? 'Pending' : 'Missing',
      adminNote: '',
    })),
    createdAt: new Date().toLocaleString(),
  };

  // Set initial ticket status
  const hasMissing = ticket.docs.some((d) => d.status === 'Missing');
  if (hasMissing) ticket.status = 'Docs Missing';

  docTickets.unshift(ticket);

  return res.status(201).json({ message: 'Doc ticket created', ticket });
});

app.get('/api/doc-tickets', (req, res) => {
  return res.json({ tickets: docTickets });
});

app.get('/api/doc-tickets/student/:rollNo', (req, res) => {
  const filtered = docTickets.filter((t) => t.studentRollNo === req.params.rollNo);
  return res.json({ tickets: filtered });
});

app.put('/api/doc-tickets/:id/doc-status', (req, res) => {
  const { id } = req.params;
  const { docName, status, adminNote } = req.body;
  const ticket = docTickets.find((t) => t.id === id);
  if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

  ticket.docs = ticket.docs.map((d) =>
    d.name === docName ? { ...d, status: status || d.status, adminNote: adminNote !== undefined ? adminNote : d.adminNote } : d
  );

  // Auto-update ticket status based on doc statuses
  const allVerified = ticket.docs.every((d) => d.status === 'Verified');
  const hasRejected = ticket.docs.some((d) => d.status === 'Rejected');
  const hasMissing = ticket.docs.some((d) => d.status === 'Missing');
  if (allVerified) ticket.status = 'All Verified';
  else if (hasRejected) ticket.status = 'Action Required';
  else if (hasMissing) ticket.status = 'Docs Missing';
  else ticket.status = 'Pending Review';

  return res.json({ message: 'Doc status updated', ticket });
});

// Student reupload a rejected/missing doc
app.put('/api/doc-tickets/:id/reupload', (req, res) => {
  const { id } = req.params;
  const { docName, fileName, fileSize } = req.body;
  const ticket = docTickets.find((t) => t.id === id);
  if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

  ticket.docs = ticket.docs.map((d) =>
    d.name === docName ? { ...d, fileName: fileName || '', fileSize: fileSize || 0, status: 'Pending', adminNote: '' } : d
  );

  // Recalculate ticket status
  const allVerified = ticket.docs.every((d) => d.status === 'Verified');
  const hasRejected = ticket.docs.some((d) => d.status === 'Rejected');
  const hasMissing = ticket.docs.some((d) => d.status === 'Missing');
  if (allVerified) ticket.status = 'All Verified';
  else if (hasRejected) ticket.status = 'Action Required';
  else if (hasMissing) ticket.status = 'Docs Missing';
  else ticket.status = 'Pending Review';

  return res.json({ message: 'Doc reuploaded', ticket });
});

// ==============================
// DOCUMENT ROUTES (MongoDB)
// ==============================
app.use('/api/documents', documentRoutes);

// ==============================
// ROOT TEST ROUTE
// ==============================
app.get('/', (req, res) => {
  res.json({ message: 'Backend running 🚀' });
});

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log('Server started on port ' + PORT);
});