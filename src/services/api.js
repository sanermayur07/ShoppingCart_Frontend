const API_BASE_URL = 'https://backend-project-2daz.onrender.com';

export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Registration failed');
  }

  return data;
};

export const loginUser = async (loginData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(loginData),
  });

  const data = await response.json();

  if (!response.ok) {
  throw new Error(
    data.message ||
    data.detail ||
    'Login failed'
  );
}

  return data;
};

export const resetPassword = async (resetData) => {
  const response = await fetch(
    `${API_BASE_URL}/api/users/reset-password`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(resetData),
    }
  );

  const text = await response.text();

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    data = { message: text };
  }

  if (!response.ok) {
    throw new Error(
      data.message || 'Password reset failed'
    );
  }

  return data;
};

export const getAllProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/api/products`, {
    method: 'GET',
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch products');
  }

  return data;
};

export const getProductById = async (productId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/products/${productId}`,
    {
      method: 'GET',
      credentials: 'include',
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch product');
  }

  return data;
};

export const searchProducts = async (name) => {
  const response = await fetch(
    `${API_BASE_URL}/api/products/search?name=${encodeURIComponent(name)}`,
    {
      method: 'GET',
      credentials: 'include',
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to search products');
  }

  return data;
};

export const getProductsByCategory = async (category) => {
  const response = await fetch(
    `${API_BASE_URL}/api/products/category/${encodeURIComponent(category)}`,
    {
      method: 'GET',
      credentials: 'include',
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch category products');
  }

  return data;
};

export const addToCart = async (userId, productId, quantity) => {
  const response = await fetch(
    `${API_BASE_URL}/api/cart/add?userId=${userId}&productId=${productId}&quantity=${quantity}`,
    {
      method: 'POST',
      credentials: 'include',
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to add product to cart');
  }

  return data;
};

export const updateCartQuantity = async (
  userId,
  cartItemId,
  quantity
) => {
  const response = await fetch(
    `${API_BASE_URL}/api/cart/update?userId=${userId}&cartItemId=${cartItemId}&quantity=${quantity}`,
    {
      method: 'PUT',
      credentials: 'include',
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update cart quantity');
  }

  return data;
};

export const getCart = async (userId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/cart?userId=${userId}`,
    {
      method: 'GET',
      credentials: 'include',
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch cart');
  }

  return data;
};


export const getCartItems = async (userId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/cart/items?userId=${userId}`,
    {
      method: 'GET',
      credentials: 'include',
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch cart items');
  }

  return data;
};


export const getCartTotal = async (userId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/cart/total?userId=${userId}`,
    {
      method: 'GET',
      credentials: 'include',
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch cart total');
  }

  return data;
};


export const removeCartItem = async (userId, cartItemId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/cart/remove/${cartItemId}?userId=${userId}`,
    {
      method: 'DELETE',
      credentials: 'include',
    }
  );

  const data = await response.text();

  if (!response.ok) {
    throw new Error(data || 'Failed to remove cart item');
  }

  return data;
};


export const clearCart = async (userId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/cart/clear?userId=${userId}`,
    {
      method: 'DELETE',
      credentials: 'include',
    }
  );

  const data = await response.text();

  if (!response.ok) {
    throw new Error(data || 'Failed to clear cart');
  }

  return data;
};

export const addAddress = async (userId, addressData) => {
  const response = await fetch(
    `${API_BASE_URL}/api/addresses?userId=${userId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(addressData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to add address');
  }

  return data;
};

export const getAddresses = async (userId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/addresses?userId=${userId}`,
    {
      method: 'GET',
      credentials: 'include',
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch addresses');
  }

  return data;
};

export const getAddressById = async (userId, addressId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/addresses/${addressId}?userId=${userId}`,
    {
      method: 'GET',
      credentials: 'include',
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch address');
  }

  return data;
};

export const updateAddress = async (userId, addressId, addressData) => {
  const response = await fetch(
    `${API_BASE_URL}/api/addresses/${addressId}?userId=${userId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(addressData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update address');
  }

  return data;
};

export const deleteAddress = async (userId, addressId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/addresses/${addressId}?userId=${userId}`,
    {
      method: 'DELETE',
      credentials: 'include',
    }
  );

  const data = await response.text();

  if (!response.ok) {
    throw new Error(data || 'Failed to delete address');
  }

  return data;
};

export const checkoutOrder = async (userId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/orders/checkout?userId=${userId}`,
    {
      method: 'POST',
      credentials: 'include',
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to place order');
  }

  return data;
};

export const getOrderById = async (orderId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/orders/${orderId}`,
    {
      method: 'GET',
      credentials: 'include',
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch order');
  }

  return data;
};

export const getUserOrders = async (userId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/orders/user/${userId}`,
    {
      method: 'GET',
      credentials: 'include',
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch orders');
  }

  return data;
};

export const processPayment = async (paymentData) => {
  const response = await fetch(
    `${API_BASE_URL}/api/payment/process`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(paymentData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || 'Payment failed'
    );
  }

  return data;
};

export const getPaymentByOrderId = async (orderId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/payment/order/${orderId}`,
    {
      method: 'GET',
      credentials: 'include',
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch payment');
  }

  return data;
};

export const addProduct = async (productData) => {
  const response = await fetch(`${API_BASE_URL}/api/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(productData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to add product');
  }

  return data;
};


export const updateProduct = async (productId, productData) => {
  const response = await fetch(
    `${API_BASE_URL}/api/products/${productId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(productData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update product');
  }

  return data;
};


export const deleteProduct = async (productId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/products/${productId}`,
    {
      method: 'DELETE',
      credentials: 'include',
    }
  );

  const data = await response.text();

  if (!response.ok) {
    throw new Error(data || 'Failed to delete product');
  }

  return data;
};

export const getAllUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/api/users`, {
    method: 'GET',
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch users');
  }

  return data;
};

export const getAllOrders = async () => {
  const response = await fetch(`${API_BASE_URL}/api/orders`, {
    method: 'GET',
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch orders');
  }

  return data;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await fetch(
    `${API_BASE_URL}/api/orders/${orderId}/status?status=${status}`,
    {
      method: 'PUT',
      credentials: 'include',
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update order status');
  }

  return data;
};

// ================================
// REVIEW APIs
// ================================

export const getReviewsByProduct = async (productId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/reviews/product/${productId}`,
    {
      method: 'GET',
      credentials: 'include',
    }
  );

  // Read the response as text first.
  const responseText = await response.text();

  let data = [];

  // Parse JSON only when the response contains a body.
  if (responseText.trim()) {
    try {
      data = JSON.parse(responseText);
    } catch {
      throw new Error(
        response.ok
          ? 'The server returned an invalid review response.'
          : `Failed to fetch reviews. HTTP ${response.status}`
      );
    }
  }

  // Handle HTTP errors after reading the response.
  if (!response.ok) {
    throw new Error(
      data?.message ||
      `Failed to fetch reviews. HTTP ${response.status}`
    );
  }

  // A successful response with no body means no reviews to display.
  return data;
};


export const addReview = async (reviewData) => {
  const response = await fetch(
    `${API_BASE_URL}/api/reviews`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(reviewData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to add review');
  }

  return data;
};


export const updateReview = async (
  reviewId,
  userId,
  reviewData
) => {
  const response = await fetch(
    `${API_BASE_URL}/api/reviews/${reviewId}?userId=${userId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(reviewData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update review');
  }

  return data;
};


export const deleteReview = async (reviewId, userId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/reviews/${reviewId}?userId=${userId}`,
    {
      method: 'DELETE',
      credentials: 'include',
    }
  );

  const data = await response.text();

  if (!response.ok) {
    throw new Error(data || 'Failed to delete review');
  }

  return data;
};