import React from 'react';
import { useTransactionsForCustomer, useCustomersWithBalance } from '../hooks/useCustomers';

const TransactionModal = ({ customerId, onClose }) => {
  const { customers } = useCustomersWithBalance();
  const customer = customers.find(c => c.id === customerId);
  const transactions = useTransactionsForCustomer(customerId);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (transactions.length >= 0) {
      setLoading(false);
    }
  }, [transactions]);

  if (!customer) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg">
          <p className="text-gray-700">ग्राहक सापडला नाही.</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">बंद करा</button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('mr-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateBalance = (trans) => {
    return trans.reduce((sum, t) => sum + (t.credit - t.debit), 0);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{customer.name}</h2>
              <p className="text-gray-600">
                {customer.village ? `${customer.village}, ` : ''}{customer.phone ? `फोन: ${customer.phone}` : ''}
              </p>
              <p className="text-lg font-semibold mt-1 text-green-600">
                सद्यस्थिती बाकी: ₹{customer.balance.toFixed(2)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">व्यवहार लोड होत आहेत...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-4xl mb-2">📋</div>
              <p className="text-gray-600">या ग्राहकाचे कोणतेही व्यवहार नोंदलेले नाहीत.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border px-4 py-3 text-left text-sm font-semibold text-gray-700">तारीख</th>
                    <th className="border px-4 py-3 text-left text-sm font-semibold text-gray-700">वर्णन</th>
                    <th className="border px-4 py-3 text-right text-sm font-semibold text-gray-700">उधारी (₹)</th>
                    <th className="border px-4 py-3 text-right text-sm font-semibold text-gray-700">वसुली (₹)</th>
                    <th className="border px-4 py-3 text-right text-sm font-semibold text-gray-700">एकूण</th>
                    <th className="border px-4 py-3 text-right text-sm font-semibold text-gray-700">शिल्लक (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    let running = 0;
                    return transactions.map((transaction, index) => {
                      const delta = transaction.credit - transaction.debit;
                      running += delta;
                      return (
                        <tr key={transaction.id || index} className="hover:bg-gray-50">
                          <td className="border px-4 py-3 text-sm text-gray-600">{formatDate(transaction.date)}</td>
                          <td className="border px-4 py-3 text-sm font-medium text-gray-900 max-w-xs truncate">
                            {transaction.description}
                          </td>
                          <td className={`border px-4 py-3 text-sm text-right font-semibold ${
                            transaction.credit > 0 ? 'text-red-600' : 'text-gray-400'
                          }`}>
                            {transaction.credit.toFixed(2)}
                          </td>
                          <td className={`border px-4 py-3 text-sm text-right font-semibold ${
                            transaction.debit > 0 ? 'text-green-600' : 'text-gray-400'
                          }`}>
                            {transaction.debit.toFixed(2)}
                          </td>
                          <td className={`border px-4 py-3 text-sm text-right font-semibold ${
                            delta > 0 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            ₹{delta.toFixed(2)}
                          </td>
                          <td className="border px-4 py-3 text-sm text-right font-bold">
                            ₹{running.toFixed(2)}
                          </td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
                <tfoot>
                  {(() => {
                    const totalCredit = transactions.reduce((s, t) => s + t.credit, 0);
                    const totalDebit = transactions.reduce((s, t) => s + t.debit, 0);
                    const net = totalCredit - totalDebit;
                    return (
                      <tr className="bg-gray-100 font-semibold">
                        <td className="border px-4 py-3 text-sm text-gray-700" colSpan={2}>एकूण</td>
                        <td className="border px-4 py-3 text-sm text-right text-red-600">{totalCredit.toFixed(2)}</td>
                        <td className="border px-4 py-3 text-sm text-right text-green-600">{totalDebit.toFixed(2)}</td>
                        <td className={`border px-4 py-3 text-sm text-right ${net > 0 ? 'text-red-600' : 'text-green-600'}`}>₹{net.toFixed(2)}</td>
                        <td className="border px-4 py-3 text-sm text-right">₹{(net).toFixed(2)}</td>
                      </tr>
                    );
                  })()}
                </tfoot>
              </table>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            बंद करा
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
