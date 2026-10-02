import { FormEvent, useEffect, useState } from 'react';
import { UserPlus, Users } from 'lucide-react';

import Sidebar from '../components/Sidebar';
import { createEmployee, getTeamMembers } from '../services/api';

interface TeamMember {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  role: {
    name: string;
  };
}

function Team() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const company = JSON.parse(localStorage.getItem('company') || '{}');

  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'Employee',
  });

  const loadTeam = async () => {
    try {
      setLoading(true);
      const data = await getTeamMembers();
      setMembers(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Unable to load team members.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeam();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setMessage('');
    setError('');
    setSubmitting(true);

    try {
      await createEmployee(form);

      setMessage('Employee added successfully.');

      setForm({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'Employee',
      });

      await loadTeam();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Unable to add employee.');
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
              {company.name || 'Company'} · Team Management
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
              <h1>Team</h1>
              <p>Manage employees in your company.</p>
            </div>
          </div>

          <section className="expenses-section">
            <div className="section-heading">
              <div>
                <h2>Add Team Member</h2>
                <p>
                  Create an employee or accountant account for your company.
                </p>
              </div>
            </div>

            <form className="expense-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        firstName: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        lastName: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Role</label>

                <select
                  value={form.role}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      role: e.target.value,
                    })
                  }
                >
                  <option value="Employee">Employee</option>
                  <option value="Accountant">Accountant</option>
                </select>
              </div>

              <div className="form-group">
                <label>Temporary Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                  minLength={8}
                  required
                />
              </div>

              {message && <div className="success-message">{message}</div>}

              {error && <div className="error-message">{error}</div>}

              <button
                type="submit"
                className="primary-button expense-submit-button"
                disabled={submitting}
              >
                <UserPlus size={17} />
                {submitting ? 'Adding...' : 'Add Team Member'}
              </button>
            </form>
          </section>

          <section className="expenses-section">
            <div className="section-heading">
              <div>
                <h2>Team Members</h2>
                <p>Employees and users in your company.</p>
              </div>
            </div>

            {loading ? (
              <div className="dashboard-loading">Loading team...</div>
            ) : members.length === 0 ? (
              <div className="empty-state">
                <Users size={32} />
                <h3>No team members yet</h3>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="expense-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                    </tr>
                  </thead>

                  <tbody>
                    {members.map((member) => (
                      <tr key={member.id}>
                        <td>
                          <strong>
                            {member.firstName} {member.lastName}
                          </strong>
                        </td>

                        <td>{member.email}</td>

                        <td>
                          <span
                            className={`status status-${member.role.name.toLowerCase()}`}
                          >
                            {member.role.name}
                          </span>
                        </td>

                        <td>
                          {new Date(member.createdAt).toLocaleDateString()}
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

export default Team;
