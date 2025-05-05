import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthPage from './components/auth/AuthPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-bg-primary">
        <ToastContainer 
          position="top-right" 
          theme="dark" 
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
        />
        <Routes>
          <Route path="/" element={<AuthPage />} />
          {/* Add more routes as you develop your app */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
