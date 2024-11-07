import React, { useState } from 'react';
import './UploadDocuments.css';
const UploadDocuments = () => {
  const [identityProof, setIdentityProof] = useState(null);
  const [medicalReports, setMedicalReports] = useState(null);
  const [status, setStatus] = useState({
    identityProof: '',
    medicalReports: '',
  });
  const [progress, setProgress] = useState({
    identityProof: 0,
    medicalReports: 0,
  });
  const [submitted, setSubmitted] = useState(false); // State to track submission
  const [showModal, setShowModal] = useState(false); // State to control modal

  // Generic function to handle file selection
  const handleFileChange = (e, type) => {
    const selectedFile = e.target.files[0];
    if (type === 'identityProof') {
      setIdentityProof(selectedFile);
    } else if (type === 'medicalReports') {
      setMedicalReports(selectedFile);
    }
  };

  // Function to upload individual document
  const uploadDocument = async (file, type) => {
    if (!file) {
      setStatus((prevStatus) => ({
        ...prevStatus,
        [type]: 'Please select a file to upload.',
      }));
      return false;
    }
  
    const formData = new FormData();
    formData.append('document', file);
  
    try {
      setStatus((prevStatus) => ({
        ...prevStatus,
        [type]: 'Uploading...',
      }));
  
      const response = await fetch('http://localhost:3001/api/upload-documents', {
        method: 'POST',
        body: formData,
      });
  
      // Log the response for debugging
      const text = await response.text(); // Read the response as text
      if (!response.ok) {
        // If response is not OK, set error status
        setStatus((prevStatus) => ({
          ...prevStatus,
          [type]: `Failed: ${text}`,
           // Use text instead of JSON error
        }));
        return false;
      }
  
      // Parse as JSON if response is OK
      const data = JSON.parse(text);
      setStatus((prevStatus) => ({
        ...prevStatus,
        [type]: `Uploaded: ${data.message}`,

      }));
      setProgress((prevProgress) => ({ ...prevProgress, [type]: 100 }));
      return true;
    } catch (error) {
      setStatus((prevStatus) => ({
        ...prevStatus,
        [type]: `Error: ${error.message}`,
      }));
      return false;
    }
  };  

  // Function to handle form submission
  const handleSubmit = async () => {
    const identityUploadSuccess = await uploadDocument(identityProof, 'identityProof');
    const medicalUploadSuccess = await uploadDocument(medicalReports, 'medicalReports');

    // If all documents are uploaded successfully
    if (identityUploadSuccess && medicalUploadSuccess) {
      setSubmitted(true); // Set submitted to true on success
    }
  };

  // Function to handle modal opening
  const openModal = () => {
    setShowModal(true);
  };

  // Function to handle modal closing
  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="upload-document">
      {/* Show a "Submitted" message if all documents are successfully uploaded */}
      {/* {submitted && <p className="submitted-message">All Documents Submitted Successfully!</p>} */}

      <button className="upload-item" onClick={openModal}>
        Upload Documents
      </button>

      {/* Modal for uploading documents */}
      {showModal && (
        <div className="upload-model">
          <div className="upload-content">
           <div className="upload-header"><h3>Upload Required Documents</h3></div> 

            {/* Identity Proof Upload */}
            <div className="upload-section">
              <h4>Identity Proof (Aadhar Card, Voter ID, Passport, etc.)</h4>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, 'identityProof')}
                accept=".pdf,.doc,.docx,.jpg,.png"
              />
              <button onClick={() => uploadDocument(identityProof, 'identityProof')}>
                Upload Identity Proof
              </button>
              <p>Status: {status.identityProof}</p>
              {progress.identityProof > 0 && <progress value={progress.identityProof} max="100" />}
            </div>

            {/* Medical Reports Upload */}
            <div className="upload-section">
              <h4>Medical Examination Reports</h4>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, 'medicalReports')}
                accept=".pdf,.doc,.docx,.jpg,.png"
              />
              <button onClick={() => uploadDocument(medicalReports, 'medicalReports')}>
                Upload Medical Reports
              </button>
              <p>Status: {status.medicalReports}</p>
              {progress.medicalReports > 0 && <progress value={progress.medicalReports} max="100" />}
            </div>

            <button onClick={handleSubmit} className="submit-button">Submit All Documents</button>
            <button onClick={closeModal} className="closes-button">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadDocuments;