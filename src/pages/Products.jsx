
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getAllProducts,
  searchProducts,
  getProductsByCategory,
  getReviewsByProduct,
  addToCart,
} from '../services/api';
import { useAuth } from '../context/useAuth';

function Products() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState('');
  const [category, setCategory] = useState('');

  const { user } = useAuth();

  // Load actual customer ratings for each product
  const loadProductsWithRatings = async (productList) => {
    if (!Array.isArray(productList)) {
      return [];
    }

    return Promise.all(
      productList.map(async (product) => {
        try {
          const reviews = await getReviewsByProduct(
            product.productId
          );

          const validReviews = Array.isArray(reviews)
            ? reviews.filter(
                (review) =>
                  review.rating !== null &&
                  review.rating !== undefined &&
                  Number.isFinite(Number(review.rating)) &&
                  Number(review.rating) >= 1 &&
                  Number(review.rating) <= 5
              )
            : [];

          const averageRating =
            validReviews.length > 0
              ? validReviews.reduce(
                  (total, review) =>
                    total + Number(review.rating),
                  0
                ) / validReviews.length
              : null;

          return {
            ...product,
            averageRating,
            reviewCount: validReviews.length,
          };
        } catch {
          // A rating failure must not break product browsing.
          return {
            ...product,
            averageRating: null,
            reviewCount: null,
          };
        }
      })
    );
  };

  // Load all products
  const loadAllProducts = async () => {
    try {
      setLoading(true);
      setError('');
      setMessage('');

      const data = await getAllProducts();
      const productsWithRatings =
        await loadProductsWithRatings(data);

      setProducts(productsWithRatings);
    } catch (err) {
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Load products when the page opens
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await getAllProducts();
        const productsWithRatings =
          await loadProductsWithRatings(data);

        setProducts(productsWithRatings);
      } catch (err) {
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Search products
  const handleSearch = async () => {
    const searchValue = searchText.trim();

    if (!searchValue) {
      loadAllProducts();
      return;
    }

    try {
      setLoading(true);
      setError('');
      setMessage('');

      const data = await searchProducts(searchValue);
      const productsWithRatings =
        await loadProductsWithRatings(data);

      setProducts(productsWithRatings);
    } catch (err) {
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter by category
  const handleCategoryChange = async (e) => {
    const selectedCategory = e.target.value;

    setCategory(selectedCategory);

    if (!selectedCategory) {
      loadAllProducts();
      return;
    }

    try {
      setLoading(true);
      setError('');
      setMessage('');

      const data = await getProductsByCategory(
        selectedCategory
      );

      const productsWithRatings =
        await loadProductsWithRatings(data);

      setProducts(productsWithRatings);
    } catch (err) {
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Clear search and category filters
  const handleClearFilters = () => {
    setSearchText('');
    setCategory('');
    setMessage('');
    setError('');

    loadAllProducts();
  };

  // Add product to cart
  const handleAddToCart = async (productId) => {
    if (!user) {
      setError('Please login to add products to cart.');
      return;
    }

    try {
      setMessage('');
      setError('');

      await addToCart(user.userId, productId, 1);

      setMessage('Product added to cart successfully!');
    } catch (err) {
      setError(err.message);
    }
  };

  // Display customer rating
  const renderRating = (product) => {
    const rating = product.averageRating;
    const reviewCount = product.reviewCount;

    if (rating === null || rating === undefined) {
      return (
        <div
          className="product-rating"
          aria-label="No ratings available"
        >
          <span className="product-no-rating">
            No ratings yet
          </span>
        </div>
      );
    }

    return (
      <div
        className="product-rating"
        aria-label={`Rated ${rating.toFixed(1)} out of 5`}
      >
        <span
          className="product-rating-stars"
          aria-hidden="true"
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={
                star <= Math.round(rating)
                  ? 'rating-star filled'
                  : 'rating-star'
              }
            >
              ★
            </span>
          ))}
        </span>

        <span className="product-rating-value">
          {rating.toFixed(1)}
        </span>

        {reviewCount !== null &&
          reviewCount !== undefined && (
            <span className="product-review-count">
              ({reviewCount}{' '}
              {reviewCount === 1 ? 'review' : 'reviews'})
            </span>
          )}
      </div>
    );
  };

  if (loading) {
    return (
      <h2 className="page-message">
        Loading products...
      </h2>
    );
  }

  return (
    <div className="products-page">
      <h1>Products</h1>

      {/* Search and filter section */}
      <div className="product-filters">
        <div className="product-search">
          <input
            type="text"
            value={searchText}
            onChange={(e) =>
              setSearchText(e.target.value)
            }
            placeholder="Search products..."
          />

          <button onClick={handleSearch}>
            Search
          </button>
        </div>

        <div className="category-filter">
          <select
            value={category}
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothes">Clothes</option>
            <option value="Beauty">Beauty</option>
            <option value="Shoes">Shoes</option>
            <option value="Watch">Watch</option>
            <option value="Eyeglasses">Eyeglasses</option>
            <option value="Fitness">Fitness</option>
          </select>
        </div>

        <button
          className="clear-filter-button"
          onClick={handleClearFilters}
        >
          Clear
        </button>
      </div>

      {message && (
        <p className="success-message">{message}</p>
      )}

      {error && (
        <p className="error-message">{error}</p>
      )}

      {/* Product grid */}
      {products.length === 0 ? (
        <div className="page-message">
          <h2>No products found</h2>
          <p>Try another search or category</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div
              className="product-card"
              key={product.productId}
            >
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
              )}

              <h2 className="product-title">
                {product.name}
              </h2>

              <p className="product-description">
                {product.description}
              </p>

              {/* Customer rating */}
              {renderRating(product)}

              {/* Aligned product information */}
              <div className="product-meta">
                <p className="product-price">
                  ₹{product.price}
                </p>

                <p className="product-category">
                  Category: {product.category}
                </p>

                <p className="product-availability">
                  Available: {product.quantity}
                </p>
              </div>

              {/* Product actions */}
              <div className="product-buttons">
                <Link
                  to={`/products/${product.productId}`}
                  className="product-details-link"
                >
                  <button type="button">
                    View Details
                  </button>
                </Link>

                <button
                  onClick={() =>
                    handleAddToCart(product.productId)
                  }
                  disabled={product.quantity <= 0}
                >
                  {product.quantity <= 0
                    ? 'Out of Stock'
                    : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Compact product card styling */}
      <style>{`
        .products-page .product-grid {
          align-items: stretch;
        }

        .products-page .product-card {
          display: flex;
          flex-direction: column;
          height: 100%;
          min-width: 0;
          box-sizing: border-box;
          padding: 14px;
        }

        /* Consistent image height */
        .products-page .product-image {
          display: block;
          width: 100%;
          height: 150px;
          object-fit: contain;
          margin: 0 0 8px;
        }

        /* Equal title space */
        .products-page .product-title {
          font-size: 18px;
          line-height: 1.3;
          margin: 4px 0 8px;
          min-height: 47px;
        }

        /* Limit description height to reduce card size */
        .products-page .product-description {
          font-size: 13px;
          line-height: 1.45;
          height: 56.5px;
          margin: 0 0 7px;
          overflow: hidden;
          overflow-wrap: anywhere;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          line-clamp: 3;
        }

        /* Align ratings and review counts */
        .products-page .product-rating {
          display: flex;
          align-items: center;
          flex-wrap: nowrap;
          gap: 5px;
          height: 22px;
          min-width: 0;
          margin: 4px 0 8px;
          white-space: nowrap;
        }

        .products-page .product-rating-stars {
          display: inline-flex;
          align-items: center;
          gap: 1px;
          flex-shrink: 0;
        }

        .products-page .rating-star {
          color: #d1d5db;
          font-size: 16px;
          line-height: 1;
        }

        .products-page .rating-star.filled {
          color: #f5a623;
        }

        .products-page .product-rating-value {
          color: #26384a;
          font-size: 12px;
          font-weight: 700;
          flex-shrink: 0;
        }

        .products-page .product-review-count {
          color: #687787;
          font-size: 11px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .products-page .product-no-rating {
          color: #7b8794;
          font-size: 12px;
        }

        /* Price, category and quantity stay in sequence */
        .products-page .product-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          margin-top: auto;
          padding-top: 4px;
        }

        .products-page .product-meta p {
          margin: 0 0 10px;
          font-size: 13px;
          line-height: 1.4;
          overflow-wrap: anywhere;
        }

        .products-page .product-meta .product-price {
          color: #2864e8;
          font-size: 21px;
          font-weight: 800;
          margin-bottom: 10px;
        }

        /* Consistent bottom-aligned actions */
        .products-page .product-buttons {
          display: flex;
          align-items: stretch;
          gap: 8px;
          margin-top: 8px;
        }

        .products-page .product-details-link {
          display: flex;
          flex-shrink: 0;
          text-decoration: none;
        }

        .products-page .product-buttons button {
          min-width: 0;
          padding: 9px 10px;
          font-size: 12px;
          cursor: pointer;
        }

        .products-page .product-buttons button:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        @media (max-width: 600px) {
          .products-page .product-image {
            height: 140px;
          }

          .products-page .product-title {
            font-size: 17px;
          }

          .products-page .product-meta .product-price {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
}

export default Products;
