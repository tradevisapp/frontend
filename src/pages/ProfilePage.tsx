import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { api } from '../services/api';

export const ProfilePage: React.FC = () => {
  const { user, getAccessToken } = useAuth();
  const [privateData, setPrivateData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrivateData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const token = await getAccessToken();
        const data = await api.getPrivateData(token);
        setPrivateData(data);
      } catch (error) {
        console.error('Error fetching private data:', error);
        setError('Failed to fetch protected data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrivateData();
  }, [getAccessToken]);

  return (
    <div className="container mt-5">
      <h1>Profile Page</h1>
      <p className="lead">This is a protected page that requires authentication.</p>
      
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">User Profile</h5>
          {user ? (
            <div>
              {user.picture && (
                <img 
                  src={user.picture} 
                  alt="Profile" 
                  className="rounded-circle mb-3" 
                  width="100" 
                />
              )}
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Email Verified:</strong> {user.email_verified ? 'Yes' : 'No'}</p>
            </div>
          ) : (
            <p>Loading user profile...</p>
          )}
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Protected API Data</h5>
          {isLoading && <p>Loading protected data...</p>}
          {error && <div className="alert alert-danger">{error}</div>}
          {privateData && (
            <pre>{JSON.stringify(privateData, null, 2)}</pre>
          )}
        </div>
      </div>

      <Link to="/" className="btn btn-primary">Back to Home</Link>
    </div>
  );
}; 