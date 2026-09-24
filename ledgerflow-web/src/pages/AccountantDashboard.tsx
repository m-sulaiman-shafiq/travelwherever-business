import { useEffect, useState } from 'react';
import {
  Check,
  Clock3,
  DollarSign,
  LogOut,
  Receipt,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import {
  approveExpense,
  getCompanyExpenses,
  getSummary,
  rejectExpense,
} from '../services/api';

interface Expense {
  id: string;
  category: string;
  description?: string;
  amount: string;
  vatAmount: string;
  currency: string;
  expenseDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  employee: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface Summary {
  totalExpenses: number;
  pending: number;
  approved: number;
  rejected: number;
  totalAmount: number;
  totalVat: number;
}

function AccountantDashboard() {
  const navigate = useNavigate();

  const [summary, setSummary] = useState<Summary | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const company = JSON.parse(localStorage.getItem('company') || '{}');

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [summaryData, expensesData] = await Promise.all([
        getSummary(),
        getCompanyExpenses(),
      ]);

      setSummary(summaryData);
      setExpenses(expensesData);
    } catch (error) {
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      setProcessingId(id);
      await approveExpense(id);
      await loadDashboard();
    } catch (error) {
      console.error('Approve error:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    try {
      setProcessingId(id);
      await rejectExpense(id);
      await loadDashboard();
    } catch (error) {
      console.error('Reject error:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('company');

    navigate('/login');
  };

  if (loading) {
    return <div className="dashboard-loading">Loading LedgerFlow...</div>;
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <div className="dashboard-brand">
            <div className="brand-mark">L</div>
            <span>LedgerFlow</span>
          </div>

          <p className="company-name">
            {company.name || 'Company'} · Accountant Dashboard
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
        <div className="dashboard-title">
          <div>
            <h1>Expense Overview</h1>
            <p>Review and manage your company's expenses.</p>
          </div>
        </div>

        <section className="summary-grid">
          <div className="summary-card">
            <div className="summary-icon">
              <Receipt size={20} />
            </div>

            <div>
              <span>Total Expenses</span>
              <strong>{summary?.totalExpenses ?? 0}</strong>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">
              <Clock3 size={20} />
            </div>

            <div>
              <span>Pending</span>
              <strong>{summary?.pending ?? 0}</strong>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">
              <Check size={20} />
            </div>

            <div>
              <span>Approved</span>
              <strong>{summary?.approved ?? 0}</strong>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">
              <DollarSign size={20} />
            </div>

            <div>
              <span>Total Amount</span>
              <strong>
                AED {Number(summary?.totalAmount ?? 0).toFixed(2)}
              </strong>
            </div>
          </div>
        </section>

        <section className="expenses-section">
          <div className="section-heading">
            <div>
              <h2>Recent Expenses</h2>
              <p>Review submitted employee expenses.</p>
            </div>
          </div>

          {expenses.length === 0 ? (
            <div className="empty-state">
              <Receipt size={32} />
              <h3>No expenses yet</h3>
              <p>Employee expenses will appear here.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="expense-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>VAT</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {expenses.map((expense) => (
                    <tr key={expense.id}>
                      <td>
                        <strong>
                          {expense.employee.firstName}{' '}
                          {expense.employee.lastName}
                        </strong>
                      </td>

                      <td>{expense.category}</td>

                      <td>{expense.description || '—'}</td>

                      <td>
                        {expense.currency}{' '}
                        {Number(expense.amount).toFixed(2)}
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

                      <td>
                        {expense.status === 'PENDING' ? (
                          <div className="action-buttons">
                            <button
                              className="approve-button"
                              disabled={processingId === expense.id}
                              onClick={() => handleApprove(expense.id)}
                            >
                              <Check size={15} />
                              Approve
                            </button>

                            <button
                              className="reject-button"
                              disabled={processingId === expense.id}
                              onClick={() => handleReject(expense.id)}
                            >
                              <X size={15} />
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="processed-text">
                            Processed
                          </span>
                        )}
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

export default AccountantDashboard;