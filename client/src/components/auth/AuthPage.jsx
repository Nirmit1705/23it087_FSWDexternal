import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Login from './Login';
import Register from './Register';
import './AuthPage.css';
import './input-icon.css';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  // Ensure proper animations after initial mount
  useEffect(() => {
    setMounted(true);
  }, []);
  
  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-blob"></div>
        <div className="auth-blob-2"></div>
        <div className="auth-gradient"></div>
      </div>
      
      <motion.div 
        className="auth-card"
        initial={{ opacity: 0, y: 20 }}
        animate={mounted ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-header">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={mounted ? { opacity: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Employee Management
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={mounted ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="auth-subtitle"
          >
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </motion.p>
        </div>
        
        <div className="auth-toggle">
          <button 
            className={`toggle-btn ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
            type="button"
          >
            Login
          </button>
          <button 
            className={`toggle-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
            type="button"
          >
            Register
          </button>
          <motion.div 
            className="toggle-indicator"
            initial={false}
            animate={{ x: isLogin ? 0 : '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        </div>
        
        <div className="auth-form-container">
          {isLogin ? <Login /> : <Register setIsLogin={setIsLogin} />}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
