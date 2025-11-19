import Dexie from 'dexie';

class RaviUdhariVahiDB extends Dexie {
  constructor() {
    super('RaviUdhariVahi_v3');
    this.version(1).stores({
      customers: '++id, name, village, phone',
      transactions: '++id, customer_id, date, description, credit, debit'
    });
    this.version(2).stores({
      customers: '++id, name, village, phone',
      transactions: '++id, customer_id, date, description, credit, debit'
    });

    this.customers = this.table('customers');
    this.transactions = this.table('transactions');
  }
}

const db = new RaviUdhariVahiDB();

db.open().catch(err => {
  console.error('Failed to open database:', err);
  alert('डेटाबेस सुरू करण्यात त्रुटी: ' + err.message);
});

export default db;
