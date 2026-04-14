import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:7000/api",
  withCredentials: true,
});

// AUTH
export const loginUser = (data) => API.post("/auth/login", data);
export const signupUser = (data) => API.post("/auth/signup", data);

// GRIEVANCES
export const submitGrievanceAPI = (data) => API.post("/grievances", data);
export const getAllGrievances = () => API.get("/grievances");
export const getStudentGrievances = (rollNo) => API.get(`/grievances/student/${rollNo}`);
export const updateGrievanceAPI = (id, data) => API.put(`/grievances/${id}`, data);

// SCHOLARSHIPS
export const getScholarshipCatalog = () => API.get("/scholarships/catalog");
export const applyScholarshipAPI = (data) => API.post("/scholarships/apply", data);
export const getAllScholarships = () => API.get("/scholarships");
export const getStudentScholarships = (rollNo) => API.get(`/scholarships/student/${rollNo}`);
export const updateScholarshipDocStatus = (id, data) => API.put(`/scholarships/${id}/doc-status`, data);
export const requestScholarshipCorrectionAPI = (id, data) => API.put(`/scholarships/${id}/correction`, data);
export const studentReuploadAPI = (id, data) => API.put(`/scholarships/${id}/reupload`, data);
export const addScholarshipRequiredDocAPI = (id, data) => API.put(`/scholarships/${id}/add-doc`, data);
export const markScholarshipVerifiedAPI = (id) => API.put(`/scholarships/${id}/verify`);

// ANNOUNCEMENTS
export const postAnnouncementAPI = (data) => API.post("/announcements", data);
export const getAnnouncementsAPI = () => API.get("/announcements");

// FORUM
export const postForumDoubt = (data) => API.post("/forum", data);
export const getForumPosts = () => API.get("/forum");
export const toggleForumResolved = (id, data = {}) => API.put(`/forum/${id}/resolve`, data);
export const voteForumPost = (id, userId) => API.put(`/forum/${id}/vote`, { userId });
export const commentForumPost = (id, data) => API.post(`/forum/${id}/comment`, data);

// DOCUMENTS
export const uploadDocument = (formData) => API.post("/documents/upload", formData, {
  headers: { "Content-Type": "multipart/form-data" },
});
export const getStudentDocuments = (studentId) => API.get(`/documents/student/${studentId}`);
export const getDocumentById = (documentId) => API.get(`/documents/${documentId}`);
export const downloadDocument = (documentId) => API.get(`/documents/download/${documentId}`);
export const updateDocumentStatus = (documentId, data) => API.put(`/documents/${documentId}/status`, data);
export const deleteDocument = (documentId) => API.delete(`/documents/${documentId}`);

// DOC TICKETS
export const createDocTicket = (data) => API.post("/doc-tickets", data);
export const getAllDocTickets = () => API.get("/doc-tickets");
export const getStudentDocTickets = (rollNo) => API.get(`/doc-tickets/student/${rollNo}`);
export const updateDocTicketDocStatus = (id, data) => API.put(`/doc-tickets/${id}/doc-status`, data);
export const reuploadDocTicketDoc = (id, data) => API.put(`/doc-tickets/${id}/reupload`, data);

export default API;