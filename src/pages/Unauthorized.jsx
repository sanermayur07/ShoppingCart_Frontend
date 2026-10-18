import { useNavigate } from 'react-router-dom';

function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="page-message">
      <h1>Access Denied</h1>

      <p>
        You do not have permission to access this page.
      </p>

      <button onClick={() => navigate('/products')}>
        Back to Products
      </button>
    </div>
  );
}

export default Unauthorized;