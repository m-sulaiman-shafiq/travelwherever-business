import { FormEvent, useEffect, useState } from 'react';
import { LogOut, Receipt, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { createExpense, getMyExpenses } from '../services/api';

interface Expense {
  id: string;
  category: string;
  description?: string;
  amount: string;
  vatAmount: string;
  currency: string;
  expenseDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

function EmployeeDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const company = JSON.parse(localStorage.getItem('company') || '{}');

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    category: 'Meals',
    description: '',
    amount: '',
    vatAmount: '',
    currency: 'AED',
    expenseDate: '',
  });

  const loadExpenses = async () => {
    try {
      setLoading(true);

      const data = await getMyExpenses();

      setExpenses(data);
    } catch (error) {
      console.error('Expenses error:', error);
      setError('Unable to load your expenses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setMessage('');
    setError('');
    setSubmitting(true);

    try {
      await createExpense({
        category: form.category,
        description: form.description || undefined,
        amount: Number(form.amount),
        vatAmount: Number(form.vatAmount),
        currency: form.currency,
        expenseDate: form.expenseDate,
      });

      setMessage('Expense submitted successfully.');

      setForm({
        category: 'Meals',
        description: '',
        amount: '',
        vatAmount: '',
        currency: 'AED',
        expenseDate: '',
      });

      await loadExpenses();
    } catch (error: any) {
      console.error('Submit expense error:', error);

      setError(error.response?.data?.message || 'Unable to submit expense.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('company');

    navigate('/login');
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <div className="dashboard-brand">
            <div className="brand-mark">L</div>
            <span>LedgerFlow</span>
          </div>

          <p className="company-name">
            {company.name || 'Company'} · Employee Dashboard
          </p>
        </div>

        <div className="header-user">
          <div>
            <strong>
              {user.firstName} {user.lastName}
            </strong>

            <span>{user.role}</span>
          </div>

          <button className="logout-button" onClick={handleLogout}>
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        {/* Submit Expense */}

        <div className="dashboard-title">
          <div>
            <h1>Submit Expense</h1>
            <p>Submit your business expenses for accounting review.</p>
          </div>
        </div>

        <section className="expenses-section">
          <div className="section-heading">
            <div>
              <h2>Expense Details</h2>
              <p>Enter the details of the expense you want to submit.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="expense-form">
            <div className="form-row">
              <div className="form-group">
                <label>Category</label>

                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category: e.target.value,
                    })
                  }
                >
                  <option value="Meals">Meals</option>
                  <option value="Travel">Travel</option>
                  <option value="Accommodation">Accommodation</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Office">Office</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Currency</label>

                <select
                  value={form.currency}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      currency: e.target.value,
                    })
                  }
                >
                  <option value="AED">AED</option>
                  <option value="USD">USD</option>
                  <option value="PKR">PKR</option>
                  <option value="GBP">GBP</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Amount</label>

                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="210.00"
                  value={form.amount}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      amount: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>VAT Amount</label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="10.00"
                  value={form.vatAmount}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      vatAmount: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Expense Date</label>

                <input
                  type="date"
                  value={form.expenseDate}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      expenseDate: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>

                <input
                  type="text"
                  placeholder="Client lunch"
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {message && <div className="success-message">{message}</div>}

            {error && <div className="error-message">{error}</div>}

            <button
              type="submit"
              className="primary-button expense-submit-button"
              disabled={submitting}
            >
              <Send size={17} />

              {submitting ? 'Submitting...' : 'Submit Expense'}
            </button>
          </form>
        </section>

        {/* My Expenses */}

        <section className="expenses-section">
          <div className="section-heading">
            <div>
              <h2>My Expenses</h2>
              <p>Track the expenses you have submitted.</p>
            </div>
          </div>

          {loading ? (
            <div className="dashboard-loading">Loading your expenses...</div>
          ) : expenses.length === 0 ? (
            <div className="empty-state">
              <Receipt size={32} />

              <h3>No expenses yet</h3>

              <p>Your submitted expenses will appear here.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="expense-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>VAT</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {expenses.map((expense) => (
                    <tr key={expense.id}>
                      <td>{expense.category}</td>

                      <td>{expense.description || '—'}</td>

                      <td>
                        {expense.currency} {Number(expense.amount).toFixed(2)}
                      </td>

                      <td>
                        {expense.currency}{' '}
                        {Number(expense.vatAmount).toFixed(2)}
                      </td>

                      <td>
                        {new Date(expense.expenseDate).toLocaleDateString()}
                      </td>

                      <td>
                        <span
                          className={`status status-${expense.status.toLowerCase()}`}
                        >
                          {expense.status}
                        </span>
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
  );
}

export default EmployeeDashboard;
