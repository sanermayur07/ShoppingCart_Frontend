
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  getProductById,
  addToCart,
  getReviewsByProduct,
  addReview,
  updateReview,
  deleteReview,
} from '../services/api';
import { useAuth } from '../context/useAuth';

function ProductDetails() {
  const { productId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(true);

  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  const [editingReviewId, setEditingReviewId] = useState(null);

  const [reviewError, setReviewError] = useState('');
  const [reviewMessage, setReviewMessage] = useState('');

  // Load product details
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await getProductById(productId);
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  // Load product reviews
  useEffect(() => {
    const loadReviews = async () => {
      try {
        setReviewLoading(true);
        setReviewError('');

        const data = await getReviewsByProduct(productId);
        setReviews(data);
      } catch (err) {
        setReviewError(err.message);
      } finally {
        setReviewLoading(false);
      }
    };

    loadReviews();
  }, [productId]);

  // Add product to cart
  const handleAddToCart = async () => {
    if (!user) {
      setError('Please login to add products to cart.');
      return;
    }

    try {
      setMessage('');
      setError('');

      await addToCart(
        user.userId,
        product.productId,
        quantity
      );

      setMessage('Product added to cart successfully!');
    } catch (err) {
      setError(err.message);
    }
  };

  // Decrease quantity
  const decreaseQuantity = () => {
    setQuantity((currentQuantity) =>
      Math.max(1, currentQuantity - 1)
    );
  };

  // Increase quantity
  const increaseQuantity = () => {
    if (!product) return;

    setQuantity((currentQuantity) =>
      Math.min(product.quantity, currentQuantity + 1)
    );
  };

  // Add or update a review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setReviewError('Please login to write a review.');
      return;
    }

    try {
      setReviewError('');
      setReviewMessage('');

      if (editingReviewId) {
        const updatedReview = await updateReview(
          editingReviewId,
          user.userId,
          {
            userId: user.userId,
            productId: Number(productId),
            rating,
            review: reviewText,
          }
        );

        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review.reviewId === editingReviewId
              ? updatedReview
              : review
          )
        );

        setReviewMessage('Review updated successfully.');
        setEditingReviewId(null);
      } else {
        const newReview = await addReview({
          userId: user.userId,
          productId: Number(productId),
          rating,
          review: reviewText,
        });

        setReviews((prevReviews) => [
          ...prevReviews,
          newReview,
        ]);

        setReviewMessage('Review added successfully.');
      }

      setRating(5);
      setReviewText('');
    } catch (err) {
      setReviewError(err.message);
    }
  };

  // Edit an existing review
  const handleEditReview = (review) => {
    setEditingReviewId(review.reviewId);
    setRating(review.rating);
    setReviewText(review.review || '');

    setReviewMessage('');
    setReviewError('');
  };

  // Delete a review
  const handleDeleteReview = async (reviewId) => {
    try {
      setReviewError('');
      setReviewMessage('');

      await deleteReview(reviewId, user.userId);

      setReviews((prevReviews) =>
        prevReviews.filter(
          (review) => review.reviewId !== reviewId
        )
      );

      setReviewMessage('Review deleted successfully.');
    } catch (err) {
      setReviewError(err.message);
    }
  };

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (total, review) =>
              total + Number(review.rating || 0),
            0
          ) / reviews.length
        ).toFixed(1)
      : '0.0';

  const roundedRating = Math.min(
    5,
    Math.max(0, Math.round(Number(averageRating)))
  );

  if (loading) {
    return (
      <h2 className="page-message">
        Loading product...
      </h2>
    );
  }

  if (error && !product) {
    return (
      <div className="page-message">
        <p className="error-message">{error}</p>

        <Link to="/products">
          <button type="button">Back to Products</button>
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page-message">
        <p>Product not found.</p>
        <Link to="/products">
          <button type="button">Back to Products</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="product-details">

      {/* Back button */}
      <div className="product-details-back-row">
        <button
          type="button"
          className="product-back-button"
          onClick={() => {
            if (window.history.length > 1) {
              navigate(-1);
            } else {
              navigate('/products');
            }
          }}
        >
          <span aria-hidden="true">←</span>
          Back
        </button>
      </div>

      {/* Product details */}
      <div className="product-details-top">

        <div className="product-image-section">
          {product.image ? (
            <div className="product-image-wrapper">
              <img
                src={product.image}
                alt={product.name}
                className="product-detail-image"
              />
            </div>
          ) : (
            <div className="product-image-placeholder">
              No Image Available
            </div>
          )}
        </div>

        <div className="product-info-section">

          <h1>{product.name}</h1>

          {/* Product rating summary */}
          <div className="product-rating-summary">
            <span className="product-stars" aria-label={`${roundedRating} out of 5 stars`}>
              {'★'.repeat(roundedRating)}
              {'☆'.repeat(5 - roundedRating)}
            </span>

            <span className="product-rating-value">
              {averageRating}
            </span>

            <span className="product-review-count">
              ({reviews.length}{' '}
              {reviews.length === 1 ? 'Review' : 'Reviews'})
            </span>
          </div>

          <p className="product-description">
            {product.description}
          </p>

          <h2 className="product-price">
            ₹{product.price}
          </h2>

          <div className="product-category">
            <span className="product-info-label">
              Category:
            </span>
            <span>{product.category}</span>
          </div>

          {/* Stock information */}
          <div className="product-stock-info">
            {product.quantity > 0 ? (
              <>
                <span className="stock-status in-stock">
                  ● In Stock
                </span>
                <span className="stock-quantity">
                  Available: {product.quantity}
                </span>
              </>
            ) : (
              <span className="stock-status out-of-stock">
                ● Out of Stock
              </span>
            )}
          </div>

          {message && (
            <p className="success-message">{message}</p>
          )}

          {error && (
            <p className="error-message">{error}</p>
          )}

          {/* Quantity and Add to Cart */}
          {product.quantity > 0 && (
            <div className="product-purchase-section">

              <div className="quantity-control">
                <label htmlFor="product-quantity">
                  Quantity:
                </label>

                <div className="quantity-buttons">
                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>

                  <input
                    id="product-quantity"
                    type="number"
                    min="1"
                    max={product.quantity}
                    value={quantity}
                    onChange={(e) => {
                      const value = Number(e.target.value);

                      if (!Number.isFinite(value) || value < 1) {
                        setQuantity(1);
                      } else if (value > product.quantity) {
                        setQuantity(product.quantity);
                      } else {
                        setQuantity(value);
                      }
                    }}
                  />

                  <button
                    type="button"
                    onClick={increaseQuantity}
                    disabled={quantity >= product.quantity}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                type="button"
                className="product-add-cart-button"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>

            </div>
          )}

        </div>
      </div>

      {/* Customer reviews */}
      <div className="reviews-section">

        <h2>Customer Reviews</h2>

        {reviewMessage && (
          <p className="success-message">{reviewMessage}</p>
        )}

        {reviewError && (
          <p className="error-message">{reviewError}</p>
        )}

        {/* Add or edit review */}
        {user && (
          <form
            className="review-form"
            onSubmit={handleReviewSubmit}
          >
            <h3>
              {editingReviewId
                ? 'Edit Your Review'
                : 'Write a Review'}
            </h3>

            <label htmlFor="review-rating">Rating:</label>

            <select
              id="review-rating"
              value={rating}
              onChange={(e) =>
                setRating(Number(e.target.value))
              }
            >
              <option value="5">★★★★★ - 5</option>
              <option value="4">★★★★☆ - 4</option>
              <option value="3">★★★☆☆ - 3</option>
              <option value="2">★★☆☆☆ - 2</option>
              <option value="1">★☆☆☆☆ - 1</option>
            </select>

            <label htmlFor="review-text">Review:</label>

            <textarea
              id="review-text"
              value={reviewText}
              maxLength="1000"
              placeholder="Write your review..."
              onChange={(e) =>
                setReviewText(e.target.value)
              }
            />

            <button type="submit">
              {editingReviewId
                ? 'Update Review'
                : 'Submit Review'}
            </button>

            {editingReviewId && (
              <button
                type="button"
                onClick={() => {
                  setEditingReviewId(null);
                  setRating(5);
                  setReviewText('');
                }}
              >
                Cancel
              </button>
            )}
          </form>
        )}

        {/* Reviews list */}
        <div className="reviews-list">
          {reviewLoading ? (
            <p>Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p>
              No reviews yet. Be the first to review this product.
            </p>
          ) : (
            reviews.map((review) => (
              <div
                className="review-card"
                key={review.reviewId}
              >
                <div className="review-header">
                  <strong>{review.userName}</strong>

                  <span className="review-rating">
                    {'★'.repeat(
                      Math.min(5, Math.max(0, Number(review.rating) || 0))
                    )}
                    {'☆'.repeat(
                      5 - Math.min(5, Math.max(0, Number(review.rating) || 0))
                    )}
                  </span>
                </div>

                <p className="review-text">
                  {review.review || 'No comment provided.'}
                </p>

                {user &&
                  user.userId === review.userId && (
                    <div className="review-actions">
                      <button
                        type="button"
                        onClick={() => handleEditReview(review)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteReview(review.reviewId)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  )}
              </div>
            ))
          )}
        </div>

      </div>

      {/* Back button styling */}
      <style>{`
        .product-details-back-row {
          display: flex;
          align-items: center;
          margin-bottom: 18px;
        }

        .product-details .product-back-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 16px;
          border: 1px solid #dbe3f0;
          border-radius: 9px;
          background: #ffffff;
          color: #334155;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease,
            border-color 0.2s ease;
        }

        .product-details .product-back-button:hover {
          background: #eef2ff;
          color: #4f46e5;
          border-color: #c7d2fe;
        }

        .product-details .product-back-button:focus-visible {
          outline: 2px solid #6366f1;
          outline-offset: 3px;
        }

        .product-details .product-back-button span {
          font-size: 18px;
          line-height: 1;
        }
      `}</style>

    </div>
  );
}

export default ProductDetails;
