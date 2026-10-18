import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from '../services/api';
import { useAuth } from '../context/useAuth';

function AdminProducts() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search and category filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Reference used to scroll to the product form
  const productFormRef = useRef(null);

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [saving, setSaving] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    quantity: '',
    image: '',
  });

  /*
   * Load products when admin page opens
   */
  useEffect(() => {
    const loadProducts = async () => {
      if (!user || user.role !== 'ADMIN') {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
        setError(err.message || 'Failed to load products.');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [user]);

  /*
   * Smoothly scroll to the form when Add/Edit opens it
   */
  useEffect(() => {
    if (showForm && productFormRef.current) {
      productFormRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [showForm, editingProduct]);

  /*
   * Build the category options from the products currently loaded
   */
  const categories = [
    ...new Set(
      products
        .map((product) => (product.category || '').trim())
        .filter(Boolean)
    ),
  ].sort((a, b) => a.localeCompare(b));

  /*
   * Apply name search and category filter together
   */
  const filteredProducts = products.filter((product) => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const productName = (product.name || '').toLowerCase();
    const productCategory = (product.category || '').trim();

    const matchesSearch = productName.includes(normalizedSearch);
    const matchesCategory =
      !selectedCategory || productCategory === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
  };


  /*
   * Refresh products after add/update/delete
   */
  const refreshProducts = async () => {
    try {
      setError('');

      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message || 'Failed to refresh products.');
    }
  };


  /*
   * Handle form input
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };


  /*
   * Reset product form
   */
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      quantity: '',
      image: '',
    });

    setEditingProduct(null);
    setShowForm(false);
  };


  /*
   * Open Add Product form
   */
  const handleAddClick = () => {
    setEditingProduct(null);

    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      quantity: '',
      image: '',
    });

    setError('');
    setMessage('');
    setShowForm(true);
  };


  /*
   * Open Edit Product form
   */
  const handleEditClick = (product) => {
    setEditingProduct(product);

    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price ?? '',
      category: product.category || '',
      quantity: product.quantity ?? '',
      image: product.image || '',
    });

    setError('');
    setMessage('');
    setShowForm(true);
  };


  /*
   * Add / Update Product
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (saving) {
      return;
    }

    setError('');
    setMessage('');

    /*
     * Basic frontend validation
     */
    const productName = formData.name.trim();
    const category = formData.category.trim();
    const description = formData.description.trim();

    const price = Number(formData.price);
    const quantity = Number(formData.quantity);

    if (!productName) {
      setError('Product name is required.');
      return;
    }

    if (!category) {
      setError('Product category is required.');
      return;
    }

    if (!formData.price || Number.isNaN(price) || price <= 0) {
      setError('Product price must be greater than 0.');
      return;
    }

    if (
      formData.quantity === '' ||
      Number.isNaN(quantity) ||
      quantity < 0
    ) {
      setError('Product quantity cannot be negative.');
      return;
    }

    try {
      setSaving(true);

      const productData = {
        name: productName,
        description,
        price,
        category,
        quantity,
        image: formData.image.trim(),
      };

      if (editingProduct) {
        await updateProduct(
          editingProduct.productId,
          productData
        );

        setMessage('Product updated successfully!');
      } else {
        await addProduct(productData);

        setMessage('Product added successfully!');
      }

      resetForm();

      await refreshProducts();

    } catch (err) {
      setError(err.message || 'Failed to save product.');
    } finally {
      setSaving(false);
    }
  };


  /*
   * Delete Product
   */
  const handleDelete = async (productId) => {
    if (deletingProductId !== null) {
      return;
    }

    const confirmed = window.confirm(
      'Are you sure you want to delete this product?'
    );

    if (!confirmed) {
      return;
    }

    try {
      setError('');
      setMessage('');
      setDeletingProductId(productId);

      await deleteProduct(productId);

      setMessage('Product deleted successfully!');

      await refreshProducts();

    } catch (err) {
      setError(err.message || 'Failed to delete product.');
    } finally {
      setDeletingProductId(null);
    }
  };


  /*
   * Login protection
   */
  if (!user) {
    return (
      <div className="page-message">
        <h1>Admin Products</h1>

        <p>Please login to continue.</p>

        <button onClick={() => navigate('/login')}>
          Login
        </button>
      </div>
    );
  }


  /*
   * Admin protection
   */
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
    <div className="admin-products-page">

      {/* Page Header */}
      <div className="admin-products-header">

        <div>
          <h1>Product Management</h1>

          <p>
            Manage your store products and inventory.
          </p>
        </div>

        <button
          className="add-product-button"
          onClick={handleAddClick}
          disabled={saving}
        >
          + Add Product
        </button>

      </div>


      {/* Success Message */}
      {message && (
        <p className="success-message">
          {message}
        </p>
      )}


      {/* Error Message */}
      {error && (
        <p className="error-message">
          {error}
        </p>
      )}


      {/* Product Form */}
      {showForm && (
        <div
          className="admin-product-form"
          ref={productFormRef}
          style={{ scrollMarginTop: '100px' }}
        >

          <div className="form-header">

            <h2>
              {editingProduct
                ? 'Edit Product'
                : 'Add New Product'}
            </h2>

            <button
              type="button"
              className="close-form-button"
              onClick={resetForm}
              disabled={saving}
            >
              ✕
            </button>

          </div>


          <form onSubmit={handleSubmit}>

            <div className="admin-form-grid">

              {/* Product Name */}
              <div className="form-group">

                <label>
                  Product Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                  disabled={saving}
                />

              </div>


              {/* Category */}
              <div className="form-group">

                <label>
                  Category
                </label>

                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Enter category"
                  required
                  disabled={saving}
                />

              </div>


              {/* Price */}
              <div className="form-group">

                <label>
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                  min="0.01"
                  step="0.01"
                  required
                  disabled={saving}
                />

              </div>


              {/* Quantity */}
              <div className="form-group">

                <label>
                  Quantity
                </label>

                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="Enter quantity"
                  min="0"
                  step="1"
                  required
                  disabled={saving}
                />

              </div>

            </div>


            {/* Description */}
            <div className="form-group">

              <label>
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
                rows="4"
                disabled={saving}
              />

            </div>


            {/* Image URL */}
            <div className="form-group">

              <label>
                Image URL
              </label>

              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="Enter image URL"
                disabled={saving}
              />

            </div>


            {/* Form Buttons */}
            <div className="form-buttons">

              <button
                type="submit"
                className="save-product-button"
                disabled={saving}
              >
                {saving
                  ? editingProduct
                    ? 'Updating...'
                    : 'Adding...'
                  : editingProduct
                    ? 'Update Product'
                    : 'Add Product'}
              </button>


              <button
                type="button"
                className="cancel-product-button"
                onClick={resetForm}
                disabled={saving}
              >
                Cancel
              </button>

            </div>

          </form>

        </div>
      )}


      {/* Product Loading */}
      {loading ? (

        <div className="admin-loading">

          <div className="loading-spinner"></div>

          <p>
            Loading products...
          </p>

        </div>

      ) : products.length === 0 ? (

        /* Empty Products */
        <div className="empty-admin-products">

          <h2>
            No Products Found
          </h2>

          <p>
            Start by adding your first product.
          </p>

        </div>

      ) : (

        <>
          {/* Product Search and Category Filter */}
          <div
            className="admin-product-filters"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '12px',
              margin: '20px 0',
              padding: '16px',
              borderRadius: '12px',
              background: 'var(--card-background, #ffffff)',
              border: '1px solid var(--border-color, #e5e7eb)',
            }}
          >
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products by name..."
              aria-label="Search products by name"
              style={{
                flex: '1 1 220px',
                minWidth: '0',
                padding: '11px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                font: 'inherit',
              }}
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter products by category"
              style={{
                flex: '0 1 220px',
                minWidth: '180px',
                padding: '11px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                background: '#ffffff',
                font: 'inherit',
              }}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {(searchTerm || selectedCategory) && (
              <button
                type="button"
                onClick={clearFilters}
                style={{
                  padding: '11px 14px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  background: 'transparent',
                  backgroundColor: 'red',
                  color: 'white',
                  cursor: 'pointer',
                  font: 'inherit',
                }}
              >
                Clear Filters
              </button>
            )}

            <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>
              Showing {filteredProducts.length} of {products.length} products
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="empty-admin-products">
              <h2>No Matching Products</h2>
              <p>Try a different product name or category, or clear your filters.</p>
              <button type="button" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          ) : (

        /* Product Grid */
        <div className="admin-product-grid">

          {filteredProducts.map((product) => (

            <div
              className="admin-product-card"
              key={product.productId}
            >

              {/* Product Image */}
              {product.image ? (

                <img
                  src={product.image}
                  alt={product.name}
                  className="admin-product-image"
                />

              ) : (

                <div className="no-product-image">
                  No Image
                </div>

              )}


              <div className="admin-product-content">

                <h2>
                  {product.name}
                </h2>


                <p className="admin-product-category">
                  {product.category}
                </p>


                <p className="admin-product-description">
                  {product.description || 'No description available.'}
                </p>


                <div className="admin-product-info">

                  <strong>
                    ₹{Number(product.price || 0).toFixed(2)}
                  </strong>

                  <span>
                    Stock: {product.quantity ?? 0}
                  </span>

                </div>


                {/* Product Actions */}
                <div className="admin-product-actions">

                  <button
                    className="edit-product-button"
                    onClick={() =>
                      handleEditClick(product)
                    }
                    disabled={
                      saving ||
                      deletingProductId !== null
                    }
                  >
                    Edit
                  </button>


                  <button
                    className="delete-product-button"
                    onClick={() =>
                      handleDelete(product.productId)
                    }
                    disabled={
                      saving ||
                      deletingProductId !== null
                    }
                  >
                    {deletingProductId === product.productId
                      ? 'Deleting...'
                      : 'Delete'}
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>
          )}
        </>
      )}

    </div>
  );
}

export default AdminProducts;