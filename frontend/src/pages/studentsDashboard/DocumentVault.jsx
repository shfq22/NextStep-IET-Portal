import React, { useMemo, useRef, useState, useEffect } from 'react';
import { uploadDocument, getStudentDocuments } from '../../api/api';
import { Upload, CheckCircle, AlertCircle, ChevronDown, FileUp } from 'lucide-react';

const DocumentVault = ({ data }) => {
  const scholarshipNames = Object.keys(data.scholarshipCatalog);
  const [selectedScholarship, setSelectedScholarship] = useState(scholarshipNames[0]);
  const [uploadedDocs, setUploadedDocs] = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const fileInputRefs = useRef({});

  const checklist = useMemo(
    () => data.scholarshipCatalog[selectedScholarship] || [],
    [data.scholarshipCatalog, selectedScholarship],
  );

  // Load uploaded documents on component mount
  useEffect(() => {
    loadUploadedFiles();
  }, [data.currentUser]);

  const loadUploadedFiles = async () => {
    try {
      if (!data.currentUser || !data.currentUser.id) {
        setLoadingFiles(false);
        return;
      }
      // In a real app, you'd fetch from backend using student ID
      // const response = await getStudentDocuments(data.currentUser.id);
      // setUploadedFiles(response.data.documents);
      setLoadingFiles(false);
    } catch (error) {
      console.error('Error loading files:', error);
      setLoadingFiles(false);
    }
  };

  const handleFileSelect = (docName, file) => {
    if (!file) {
      setUploadedDocs((prev) => {
        const newDocs = { ...prev };
        delete newDocs[docName];
        return newDocs;
      });
      return;
    }
    setUploadedDocs((prev) => ({ ...prev, [docName]: file }));
  };

  const handleUploadFile = async (docName) => {
    const file = uploadedDocs[docName];
    if (!file) {
      setUploadStatus((prev) => ({ ...prev, [docName]: { error: 'No file selected' } }));
      return;
    }

    setUploading(true);
    setUploadStatus((prev) => ({ ...prev, [docName]: { uploading: true } }));

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', docName);
      formData.append('studentId', data.currentUser?.id || 'demo-student');
      formData.append('scholarshipId', selectedScholarship);

      const response = await uploadDocument(formData);

      setUploadStatus((prev) => ({
        ...prev,
        [docName]: { success: true, message: 'Uploaded successfully!' },
      }));

      setUploadedFiles((prev) => [...prev, response.data.document]);

      // Clear the file after successful upload
      setTimeout(() => {
        setUploadedDocs((prev) => {
          const newDocs = { ...prev };
          delete newDocs[docName];
          return newDocs;
        });
        setUploadStatus((prev) => {
          const newStatus = { ...prev };
          delete newStatus[docName];
          return newStatus;
        });
      }, 2000);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus((prev) => ({
        ...prev,
        [docName]: { error: error.response?.data?.error || 'Upload failed' },
      }));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    data.applyScholarship({ scholarshipName: selectedScholarship, uploadedDocs });

    // Auto-create a doc-ticket for the admin to review
    if (data.createDocTicket && data.currentUser) {
      const docs = checklist.map((docName) => ({
        name: docName,
        fileName: uploadedDocs[docName]?.name || uploadedFiles.find(f => f.documentType === docName)?.originalName || '',
        fileSize: uploadedDocs[docName]?.size || 0,
      }));
      await data.createDocTicket({
        studentRollNo: data.currentUser.rollNo,
        studentName: data.currentUser.name,
        scholarshipName: selectedScholarship,
        docs,
      });
    }

    setUploadedDocs({});
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="border-b border-[var(--tertiary)] pb-5">
        <h2 className="text-3xl font-extrabold uppercase" style={{ color: 'var(--headline)' }}>Apply for Scholarship</h2>
        <p className="text-sm mt-2 opacity-70" style={{ color: 'var(--paragraph)' }}>
          Choose scholarship, upload checklist docs one by one, then submit application (status: Under Review).
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 p-6 rounded-2xl border border-[var(--tertiary)] bg-[var(--secondary)] shadow-sm">
        <div className="relative">
          <select
            value={selectedScholarship}
            onChange={(e) => setSelectedScholarship(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[var(--tertiary)] bg-[var(--bg-color)] appearance-none"
            style={{ color: 'var(--headline)' }}
          >
            {scholarshipNames.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-60 pointer-events-none" />
        </div>

        <div className="space-y-3">
          {checklist.map((doc) => (
            <div key={doc} className="p-4 rounded-xl border border-[var(--tertiary)] bg-[var(--bg-color)]">
              <p className="text-sm font-semibold mb-3" style={{ color: 'var(--headline)' }}>{doc}</p>
              <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
                <div className="flex-1 relative">
                  <input
                    ref={(el) => {
                      if (el) fileInputRefs.current[doc] = el;
                    }}
                    type="file"
                    accept=".pdf,image/*"
                    onChange={(e) => handleFileSelect(doc, e.target.files?.[0])}
                    className="hidden"
                  />
                  <div
                    className="px-4 py-2.5 rounded-lg border border-dashed border-[var(--tertiary)] bg-transparent cursor-pointer hover:bg-[var(--secondary)] transition-colors"
                    onClick={() => fileInputRefs.current[doc]?.click()}
                  >
                    <p className="text-xs flex items-center gap-2" style={{ color: 'var(--paragraph)' }}>
                      <FileUp size={14} className="opacity-70" />
                      {uploadedDocs[doc]?.name || 'Choose file or drag & drop'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={!uploadedDocs[doc] || uploading}
                  className="px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest disabled:opacity-50 inline-flex items-center gap-1"
                  style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
                  onClick={() => handleUploadFile(doc)}
                >
                  <Upload size={13} />
                  {uploading && uploadStatus[doc]?.uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
              
              {uploadStatus[doc]?.uploading && (
                <p className="text-xs mt-2 text-blue-600">Uploading...</p>
              )}
              {uploadStatus[doc]?.success && (
                <div className="flex items-center gap-2 mt-2 text-green-600">
                  <CheckCircle size={16} />
                  <p className="text-xs font-semibold">{uploadStatus[doc].message}</p>
                </div>
              )}
              {uploadStatus[doc]?.error && (
                <div className="flex items-center gap-2 mt-2 text-red-600">
                  <AlertCircle size={16} />
                  <p className="text-xs font-semibold">{uploadStatus[doc].error}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-widest hover:brightness-95 transition-all"
          style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
        >
          Submit Application
        </button>
      </form>

      <div>
        <h3 className="font-bold mb-3" style={{ color: 'var(--headline)' }}>Uploaded Documents ({uploadedFiles.length})</h3>
        <div className="space-y-3">
          {loadingFiles && (
            <div className="p-4 rounded border border-[var(--tertiary)] text-sm opacity-70">Loading documents...</div>
          )}
          {!loadingFiles && uploadedFiles.length === 0 && (
            <div className="p-4 rounded border border-[var(--tertiary)] text-sm opacity-70">No documents uploaded yet.</div>
          )}
          {uploadedFiles.map((doc) => (
            <div key={doc._id || doc.id} className="p-4 rounded-xl border border-[var(--tertiary)] bg-[var(--bg-color)]">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="font-bold text-sm" style={{ color: 'var(--headline)' }}>{doc.documentType}</p>
                  <p className="text-xs mt-1 opacity-70">File: {doc.originalName || doc.fileName}</p>
                  <p className="text-xs mt-1 opacity-60">Size: {(doc.fileSize / 1024).toFixed(2)} KB</p>
                  <p className="text-xs mt-1 opacity-60">Uploaded: {new Date(doc.uploadedDate || doc.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded whitespace-nowrap ${
                  doc.status === 'Verified' ? 'bg-green-500/20 text-green-700' :
                  doc.status === 'Rejected' ? 'bg-red-500/20 text-red-700' :
                  doc.status === 'Reupload Requested' ? 'bg-orange-500/20 text-orange-700' :
                  'bg-blue-500/20 text-blue-700'
                }`}>
                  {doc.status}
                </span>
              </div>
              {doc.adminNote && (
                <p className="text-xs mt-2 p-2 rounded bg-orange-50/30 text-orange-700">
                  <strong>Admin Note:</strong> {doc.adminNote}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold mb-3" style={{ color: 'var(--headline)' }}>My Applications</h3>
        <div className="space-y-3">
          {data.scholarshipApplications.length === 0 && (
            <div className="p-4 rounded border border-[var(--tertiary)] text-sm opacity-70">No scholarship applications submitted yet.</div>
          )}
          {data.scholarshipApplications.map((app) => (
            <div key={app.id} className="p-4 rounded-xl border border-[var(--tertiary)] bg-[var(--bg-color)]">
              <p className="font-bold" style={{ color: 'var(--headline)' }}>{app.scholarshipName}</p>
              <p className="text-xs mt-1 opacity-70">Status: {app.status}</p>
              <ul className="mt-2 text-sm space-y-1">
                {app.docs.map((doc) => (
                  <li key={doc.name} className="space-y-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <span>- {doc.name}: <strong>{doc.status}</strong></span>
                      {doc.status === 'Reupload Requested' && (
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            accept=".pdf,image/*"
                            className="text-xs"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) data.studentReuploadScholarshipDoc(app.id, doc.name, file.name);
                            }}
                          />
                        </div>
                      )}
                    </div>
                    {doc.status === 'Reupload Requested' && doc.note && (
                      <p className="text-xs text-red-600 font-semibold">Admin note: {doc.note}</p>
                    )}
                  </li>
                ))}
              </ul>
              {app.studentMessage && <p className="text-green-600 font-semibold mt-2">{app.studentMessage}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentVault;