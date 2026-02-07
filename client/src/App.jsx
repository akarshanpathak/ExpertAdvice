import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CompanyDetails from './pages/CompanyDetails';
import ShareExperience from './pages/ShareExperience';
import AddCompany from './pages/AddCompany';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/company/:id" element={<CompanyDetails />} />
        <Route path="/share" element={<ShareExperience />} />
        <Route path="/add-company" element={<AddCompany />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
