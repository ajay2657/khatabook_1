import React, { useState, useCallback } from 'react';
import { useCustomersWithBalance, useCustomerCount } from '../hooks/useCustomers';
import AddCustomer from './AddCustomer';
import AddTransaction from './AddTransaction';
import TransactionModal from './TransactionModal';
import api from '../api/client';

const CustomerList = () => {
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
<<<<<<< HEAD
  const [editingCustomer, setEditingCustomer] = useState(null);
=======
>>>>>>> 4795440 (added files)
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { customers, loading, totalBalance } = useCustomersWithBalance(searchQuery);
  const customerCount = useCustomerCount();

  const refreshCustomers = useCallback(() => {
    setIsRefreshing(true);
    // Force a re-render by updating search query temporarily
    setSearchQuery(prev => prev + ' ');
    setTimeout(() => {
      setSearchQuery(prev => prev.trim());
      setIsRefreshing(false);
    }, 100);
  }, []);

  const handleRowClick = useCallback((id) => {
    // Only select the customer; do not open any modal automatically
    setSelectedCustomerId(id);
  }, []);

  const handleAddTransactionClick = useCallback(() => {
    // Ensure only one modal is visible at a time
    setShowTransactionModal(false);
    setShowAddTransaction(true);
  }, []);

  const exportToCSV = useCallback(() => {
    if (customers.length === 0) {
      alert('निर्यात करण्यासाठी किमान एक ग्राहक असावा.');
      return;
    }

    const headers = ['ID', 'नाव', 'गाव', 'फोन', 'बाकी रक्कम'];
    const csvRows = [
      headers.join(','),
      ...customers.map(c => [
        c.id,
        `"${c.name.replace(/"/g, '""')}"`,
        `"${(c.village || '').replace(/"/g, '""')}"`,
        `"${(c.phone || '').replace(/"/g, '""')}"`,
        c.balance.toFixed(2)
      ].join(','))
    ].join('\n');

    // Create and download CSV
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvRows], { type: 'text/csv;charset=utf-8;' }); // UTF-8 BOM for Excel
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ravi_customers_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert(`CSV फाईल यशस्वीरित्या निर्यात झाली. एकूण ${customers.length} ग्राहक.`);
  }, [customers]);

  const backupDatabase = useCallback(async () => {
    try {
      // Get all data from API
      const [customers, transactions] = await Promise.all([
        api.getCustomers(),
        api.getTransactions()
      ]);

      // Create backup payload
      const backupPayload = {
        customers,
        transactions
      };
      const backupData = new TextEncoder().encode(JSON.stringify(backupPayload, null, 2));
      const backupBlob = new Blob([backupData], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(backupBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ravi_udhary_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert('डेटाबेस बॅकअप यशस्वीरित्या तयार झाला.');
    } catch (err) {
      console.error('Backup error:', err);
      alert('बॅकअप तयार करण्यात त्रुटी: ' + (err?.response?.data?.error || err.message || 'अज्ञात त्रुटी'));
    }
  }, []);

  const clearSearch = () => setSearchQuery('');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            रवी उधारी वही - RAVI ELECTRICAL AND MACHINERIES
          </h1>
          <p className="text-center text-gray-600 mt-2">ग्राहक व्यवस्थापन प्रणाली</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <button
<<<<<<< HEAD
            onClick={() => { setEditingCustomer(null); setShowAddCustomer(true); }}
=======
            onClick={() => setShowAddCustomer(true)}
>>>>>>> 4795440 (added files)
            className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            ➕ नवीन ग्राहक जोडा
          </button>
          
          <button
            onClick={handleAddTransactionClick}
            className="p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            💰 नवीन व्यवहार नोंदवा
          </button>
          {/* Removed separate receive-payment button; handled inside New Transaction */}
          
          <button
            onClick={() => { setShowAddTransaction(false); if (selectedCustomerId) setShowTransactionModal(true); }}
            disabled={!selectedCustomerId}
            className="p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            📋 ग्राहक व्यवहार पहा
          </button>
          
          <button
            onClick={exportToCSV}
            disabled={customers.length === 0}
            className="p-4 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            📊 CSV निर्यात करा
          </button>
          
          <button
            onClick={backupDatabase}
            className="p-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            💾 डेटाबेस बॅकअप
          </button>
        </div>

        {/* Refresh Button */}
        <div className="mb-6">
          <button
            onClick={refreshCustomers}
            disabled={isRefreshing || loading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isRefreshing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                रिफ्रेश होत आहे...
              </>
            ) : (
              '🔄 रिफ्रेश सूची'
            )}
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ग्राहक शोधा (नाव / गाव / ID)..."
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          {searchQuery && (
            <p className="text-sm text-gray-600 mt-1">
              शोध परिणाम: {customers.length} ग्राहक
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && !searchQuery && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">ग्राहक लोड होत आहेत...</p>
          </div>
        )}

        {/* Customer Table */}
        {!loading && (
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                ग्राहक यादी ({customerCount} एकूण)
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      नाव
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      गाव
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      फोन
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      बाकी रक्कम (₹)
                    </th>
<<<<<<< HEAD
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      क्रिया
                    </th>
=======
>>>>>>> 4795440 (added files)
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customers.map((customer) => (
                    <tr
                      key={customer.id}
                      onClick={() => handleRowClick(customer.id)}
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {customer.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 max-w-xs truncate">
                        {customer.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {customer.village || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {customer.phone || '-'}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold text-right ${
                        customer.balance >= 0 
                          ? 'text-red-600' 
                          : 'text-green-600'
                      }`}>
                        {customer.balance.toFixed(2)}
                      </td>
<<<<<<< HEAD
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        <div className="inline-flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowAddCustomer(true);
                              // pass the customer data to AddCustomer via state
                              setEditingCustomer(customer);
                            }}
                            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                          >
                            संपादित करा
                          </button>
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (!confirm('हा ग्राहक व त्याचे संबंधीत व्यवहार हटवायचे आहेत का?')) return;
                              try {
                                await api.deleteCustomer(customer.id);
                                alert('ग्राहक हटवला गेला.');
                                refreshCustomers();
                              } catch (err) {
                                console.error('Delete error:', err);
                                alert('ग्राहक हटविण्यात त्रुटी: ' + (err?.response?.data?.error || err.message || 'अज्ञात त्रुटी'));
                              }
                            }}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                          >
                            हटवा
                          </button>
                        </div>
                      </td>
=======
>>>>>>> 4795440 (added files)
                    </tr>
                  ))}
                  
                  {customers.length === 0 && !searchQuery && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        <div className="text-4xl mb-4">👥</div>
                        <p>अजून कोणतेही ग्राहक जोडलेले नाहीत.</p>
                        <p className="text-sm mt-1">नवीन ग्राहक जोडण्यासाठी वरील बटण वापरा.</p>
                      </td>
                    </tr>
                  )}
                  
                  {customers.length === 0 && searchQuery && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        <div className="text-4xl mb-4">🔍</div>
                        <p>शोध परिणाम सापडले नाहीत.</p>
                        <p className="text-sm mt-1">शोध वाक्य बदला किंवा शोध रद्द करा.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Status Bar */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-700">
            <div>
              <span className="font-medium">एकूण बाकी रक्कम:</span> ₹{totalBalance.toFixed(2)}
            </div>
            <div className="mt-2 sm:mt-0">
              <span className="font-medium">एकूण ग्राहक:</span> {customerCount}
            </div>
            {searchQuery && (
              <div className="mt-2 sm:mt-0">
                <span className="font-medium">शोधलेले:</span> {customers.length}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddCustomer && (
        <AddCustomer 
<<<<<<< HEAD
          onClose={() => { setShowAddCustomer(false); setEditingCustomer(null); }} 
          refreshCustomers={refreshCustomers}
          customer={editingCustomer}
=======
          onClose={() => setShowAddCustomer(false)} 
          refreshCustomers={refreshCustomers} 
>>>>>>> 4795440 (added files)
        />
      )}
      
      {showAddTransaction && (
        <AddTransaction
          selectedCustomerId={selectedCustomerId}
          presetType={undefined}
          onClose={() => setShowAddTransaction(false)}
          refreshCustomers={refreshCustomers}
        />
      )}
      
      {showTransactionModal && selectedCustomerId && (
        <TransactionModal
          customerId={selectedCustomerId}
          onClose={() => {
            setShowTransactionModal(false);
            setSelectedCustomerId(null);
          }}
        />
      )}
    </div>
  );
};

export default CustomerList;
