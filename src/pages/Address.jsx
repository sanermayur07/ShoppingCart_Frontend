import { useEffect, useState } from 'react';
import { useAuth } from '../context/useAuth';
import {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
} from '../services/api';

function Address() {
  const { user } = useAuth();

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    addressType: 'HOME',
    isDefault: false,
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
  if (!user) {
    return;
  }

  const loadAddresses = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await getAddresses(user.userId);

      setAddresses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  loadAddresses();
}, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'phone') {
      const phoneValue = value
        .replace(/\D/g, '')
        .slice(0, 10);

      setFormData({
        ...formData,
        phone: phoneValue,
      });

      return;
    }

    if (name === 'postalCode') {
      const postalValue = value
        .replace(/\D/g, '')
        .slice(0, 6);

      setFormData({
        ...formData,
        postalCode: postalValue,
      });

      return;
    }

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      phone: '',
      addressLine: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
      addressType: 'HOME',
      isDefault: false,
    });

    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setMessage('');

    // Phone validation
    if (!/^[6-9][0-9]{9}$/.test(formData.phone)) {
      setError(
        'Enter a valid 10 digit Indian phone number.'
      );
      return;
    }

    // Postal code validation
    if (!/^[0-9]{6}$/.test(formData.postalCode)) {
      setError(
        'Enter a valid 6 digit postal code.'
      );
      return;
    }

    // Prevent duplicate requests
    if (actionLoading) {
      return;
    }

    try {
      setActionLoading(true);

      if (editingId) {
        await updateAddress(
          user.userId,
          editingId,
          formData
        );

        setMessage(
          'Address updated successfully.'
        );
      } else {
        await addAddress(
          user.userId,
          formData
        );

        setMessage(
          'Address added successfully.'
        );
      }

      // Reload addresses after add/update
      const data = await getAddresses(user.userId);
      setAddresses(data);

      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (address) => {
    setEditingId(address.addressId);

    setFormData({
      fullName: address.fullName || '',
      phone: address.phone || '',
      addressLine: address.addressLine || '',
      city: address.city || '',
      state: address.state || '',

      // Fixed: postalCode instead of pinCode
      postalCode: address.postalCode || '',

      country: address.country || 'India',
      addressType: address.addressType || 'HOME',
      isDefault: address.isDefault || false,
    });

    setMessage('');
    setError('');
  };

  const handleDelete = async (addressId) => {
    if (actionLoading) {
      return;
    }

    const confirmed = window.confirm(
      'Are you sure you want to delete this address?'
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);
      setError('');
      setMessage('');

      await deleteAddress(
        user.userId,
        addressId
      );

      const data = await getAddresses(
        user.userId
      );

      setAddresses(data);

      setMessage(
        'Address deleted successfully.'
      );

      // If deleted address was being edited,
      // reset the form.
      if (editingId === addressId) {
        resetForm();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="page-message">
        <h1>My Addresses</h1>
        <p>
          Please login to manage your addresses.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <h2 className="page-message">
        Loading addresses...
      </h2>
    );
  }

  return (
    <div className="address-page">
      <h1>My Addresses</h1>

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

      {/* ADD / UPDATE ADDRESS */}
      <div className="address-form">
        <h2>
          {editingId
            ? 'Update Address'
            : 'Add New Address'}
        </h2>

        <form onSubmit={handleSubmit}>

          {/* Full Name */}
          <div className="form-group">
            <label>Full Name</label>

            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
              required
              disabled={actionLoading}
            />
          </div>

          {/* Phone */}
          <div className="form-group">
            <label>Phone</label>

            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter 10-digit phone number"
              maxLength="10"
              inputMode="numeric"
              required
              disabled={actionLoading}
            />
          </div>

          {/* Address */}
          <div className="form-group">
            <label>Address</label>

            <input
              type="text"
              name="addressLine"
              value={formData.addressLine}
              onChange={handleChange}
              placeholder="Enter address"
              required
              disabled={actionLoading}
            />
          </div>

          {/* City */}
          <div className="form-group">
            <label>City</label>

            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter city"
              required
              disabled={actionLoading}
            />
          </div>

          {/* State */}
          <div className="form-group">
            <label>State</label>

            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="Enter state"
              required
              disabled={actionLoading}
            />
          </div>

          {/* Postal Code */}
          <div className="form-group">
            <label>Postal Code</label>

            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="Enter 6-digit postal code"
              maxLength="6"
              inputMode="numeric"
              required
              disabled={actionLoading}
            />
          </div>

          {/* Country */}
          <div className="form-group">
            <label>Country</label>

            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              disabled={actionLoading}
            />
          </div>

          {/* Address Type */}
          <div className="form-group">
            <label>Address Type</label>

            <select
              name="addressType"
              value={formData.addressType}
              onChange={handleChange}
              disabled={actionLoading}
            >
              <option value="HOME">
                Home
              </option>

              <option value="OFFICE">
                Office
              </option>

              <option value="OTHER">
                Other
              </option>
            </select>
          </div>

          {/* Default Address */}
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
                disabled={actionLoading}
              />

              Set as default address
            </label>
          </div>

          <button
            type="submit"
            disabled={actionLoading}
          >
            {actionLoading
              ? editingId
                ? 'Updating...'
                : 'Adding...'
              : editingId
                ? 'Update Address'
                : 'Add Address'}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              disabled={actionLoading}
            >
              Cancel
            </button>
          )}

        </form>
      </div>

      {/* SAVED ADDRESSES */}
      <div className="saved-addresses">
        <h2>Saved Addresses</h2>

        {addresses.length === 0 ? (
          <p>
            No addresses saved. Add your first
            address above.
          </p>
        ) : (
          addresses.map((address) => (
            <div
              className="address-card"
              key={address.addressId}
            >
              <h3>
                {address.addressType}
                {address.isDefault &&
                  ' - Default'}
              </h3>

              <p>
                <strong>Name:</strong>{' '}
                {address.fullName}
              </p>

              <p>
                <strong>Phone:</strong>{' '}
                {address.phone}
              </p>

              <p>
                <strong>Address:</strong>{' '}
                {address.addressLine}
              </p>

              <p>
                <strong>City:</strong>{' '}
                {address.city}
              </p>

              <p>
                <strong>State:</strong>{' '}
                {address.state}
              </p>

              <p>
                <strong>Pin Code:</strong>{' '}
                {address.postalCode}
              </p>

              <p>
                <strong>Country:</strong>{' '}
                {address.country}
              </p>

              <div className="address-buttons">

                <button
                  type="button"
                  onClick={() =>
                    handleEdit(address)
                  }
                  disabled={actionLoading}
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleDelete(
                      address.addressId
                    )
                  }
                  disabled={actionLoading}
                >
                  {actionLoading
                    ? 'Processing...'
                    : 'Delete'}
                </button>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Address;