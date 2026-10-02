import { FormEvent, useEffect, useState } from 'react';
import { BookOpen, Plus } from 'lucide-react';

import Sidebar from '../components/Sidebar';
import { createAccount, getAccounts } from '../services/api';

interface Account {
  id: string;
  name: string;
  type: string;
  code?: string | null;
  createdAt: string;
}

function Accounts() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const company = JSON.parse(localStorage.getItem('company') || '{}');

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    type: 'ASSET',
    code: '',
  });

  const loadAccounts = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await getAccounts();
      setAccounts(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Unable to load accounts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setMessage('');
    setError('');
    setSubmitting(true);

    try {
      await createAccount(form);

      setMessage('Account created successfully.');

      setForm({
        name: '',
        type: 'ASSET',
        code: '',
      });

      await loadAccounts();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Unable to create account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar role={user.role} />

      <div className="dashboard-page">
        <header className="dashboard-header">
          <div>
            <div className="dashboard-brand">
              <div className="brand-mark">L</div>
              <span>LedgerFlow</span>
            </div>

            <p className="company-name">
              {company.name || 'Company'} · Chart of Accounts
            </p>
          </div>

          <div className="header-user">
            <div>
              <strong>
                {user.firstName} {user.lastName}
              </strong>
              <span>{user.role}</span>
            </div>
          </div>
        </header>

        <main className="dashboard-content">
          <div className="dashboard-title">
            <div>
              <h1>Chart of Accounts</h1>
              <p>Manage the accounting accounts used by your company.</p>
            </div>
          </div>

          <section className="expenses-section">
            <div className="section-heading">
              <div>
                <h2>Add Account</h2>
                <p>Create an account for your company ledger.</p>
              </div>
            </div>

            <form className="expense-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Account Name</label>

                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        name: e.target.value,
                      })
                    }
                    placeholder="e.g. Travel Expense"
                    minLength={2}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Account Code</label>

                  <input
                    type="text"
                    value={form.code}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        code: e.target.value,
                      })
                    }
                    placeholder="e.g. 5000"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Account Type</label>

                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      type: e.target.value,
                    })
                  }
                >
                  <option value="ASSET">Asset</option>
                  <option value="LIABILITY">Liability</option>
                  <option value="EQUITY">Equity</option>
                  <option value="REVENUE">Revenue</option>
                  <option value="EXPENSE">Expense</option>
                </select>
              </div>

              {message && <div className="success-message">{message}</div>}

              {error && <div className="error-message">{error}</div>}

              <button
                type="submit"
                className="primary-button expense-submit-button"
                disabled={submitting}
              >
                <Plus size={17} />

                {submitting ? 'Creating...' : 'Create Account'}
              </button>
            </form>
          </section>

          <section className="expenses-section">
            <div className="section-heading">
              <div>
                <h2>Accounts</h2>
                <p>Your company's chart of accounts.</p>
              </div>
            </div>

            {loading ? (
              <div className="dashboard-loading">Loading accounts...</div>
            ) : accounts.length === 0 ? (
              <div className="empty-state">
                <BookOpen size={32} />

                <h3>No accounts yet</h3>

                <p>Create your first accounting account above.</p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="expense-table">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Account Name</th>
                      <th>Type</th>
                      <th>Created</th>
                    </tr>
                  </thead>

                  <tbody>
                    {accounts.map((account) => (
                      <tr key={account.id}>
                        <td>{account.code || '—'}</td>

                        <td>
                          <strong>{account.name}</strong>
                        </td>

                        <td>
                          <span
                            className={`status status-${account.type.toLowerCase()}`}
                          >
                            {account.type}
                          </span>
                        </td>

                        <td>
                          {new Date(account.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default Accounts;
