import { useState, useEffect } from 'react';
import api from '../api/client';

export const useCustomersWithBalance = (searchQuery = '') => {
  const [state, setState] = useState({
    customers: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        // Get all customers and transactions in parallel
        const [customers, transactions] = await Promise.all([
          api.getCustomers(),
          api.getTransactions()
        ]);

        if (!mounted) return;

        // Calculate balance for each customer
        const customersWithBalance = customers.map(customer => {
          const customerTransactions = transactions.filter(t => 
            (typeof t.customer_id === 'object' ? t.customer_id._id : t.customer_id) === customer._id
          );
          const balance = customerTransactions.reduce((sum, t) => sum + (t.credit - t.debit), 0);
          return { ...customer, balance, id: customer._id }; // Map MongoDB _id to id for compatibility
        });

        // Filter by search
        const filtered = customersWithBalance.filter(c => 
          !searchQuery || 
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (c.village && c.village.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (c.id && c.id.toString().includes(searchQuery))
        );

        // Sort by balance DESC, then name ASC
        filtered.sort((a, b) => {
          if (b.balance !== a.balance) return b.balance - a.balance;
          return a.name.localeCompare(b.name);
        });

        setState({
          customers: filtered,
          loading: false,
          error: null
        });
      } catch (error) {
        if (mounted) {
          setState({ customers: [], loading: false, error: error.message });
        }
      }
    };

    fetchData();
    return () => { mounted = false; };
  }, [searchQuery]);

  const totalBalance = state.customers.reduce((sum, c) => sum + c.balance, 0);

  return { 
    customers: state.customers, 
    loading: state.loading,
    error: state.error,
    totalBalance 
  };
};

export const useTransactionsForCustomer = (customerId) => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    let mounted = true;
    const fetchTransactions = async () => {
      if (!customerId) {
        setTransactions([]);
        return;
      }

      try {
        const allTransactions = await api.getTransactions();
        if (!mounted) return;

        const customerTransactions = allTransactions
          .filter(t => (typeof t.customer_id === 'object' ? t.customer_id._id : t.customer_id) === customerId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setTransactions(customerTransactions);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
        if (mounted) setTransactions([]);
      }
    };

    fetchTransactions();
    return () => { mounted = false; };
  }, [customerId]);

  return transactions;
};

export const useCustomerCount = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let mounted = true;
    const fetchCount = async () => {
      try {
        const customers = await api.getCustomers();
        if (mounted) setCount(customers.length);
      } catch (error) {
        console.error('Failed to fetch customer count:', error);
        if (mounted) setCount(0);
      }
    };

    fetchCount();
    return () => { mounted = false; };
  }, []);

  return count;
};
