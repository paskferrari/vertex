import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [isRendered, setIsRendered] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { t } = useTranslation();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Log when component mounts
  useEffect(() => {
    console.log('LoginPage component loaded');
    
    // Log to verify the component is visible in the DOM
    setTimeout(() => {
      const loginButton = document.querySelector('.login-button');
      console.log('Login button found after timeout:', loginButton);
      
      // Check if the button is visible
      if (loginButton) {
        const styles = window.getComputedStyle(loginButton);
        console.log('Button computed styles:', {
          display: styles.display,
          visibility: styles.visibility,
          opacity: styles.opacity,
          position: styles.position,
          zIndex: styles.zIndex
        });
      }
      
      setIsRendered(true);
    }, 1000);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(''); // Clear error when user types
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    
    setIsLoading(false);
  };

  // Quick login for demo purposes
  const handleDemoLogin = async () => {
    setIsLoading(true);
    const result = await login('admin@vertex.com', 'admin123');
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    
    setIsLoading(false);
  };

  // Function to navigate to test page
  const goToTestPage = () => {
    console.log('Navigating to test page');
    navigate('/test');
  };

  // Function to navigate to simple page
  const goToSimplePage = () => {
    console.log('Navigating to simple page');
    navigate('/simple');
  };

  console.log('LoginPage rendering, isRendered:', isRendered);

  return (
    <div 
      id="login-container"
      style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '1rem',
        backgroundColor: '#0f172a'
      }}
    >
      <div 
        id="login-card"
        style={{ 
          width: '100%', 
          maxWidth: '24rem', 
          padding: '2rem', 
          borderRadius: '1rem', 
          backgroundColor: '#1e293b',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>{t('common.appName')}</h1>
          <p style={{ color: '#94a3b8' }}>{t('common.tagline')}</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ color: 'white', textAlign: 'center' }}>{t('login.title')}</p>
          
          {error && (
            <div style={{ 
              backgroundColor: '#fef2f2', 
              border: '1px solid #fecaca', 
              color: '#dc2626', 
              padding: '0.75rem', 
              borderRadius: '0.5rem',
              fontSize: '0.875rem'
            }}>
              {error}
            </div>
          )}
          
          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid #475569',
                backgroundColor: '#334155',
                color: 'white',
                fontSize: '1rem'
              }}
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid #475569',
                backgroundColor: '#334155',
                color: 'white',
                fontSize: '1rem'
              }}
              placeholder="Enter your password"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            style={{ 
              backgroundColor: isLoading ? '#6b7280' : '#3b82f6', 
              color: 'white', 
              padding: '0.75rem 1rem', 
              borderRadius: '0.5rem',
              fontWeight: '500',
              width: '100%',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              border: 'none',
              display: 'block',
              fontSize: '1rem'
            }}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
          
          <div style={{ textAlign: 'center', margin: '1rem 0' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>or</span>
          </div>
          
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={isLoading}
            style={{ 
              backgroundColor: isLoading ? '#6b7280' : '#10b981', 
              color: 'white', 
              padding: '0.75rem 1rem', 
              borderRadius: '0.5rem',
              fontWeight: '500',
              width: '100%',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              border: 'none',
              display: 'block',
              fontSize: '1rem'
            }}
          >
            {isLoading ? 'Signing in...' : 'Demo Login (Admin)'}
          </button>
          
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
              Demo credentials: admin@vertex.com / admin123
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;