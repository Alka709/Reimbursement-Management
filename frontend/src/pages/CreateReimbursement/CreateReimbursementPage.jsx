import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateReimbursementForm from '../../components/CreateReimbursementForm/CreateReimbursementForm.jsx';
import Toast from '../../components/Toast/Toast.jsx';

function CreateReimbursementPage() {
  const [successToast, setSuccessToast] = useState('');
  const navigate = useNavigate();

  const handleSuccess = (message) => {
    setSuccessToast(message);
    setTimeout(() => {
      setSuccessToast('');
      navigate('/reimbursements');
    }, 2000);
  };

  return (
    <div>
      <Toast message={successToast} onDismiss={() => setSuccessToast('')} />
      
      <div className="page-header">
        <div>
          <h1 className="page-title">Create Reimbursement</h1>
          <p className="page-subtitle">Submit a new corporate expense for approval.</p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <CreateReimbursementForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}

export default CreateReimbursementPage;
