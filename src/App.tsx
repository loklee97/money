import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './Components/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute';
import Login from './Components/Login';
import Home from './Components/Home';
import CreateRecord from './Components/CreateRecord';
import ListRecord from './Components/ListRecord';
import Category from './Components/Category';
import DashBoard from './Components/DashBoard';
import AddUser from './Components/AddUser';
import Header from './Components/Header';

function App() {
  return (
    <Router>
      <Header  />
      <main className="container mx-auto px-4 mt-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/adduser" element={<AddUser />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/createrecord" element={<CreateRecord />} />
            <Route path="/listrecord" element={<ListRecord />} />
            <Route path="/category" element={<Category />} />
            <Route path="/dashboard" element={<DashBoard />} />
          </Route>
        </Routes>
      </main>
    </Router>
  );
}

export default App;
