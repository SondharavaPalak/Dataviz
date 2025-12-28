import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const NotFound = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const navigate = useNavigate();
  useEffect(() => {
    // Check for valid JWT token
    const token = localStorage.getItem('token');
    if (token) {
          try {
            jwtDecode(token); // will throw if invalid
            setIsLoggedIn(true);
          } catch {
            setIsLoggedIn(false);
          }
        } else {
          setIsLoggedIn(false);
        }
      }, []);
      return(
        <>
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <h1 className="text-6xl font-bold text-blue-700 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Page Not Found</h2>
            <p className="text-gray-500 mb-6">Sorry, the page you are looking for does not exist.</p>
            <Link to={isLoggedIn ? "/analyses" : "/"} className="px-6 py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition">Go Home</Link>
        </div>
        </>
    )
}

export default NotFound;
