import React, { useState } from 'react';
import api from '../api/client';

const AddCustomer = ({ onClose, refreshCustomers, customer }) => {
  const [formData, setFormData] = useState({
    name: customer?.name || '',
    village: customer?.village || '',
    phone: customer?.phone || ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      alert('कृपया ग्राहकाचं नाव भरा.');
      return;
    }

    setLoading(true);
    try {
      if (customer && customer._id) {
        await api.updateCustomer(customer._id, {
          name: formData.name.trim(),
          village: formData.village?.trim() || '',
          phone: formData.phone?.trim() || ''
        });
        alert('ग्राहकाची माहिती यशस्वीरित्या अद्यतनित झाली.');
      } else {
        await api.addCustomer({
          name: formData.name.trim(),
          village: formData.village?.trim() || '',
          phone: formData.phone?.trim() || ''
        });
        alert('ग्राहक यशस्वीरित्या जतन झाला.');
      }
      onClose();
      refreshCustomers();
    } catch (err) {
      console.error('Add customer error:', err);
      alert('ग्राहक जोडण्यात त्रुटी: ' + (err?.response?.data?.error || err.message || 'अज्ञात त्रुटी'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">{customer ? 'ग्राहक संपादित करा' : 'नवीन ग्राहक जोडा'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">नाव *</label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ग्राहकाचे पूर्ण नाव"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">गाव</label>
              <input
                type="text"
                name="village"
                value={formData.village || ''}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ग्राहकाचे गाव"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">फोन (ऐच्छिक)</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="मोबाईल नंबर"
                disabled={loading}
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                disabled={loading}
              >
                रद्द करा
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (customer ? 'अद्यतनित करत आहे...' : 'जतन होत आहे...') : (customer ? 'अद्यतनित करा' : 'जतन करा')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCustomer;
