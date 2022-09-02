import React from 'react';
import { Link } from 'react-router-dom';

const AuthPage = () => {
  return (
    <div>
      <h1>You are authenticated</h1>
      <Link to="/welcome">Back to Welcome</Link>
    </div>
  );
};

export default AuthPage;
