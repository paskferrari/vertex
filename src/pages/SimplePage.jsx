import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SimplePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Log when component mounts
    console.log('SimplePage component loaded');
    
    // Log to verify buttons are visible in the DOM
    setTimeout(() => {
      const buttons = document.querySelectorAll('button');
      console.log(`Found ${buttons.length} buttons:`, buttons);
      
      if (buttons.length > 0) {
        const firstButton = buttons[0];
        const styles = window.getComputedStyle(firstButton);
        console.log('First button computed styles:', {
          display: styles.display,
          visibility: styles.visibility,
          opacity: styles.opacity,
          position: styles.position,
          zIndex: styles.zIndex
        });
      }
    }, 1000);
  }, []);

  const handleClick = () => {
    console.log('Button clicked!');
    alert('Button clicked!');
  };

  const goToLogin = () => {
    navigate('/');
  };

  // Use dangerouslySetInnerHTML to inject pure HTML
  const htmlContent = `
    <div style="
      max-width: 500px;
      width: 100%;
      background-color: #1e293b;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1)
    ">
      <h1 style="text-align: center; margin-bottom: 20px;">Simple Test Page (HTML)</h1>
      
      <p style="margin-bottom: 20px; text-align: center;">
        This is a simple test page using dangerouslySetInnerHTML
      </p>
      
      <div style="display: flex; flex-direction: column; gap: 10px;">
        <button 
          id="test-button-1"
          onclick="window.testButtonClick()"
          style="
            background-color: #3b82f6;
            color: white;
            border: none;
            border-radius: 5px;
            padding: 10px 15px;
            cursor: pointer;
            font-weight: bold;
            display: block;
            width: 100%;
          "
        >
          Test Button 1 (HTML)
        </button>
        
        <button 
          id="test-button-2"
          onclick="window.goToLoginPage()"
          style="
            background-color: #8b5cf6;
            color: white;
            border: none;
            border-radius: 5px;
            padding: 10px 15px;
            cursor: pointer;
            font-weight: bold;
            display: block;
            width: 100%;
          "
        >
          Go Back to Login (HTML)
        </button>
        
        <a 
          href="/"
          style="
            background-color: #10b981;
            color: white;
            border: none;
            border-radius: 5px;
            padding: 10px 15px;
            cursor: pointer;
            font-weight: bold;
            display: block;
            width: 100%;
            text-align: center;
            text-decoration: none;
            box-sizing: border-box;
          "
        >
          Link to Login (HTML)
        </a>
      </div>
    </div>
  `;

  // Add window functions for the HTML buttons
  useEffect(() => {
    window.testButtonClick = () => {
      console.log('HTML button clicked!');
      alert('HTML button clicked!');
    };
    
    window.goToLoginPage = () => {
      navigate('/');
    };
    
    return () => {
      // Cleanup
      delete window.testButtonClick;
      delete window.goToLoginPage;
    };
  }, [navigate]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#0f172a',
      color: 'white',
      padding: '20px'
    }}>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
};

export default SimplePage;