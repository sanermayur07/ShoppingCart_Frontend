import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/api';
import { FiEye, FiEyeOff } from 'react-icons/fi';

function ForgotPassword() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Show/Hide password states
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');

  const checkPasswordStrength = (password) => {
  if (password.length === 0) {
    return '';
  }

  if (password.length < 6) {
    return 'Weak';
  }

  if (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password)
  ) {
    return 'Strong';
  }

  return 'Medium';
};

  const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData({
    ...formData,
    [name]: value,
  });

  if (name === 'newPassword') {
    setPasswordStrength(checkPasswordStrength(value));
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage('');
    setError('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);

      await resetPassword({
        email: formData.email,
        newPassword: formData.newPassword,
      });

      setMessage('Password reset successfully.');

      setFormData({
        email: '',
        newPassword: '',
        confirmPassword: '',
      });

      setShowNewPassword(false);
      setShowConfirmPassword(false);
      setPasswordStrength('');

      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-header">
          <h1>Forgot Password?</h1>

          <p>
            Enter your email and create a new password.
          </p>
        </div>

        {message && (
          <p className="success-message">
            {message}
          </p>
        )}

        {error && (
          <p className="error-message">
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
              placeholder="Enter your registered email"
              required
            />
          </div>

          {/* New Password */}
          <div className="form-group">
            <label>New Password</label>

            <div className="password-input-wrapper">
              <input
                type={showNewPassword ? 'text' : 'password'}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
                required
              />

              <span
                className="password-toggle"
                onClick={() => setShowNewPassword(!showNewPassword)}
                title={showNewPassword ? 'Hide password' : 'Show password'}
              >
                {showNewPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>

              {passwordStrength && (
              <p
                className={`password-strength ${passwordStrength.toLowerCase()}`}
              >
                Password strength: {passwordStrength}
             </p>
             )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label>Confirm Password</label>

            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                required
              />

              <span
                className="password-toggle"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                title={
                  showConfirmPassword
                    ? 'Hide password'
                    : 'Show password'
                }
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>

        </form>

        <div className="auth-switch">
          <span>Remember your password?</span>{' '}
          <Link to="/login">Login</Link>
        </div>

      </div>
    </div>
  );
}

export default ForgotPassword;