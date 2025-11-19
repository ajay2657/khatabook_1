import React, { useEffect, useState } from 'react';
import api from '../api/client';

const AddTransaction = ({ 
  selectedCustomerId, 
  onClose, 
  refreshCustomers,
  presetType
}) => {
  const toLocalInputValue = (d) => {
    const pad = (n) => String(n).padStart(2, '0');
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [formData, setFormData] = useState({
    customerId: selectedCustomerId || '',
    description: presetType === 'debit' ? 'वसुली' : '',
    amount: '',
    deposit: '',
    type: presetType || 'credit',
    date: toLocalInputValue(new Date())
  });
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    let mounted = true;
    const fetchCustomers = async () => {
      try {
        const list = await api.getCustomers();
        if (mounted) {
          setCustomers(list);
          if (selectedCustomerId) {
            setFormData(prev => ({ ...prev, customerId: selectedCustomerId }));
          }
        }
      } catch (e) {
        console.error('Load customers failed', e);
      }
    };
    fetchCustomers();
    return () => { mounted = false; };
  }, [selectedCustomerId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { customerId, description, amount, deposit, type, date } = formData;
    if (!customerId) {
      alert('कृपया ग्राहक निवडा.');
      return;
    }
    
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      alert('कृपया वैध रक्कम भरा.');
      return;
    }

    let dep = 0;
    if (type === 'credit' && deposit !== '') {
      dep = parseFloat(deposit);
      if (isNaN(dep) || dep < 0) {
        alert('कृपया वैध वसुली (डिपॉझिट) रक्कम भरा.');
        return;
      }
      if (dep > amt) {
        alert('डिपॉझिट रक्कम व्यवहाराच्या रकमेपेक्षा जास्त असू शकत नाही.');
        return;
      }
    }
    
    if (!description.trim() && type !== 'debit') {
      alert('कृपया व्यवहाराचे वर्णन भरा.');
      return;
    }

    if (!date || isNaN(new Date(date).getTime())) {
      alert('कृपया वैध तारीख निवडा.');
      return;
    }

    setLoading(true);
    try {
      const isoDate = new Date(date).toISOString();
      const credit = type === 'credit' ? amt : (type === 'cash' ? amt : 0);
      const debit = type === 'debit' ? amt : (type === 'cash' ? amt : dep);
      
      await api.addTransaction({
        customer_id: customerId,
        date: isoDate,
        description: description.trim(),
        credit,
        debit
      });
      
      alert('व्यवहार यशस्वीरित्या नोंदवला.');
      setFormData({ 
        ...formData,
        description: presetType === 'debit' ? 'वसुली' : '', 
        amount: '', 
        deposit: '', 
        date: toLocalInputValue(new Date()) 
      });
      onClose();
      refreshCustomers();
    } catch (err) {
      console.error('Add transaction error:', err);
      alert('व्यवहार नोंदवण्यात त्रुटी: ' + (err?.response?.data?.error || err.message || 'अज्ञात त्रुटी'));
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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">नवीन व्यवहार नोंदवा</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ग्राहक निवडा *</label>
              <select
                name="customerId"
                value={formData.customerId}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading || selectedCustomerId}
                required
              >
                <option value="">— ग्राहक निवडा —</option>
                {customers.map(c => (
                  <option key={c._id} value={c._id}>
                    {c.name} {c.village ? `(${c.village})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">तारीख आणि वेळ *</label>
              <input
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">रक्कम *</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="रक्कम"
                min="0"
                step="0.01"
                required
                disabled={loading}
              />
            </div>
            
            {presetType === 'debit' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">वसुली</label>
                <p className="text-sm text-gray-600 mb-1">ग्राहकाकडून मिळालेली रक्कम</p>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">व्यवहार प्रकार *</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="credit"
                      checked={formData.type === 'credit'}
                      onChange={handleChange}
                      className="mr-2"
                      disabled={loading}
                    />
                    <span className="text-gray-700">उधारी (तुम्ही दिली)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="debit"
                      checked={formData.type === 'debit'}
                      onChange={handleChange}
                      className="mr-2"
                      disabled={loading}
                    />
                    <span className="text-gray-700">वसुली (ग्राहकाने दिली)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="cash"
                      checked={formData.type === 'cash'}
                      onChange={handleChange}
                      className="mr-2"
                      disabled={loading}
                    />
                    <span className="text-gray-700">नगदी विक्री (उधार नाही)</span>
                  </label>
                </div>
              </div>
            )}

            {formData.type === 'credit' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">डिपॉझिट (वसुली) — ऐच्छिक</label>
                <input
                  type="number"
                  name="deposit"
                  value={formData.deposit}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="या व्यवहारात लगेच घेतलेली रक्कम"
                  min="0"
                  step="0.01"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  शिल्लक: ₹{(() => {
                    const a = parseFloat(formData.amount || '0');
                    const d = parseFloat(formData.deposit || '0');
                    if (isNaN(a) || a <= 0) return '0.00';
                    if (isNaN(d) || d < 0) return a.toFixed(2);
                    return Math.max(0, a - d).toFixed(2);
                  })()}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {formData.type === 'debit' ? 'नोट (ऐच्छिक)' : 'वर्णन *'}
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={formData.type === 'debit' ? 'वसुलीबद्दल नोट' : 'व्यवाहराचे वर्णन'}
                required={formData.type !== 'debit'}
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
                className="px-6 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'नोंदवत आहे...' : 'जतन करा'}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default AddTransaction;
