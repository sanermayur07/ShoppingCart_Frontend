import { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerUser } from '../services/api';
import { FiEye, FiEyeOff } from 'react-icons/fi';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    role: 'CUSTOMER',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [loading, setLoading] = useState(false);

  // Show/Hide password
  const [showPassword, setShowPassword] = useState(false);

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

    // Allow only 10 digits for phone number
    if (name === 'phone') {
      const phoneValue = value.replace(/\D/g, '').slice(0, 10);

      setFormData({
        ...formData,
        phone: phoneValue,
      });

      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  setMessage('');
  setError('');

  // Frontend phone validation
  if (!/^[6-9][0-9]{9}$/.test(formData.phone)) {
    setError('Enter a valid 10 digit Indian phone number.');
    return;
  }

  try {
    setLoading(true);

    const data = await registerUser(formData);

    setMessage('Registration successful!');

    console.log('Registration response:', data);

    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      address: '',
      role: 'CUSTOMER',
    });

    setPasswordStrength('');
    setShowPassword(false);

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
          <h1>Create Account</h1>
          <p>Join us and start shopping</p>
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

          {/* Name */}
          <div className="form-group">
            <label>Name</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Phone */}
          <div className="form-group">
            <label>Phone</label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter 10 digit phone number"
              maxLength="10"
              inputMode="numeric"
              required
            />
          </div>

          {/* Address */}
          <div className="form-group">
            <label>Address</label>

            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your address"
              maxLength="255"
              rows="3"
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>

            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
              />

              <span
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
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

          {/* Register Button */}
          <button
          type="submit"
          className="auth-button"
          disabled={loading}
          >
         {loading ? 'Registering...' : 'Register'}
          </button>

        </form>

        <div className="auth-switch">
          <span>Already have an account?</span>{' '}
          <Link to="/login">Login</Link>
        </div>

      </div>
    </div>
  );
}

export default Register;