import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductLanding from './pages/ProductLanding';
import AdminDashboard from './pages/AdminDashboard';
import Shipping from './pages/Shipping';
import Login from './pages/Login';
import Register from './pages/Register';
import ThankYou from './pages/ThankYou';
import NotFound from './components/NotFound';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router future={ {v7_startTransition: true,}}>
        <div className="min-h-screen bg-rose-50">
          <Navbar />
          <Routes>
            <Route path="/*" element={<NotFound />} /> 
            <Route path="/" element={<ProductLanding />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/thank-you" element={<ThankYou />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;