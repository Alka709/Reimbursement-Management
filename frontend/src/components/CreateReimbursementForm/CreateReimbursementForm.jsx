import React, { useState } from 'react';
import { createReimbursement } from '../../api/reimbursementApi';
import { getApiErrorMessage } from '../../utils/apiErrorUtils';

function CreateReimbursementForm({ onSuccess }) {
  const [formData, setFormData] = useState({ title: '', description: '', amount: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.amount) {
      setError('Title and Amount are required fields.');
      return;
    }

    const amountNum = parseFloat(formData.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Amount must be a positive number.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await createReimbursement({
        title: formData.title,
        description: formData.description,
        amount: amountNum,
      });

      if (response.success || response.status === 'success') {
        setFormData({ title: '', description: '', amount: '' });
        if (onSuccess) {
          onSuccess('Reimbursement request submitted successfully.');
        }
      } else {
        throw new Error('Submission failed');
      }
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to submit reimbursement request.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '600px', width: '100%' }}>
      <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--color-text)' }}>Submit Reimbursement Request</h2>
      
      {error && (
        <div style={{
          backgroundColor: '#FEE2E2',
          color: '#991B1B',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.9rem',
          marginBottom: '1.25rem',
          border: '1px solid #FCA5A5',
          fontWeight: '500',
        }}>
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="title">Title *</label>
          <input
            id="title"
            name="title"
            type="text"
            className="form-input"
            placeholder="E.g., Client Dinner, Flight to NY"
            value={formData.title}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="amount">Amount *</label>
          <input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            className="form-input"
            placeholder="0.00"
            value={formData.amount}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            className="form-textarea"
            placeholder="Provide any additional details..."
            value={formData.description}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateReimbursementForm;
