import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import ForgotPassword from './pages/ForgotPassword';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Address from './pages/Address';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminUsers from './pages/AdminUsers';
import AdminOrders from './pages/AdminOrders';
import AdminOrderDetails from './pages/AdminOrderDetails';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Unauthorized from './pages/Unauthorized';

function App() {
  return (
    <>
      <Navbar />

      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About/>} />
          <Route path="/forgot-password"element={<ForgotPassword />}
/>
          <Route path="/products" element={<Products />} />
          <Route path="/products/:productId" element={<ProductDetails />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Customer Protected Routes */}
          <Route path="/cart" element={<ProtectedRoute> <Cart /> </ProtectedRoute>  }  />

          <Route path="/address" element={ <ProtectedRoute> <Address /> </ProtectedRoute>  } />

          <Route path="/checkout" element={<ProtectedRoute><Checkout /> </ProtectedRoute>  } />

          <Route path="/payment/:orderId" element={<ProtectedRoute> <Payment /> </ProtectedRoute> } />

          <Route path="/orders" element={<ProtectedRoute> <Orders /> </ProtectedRoute> } />

          <Route path="/orders/:orderId" element={ <ProtectedRoute> <OrderDetails /> </ProtectedRoute> }/>

          {/* Admin Routes */}
         <Route path="/admin" element={ <AdminRoute> <AdminDashboard /> </AdminRoute> }/>

         <Route path="/admin/products" element={ <AdminRoute> <AdminProducts /> </AdminRoute> } />

         <Route path="/admin/users" element={ <AdminRoute> <AdminUsers /> </AdminRoute> } />

         <Route path="/admin/orders" element={ <AdminRoute> <AdminOrders /> </AdminRoute>}/>

         <Route path="/admin/orders/:orderId" element={ <AdminRoute> <AdminOrderDetails /> </AdminRoute> }/> 

        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;