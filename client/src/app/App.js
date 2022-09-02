import './App.css';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout';
import LoginPage from '../pages/loginPage';
import HomePage from '../pages/homePage';
import SignUpPage from '../pages/signupPage';
import ProfilePage from '../pages/profilePage';
import UserPage from '../pages/userPage';
import SinglePizzaPage from '../pages/singlePizzaPage';
import AuthPage from '../pages/authPage';
import CreatePizzaPage from '../pages/createPizzaPage';
import AboutPage from '../pages/aboutPage';
import { ProtectedOutlet } from '../features/auth/protectedOutlet';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/about" element={<AboutPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />s
        <Route path="/user/:userId" element={<UserPage />} />
        <Route path="/pizza/:pizzaId" element={<SinglePizzaPage />} />
        <Route path="/" element={<ProtectedOutlet />}>
          <Route path="/user/profile" element={<ProfilePage />} />
          <Route path="/authTest" element={<AuthPage />} />
          <Route path="/pizza" element={<CreatePizzaPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
