const Document = require('../models/Document');
const path = require('path');
const fs = require('fs');
const { getIsConnected } = require('../config/db');

// Upload a document
async function uploadDocument(req, res) {
  try {
    if (!getIsConnected()) {
      return res.status(503).json({ error: 'Database not available. Document uploads are disabled.' });
    }

    const { studentId, documentType, scholarshipId } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    if (!studentId || !documentType) {
      return res.status(400).json({ error: 'Missing studentId or documentType' });
    }

    const document = await Document.create({
      student: studentId,
      scholarship: scholarshipId || null,
      documentType,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      fileSize: req.file.size,
      fileExtension: path.extname(req.file.originalname).substring(1),
      filePath: req.file.path,
      mimeType: req.file.mimetype,
      status: 'Pending',
    });

    return res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      document,
    });
  } catch (error) {
    console.error('uploadDocument error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}

// Get all documents for a student
async function getStudentDocuments(req, res) {
  try {
    if (!getIsConnected()) {
      return res.json({ success: true, count: 0, documents: [] });
    }

    const { studentId } = req.params;

    const documents = await Document.find({ student: studentId })
      .sort({ uploadedDate: -1 });

    return res.json({
      success: true,
      count: documents.length,
      documents,
    });
  } catch (error) {
    console.error('getStudentDocuments error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}

// Get a specific document by ID
async function getDocumentById(req, res) {
  try {
    if (!getIsConnected()) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const { documentId } = req.params;

    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    return res.json({
      success: true,
      document,
    });
  } catch (error) {
    console.error('getDocumentById error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}

// Download a document file
async function downloadDocument(req, res) {
  try {
    if (!getIsConnected()) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const { documentId } = req.params;

    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    if (!fs.existsSync(document.filePath)) {
      return res.status(404).json({ error: 'File not found on server' });
    }

    res.download(document.filePath, document.originalName);
  } catch (error) {
    console.error('downloadDocument error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}

// Update document status (for admin)
async function updateDocumentStatus(req, res) {
  try {
    if (!getIsConnected()) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const { documentId } = req.params;
    const { status, adminNote } = req.body;

    if (!['Pending', 'Verified', 'Rejected', 'Reupload Requested'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const document = await Document.findByIdAndUpdate(
      documentId,
      {
        status,
        adminNote: adminNote || '',
      },
      { new: true }
    );

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    return res.json({
      success: true,
      message: 'Document status updated',
      document,
    });
  } catch (error) {
    console.error('updateDocumentStatus error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}

// Delete a document
async function deleteDocument(req, res) {
  try {
    if (!getIsConnected()) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const { documentId } = req.params;

    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Delete file from server
    if (fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }

    await Document.findByIdAndDelete(documentId);

    return res.json({
      success: true,
      message: 'Document deleted successfully',
    });
  } catch (error) {
    console.error('deleteDocument error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}

// Get documents by document type
async function getDocumentsByType(req, res) {
  try {
    if (!getIsConnected()) {
      return res.json({ success: true, documentType: req.params.documentType, count: 0, documents: [] });
    }

    const { studentId, documentType } = req.params;

    const documents = await Document.find({
      student: studentId,
      documentType,
    }).sort({ uploadedDate: -1 });

    return res.json({
      success: true,
      documentType,
      count: documents.length,
      documents,
    });
  } catch (error) {
    console.error('getDocumentsByType error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}

module.exports = {
  uploadDocument,
  getStudentDocuments,
  getDocumentById,
  downloadDocument,
  updateDocumentStatus,
  deleteDocument,
  getDocumentsByType,
};
