
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../context/useAuth';
import { FiEye, FiEyeOff } from 'react-icons/fi';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Show/Hide password state
  const [showPassword, setShowPassword] = useState(false);

  // Get the current logged-in user and login function
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent login if an account is already logged in
    if (user) {
      setError(
        'You are already logged in. Please log out from your current account before logging in with another account.'
      );
      return;
    }

    setError('');
    setLoading(true);

    try {
      const data = await loginUser(formData);

      console.log('Login response:', data);

      login(data);

      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Do not display the login form when a user is already logged in
  if (user) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Already Logged In</h1>
            <p>
              You are already logged in to your account.
              Please log out before logging in with another account.
            </p>
          </div>

          <button
            type="button"
            className="auth-button"
            onClick={() => navigate('/products')}
          >
            Go to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Login here to continue shopping</p>
        </div>

        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group password-container">
            <label>Password</label>

            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />

              <span
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setShowPassword(!showPassword);
                  }
                }}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>
          </div>

          <div className="forgot-password">
            <Link to="/forgot-password">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

        </form>

        <div className="auth-switch">
          <span>New user?</span>{' '}
          <Link to="/register">Create an account</Link>
        </div>

      </div>
    </div>
  );
}

export default Login;