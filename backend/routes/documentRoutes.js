const express = require('express');
const router = express.Router();
const {
  uploadDocument,
  getStudentDocuments,
  getDocumentById,
  downloadDocument,
  updateDocumentStatus,
  deleteDocument,
  getDocumentsByType,
} = require('../controllers/documentController');
const upload = require('../middlewares/uploadMiddleware');

// Upload a new document
router.post('/upload', upload.single('file'), uploadDocument);

// Get all documents for a student
router.get('/student/:studentId', getStudentDocuments);

// Get documents by type for a student
router.get('/student/:studentId/type/:documentType', getDocumentsByType);

// Get a specific document
router.get('/:documentId', getDocumentById);

// Download a document file
router.get('/download/:documentId', downloadDocument);

// Update document status (for admin)
router.put('/:documentId/status', updateDocumentStatus);

// Delete a document
router.delete('/:documentId', deleteDocument);

module.exports = router;
