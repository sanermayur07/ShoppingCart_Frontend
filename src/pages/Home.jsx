import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-page">
      <h1>Welcome to Shopping Cart</h1>

      <p>
        Shop your favorite products easily and securely
      </p>

      <Link to="/products">
        <button>Shop Now</button>
      </Link>
    </div>
  );
}

export default Home;