import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/useAuth';
import { api } from '../services/api';

export const HomePage: React.FC = () => {
  const { isAuthenticated, login, logout, user } = useAuth();
  const [publicData, setPublicData] = useState<any>(null);
  
  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const data = await api.getPublicData();
        setPublicData(data);
      } catch (error) {
        console.error('Error fetching public data:', error);
      }
    };

    fetchPublicData();
  }, []);

  return (
    <div className="container mt-5">
      <h1>Auth0 Demo App</h1>
      <div className="row mt-4">
        <div className="col-12 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Authentication Status</h5>
              {isAuthenticated ? (
                <div>
                  <p>You are logged in!</p>
                  <p>
                    <strong>Name:</strong> {user?.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {user?.email}
                  </p>
                  <button 
                    className="btn btn-danger" 
                    onClick={() => logout()}
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <div>
                  <p>You are not logged in. Click the button below to log in.</p>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => login()}
                  >
                    Log In
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-12 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Public API Response</h5>
              {publicData ? (
                <pre>{JSON.stringify(publicData, null, 2)}</pre>
              ) : (
                <p>Loading public data...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 