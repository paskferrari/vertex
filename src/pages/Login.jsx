import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = email, 2 = verification code
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Step 1: Request verification code
  const handleRequestCode = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/request-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Verification code sent to your email!');
        setStep(2);
      } else {
        setError(data.message || 'Failed to send verification code');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Request code error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify code and login
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!code || code.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save token and user data to localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setMessage('Login successful! Redirecting...');
        
        // Redirect to dashboard after short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        setError(data.message || 'Invalid verification code');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Verify code error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Reset to step 1
  const handleBackToEmail = () => {
    setStep(1);
    setCode('');
    setError('');
    setMessage('');
  };

  // Direct login without OTP
  const handleDirectLogin = () => {
    setLoading(true);
    setError('');
    setMessage('');
    
    // Simulate successful login
    setTimeout(() => {
      // Create mock user data
      const mockUser = {
        id: 'user-123',
        email: email || 'user@example.com',
        name: 'Test User'
      };
      
      // Create mock token
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      // Save to localStorage
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      setMessage('Login successful! Redirecting...');
      setLoading(false);
      
      // Redirect to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl mb-4"
          >
            <span className="text-2xl font-bold text-white">V</span>
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to Vertex</h1>
          <p className="text-gray-400">
            {step === 1 ? 'Enter your email to get started' : 'Enter the verification code'}
          </p>
        </div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="card"
        >
          {step === 1 ? (
            /* Step 1: Email Input */
            <form onSubmit={handleRequestCode} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="input w-full"
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending Code...
                    </div>
                  ) : (
                    'Request Code'
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={handleDirectLogin}
                  disabled={loading}
                  className="btn-secondary w-full"
                >
                  Access Without OTP
                </button>
              </div>
            </form>
          ) : (
            /* Step 2: Verification Code Input */
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-300 mb-2">
                  Verification Code
                </label>
                <input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit code"
                  className="input w-full text-center text-2xl tracking-widest"
                  disabled={loading}
                  maxLength={6}
                  required
                />
                <p className="text-sm text-gray-400 mt-2">
                  Code sent to: <span className="text-primary">{email}</span>
                </p>
              </div>

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading || code.length !== 6}
                  className="btn-primary w-full"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Verifying...
                    </div>
                  ) : (
                    'Verify & Login'
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBackToEmail}
                  className="btn-secondary w-full"
                  disabled={loading}
                >
                  Back to Email
                </button>
                
                <button
                  type="button"
                  onClick={handleDirectLogin}
                  disabled={loading}
                  className="w-full py-2 px-4 border border-blue-500 text-blue-500 rounded-2xl hover:bg-blue-500/10 transition-all"
                >
                  Access Without OTP
                </button>
              </div>
            </form>
          )}

          {/* Status Messages */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-green-500/20 border border-green-400/30 rounded-lg"
            >
              <p className="text-green-400 text-sm text-center">{message}</p>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-red-500/20 border border-red-400/30 rounded-lg"
            >
              <p className="text-red-400 text-sm text-center">{error}</p>
            </motion.div>
          )}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center mt-8"
        >
          <p className="text-gray-400 text-sm">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;