import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLoginMutation } from '../app/services/api';

const LoginForm = () => {
  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    email: '',
    password: '',
  });

  const [login, { error }] = useLoginMutation();

  const handleChange = ({ target: { name, value } }) =>
    setFormState((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formState);
      navigate('/user/profile');
    } catch (err) {
      console.log(err);
    }
  };

  const content = (
    <section className="login">
      <div className="w-full max-w-xs ">
        <form
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <label
                className="block text-gray-700 text-sm font-bold mb-2 "
                htmlFor="email-field"
              >
                Email:
              </label>
              <p className="align-baseline text-xs text-red-500 leading-tight">
                {JSON.stringify(error?.data.error.email)?.replace(
                  /['"]+/g,
                  ''
                )}
              </p>
            </div>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 mb-3 leading-tight focus:shadow-outline"
              onChange={handleChange}
              id="email-field"
              name="email"
              type="text"
              placeholder="Email"
            />
          </div>
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <label
                className="block text-gray-700 text-sm font-bold mb-2 "
                htmlFor="password-field"
              >
                Password:
              </label>
              <p className="align-baseline text-xs text-red-500 leading-tight">
                {JSON.stringify(error?.data.error.password)?.replace(
                  /['"]+/g,
                  ''
                )}
              </p>
            </div>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 mb-3 leading-tight focus:shadow-outline"
              name="password"
              type="password"
              id="password-field"
              onChange={handleChange}
              placeholder="Password"
            />
          </div>
          <div className="flex items-center justify-between">
            <button className="shadow appearance-none bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Sign In
            </button>
            <section className="w-1/2">
              <Link
                to="/signup"
                className="no-underline inline-block align-baseline text-right font-bold text-sm text-red-400 hover:underline "
              >
                Create new account
              </Link>
            </section>
          </div>
        </form>
      </div>
    </section>
  );

  return content;
};

export default LoginForm;
