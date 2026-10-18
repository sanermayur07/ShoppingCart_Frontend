import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers } from '../services/api';
import { useAuth } from '../context/useAuth';

function AdminUsers() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');

useEffect(() => {
  if (!user || user.role !== 'ADMIN') {
    return;
  }

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchUsers();
}, [user]);

  const search = searchTerm.toLowerCase().trim();

const filteredUsers = users.filter((item) =>
  String(item.userId).includes(search) ||
  (item.name || '').toLowerCase().includes(search) ||
  (item.email || '').toLowerCase().includes(search) ||
  (item.phone || '').toLowerCase().includes(search) ||
  (item.role || '').toLowerCase().includes(search)
);

  if (!user) {
    return (
      <div className="page-message">
        <h1>Admin Users</h1>

        <p>Please login to continue.</p>

        <button onClick={() => navigate('/login')}>
          Login
        </button>
      </div>
    );
  }

  if (user.role !== 'ADMIN') {
    return (
      <div className="page-message">
        <h1>Access Denied</h1>

        <p>
          Only administrators can access this page.
        </p>
      </div>
    );
  }

  return (
    <div className="admin-users-page">

      <div className="admin-users-header">

        <div>
          <h1>User Management</h1>

          <p>
            View and manage registered users.
          </p>
        </div>

        <div className="user-count">
          Total Users: <strong>{users.length}</strong>
        </div>

      </div>

      {error && (
        <div className="admin-error">
          {error}
        </div>
      )}

      <div className="user-search-container">

        <input
          type="text"
          placeholder="Search by name, email, phone or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <span className="search-icon">
          🔍
        </span>

      </div>

      {loading ? (

        <div className="admin-users-loading">

          <div className="loading-spinner"></div>

          <p>Loading users...</p>

        </div>

      ) : filteredUsers.length === 0 ? (

        <div className="no-users">

          <h2>No Users Found</h2>

          <p>
            {searchTerm
              ? 'No users match your search.'
              : 'There are no registered users.'}
          </p>

        </div>

      ) : (

        <div className="users-table-container">

          <table className="users-table">

            <thead>

              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
              </tr>

            </thead>

            <tbody>

              {filteredUsers.map((item) => (

                <tr key={item.userId}>

                  <td>
                    #{item.userId}
                  </td>

                  <td>
                    <div className="user-name-cell">

                      <div className="user-avatar">
                        {item.name
                          ? item.name.charAt(0).toUpperCase()
                          : 'U'}
                      </div>

                      <span>
                        {item.name || 'N/A'}
                      </span>

                    </div>
                  </td>

                  <td>
                    {item.email || 'N/A'}
                  </td>

                  <td>
                    {item.phone || 'N/A'}
                  </td>

                  <td>

                    <span
                      className={
                        item.role === 'ADMIN'
                          ? 'role-badge admin-role'
                          : 'role-badge customer-role'
                      }
                    >
                      {item.role || 'USER'}
                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}

export default AdminUsers;