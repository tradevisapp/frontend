import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

export const Navbar: React.FC = () => {
  const { isAuthenticated, login, logout, user } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">Auth0 Demo</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            {isAuthenticated && (
              <li className="nav-item">
                <Link className="nav-link" to="/profile">Profile</Link>
              </li>
            )}
          </ul>
          <div className="d-flex">
            {isAuthenticated ? (
              <div className="d-flex align-items-center">
                <span className="text-light me-3">
                  Welcome, {user?.name}
                </span>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => logout()}
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                className="btn btn-outline-success"
                onClick={() => login()}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}; 