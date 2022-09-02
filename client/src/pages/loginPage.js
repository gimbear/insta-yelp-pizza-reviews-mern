import React from 'react';
import LoginForm from '../components/loginForm';

const LoginPage = () => {
  let content = (
    <section className="login">
      <div className="flex items-center justify-center">
        <LoginForm />
      </div>
    </section>
  );
  return content;
};

export default LoginPage;
