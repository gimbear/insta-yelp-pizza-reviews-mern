import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSignupMutation } from '../app/services/user';

const SignupForm = () => {
  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  });

  const [isSignedup, setIsSignedUp] = useState(false);

  const [signup, { error }] = useSignupMutation();

  const handleChange = ({ target: { name, value } }) =>
    setFormState((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(formState).unwrap();
      setIsSignedUp(true);
      navigate('/login');
    } catch (err) {
      setIsSignedUp(false);
      console.log(err);
    }
  };

  //console.log(error);

  const content = (
    <div>
      <div className="w-full max-w-xs">
        <section className="login">
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          >
            <div className="mb-4">
              <h1 className="flex items-center justify-center font-bold">
                Create a new account
              </h1>
            </div>
            <div className="mb-2">
              <div className="flex items-center justify-between">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 "
                  htmlFor="email-form"
                >
                  E-mail:
                </label>
                <p className="align-baseline text-xs text-red-500 leading-tight">
                  {JSON.stringify(error?.data.error.email)?.replace(
                    /['"]+/g,
                    ''
                  )}
                </p>
              </div>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                onChange={handleChange}
                name="email"
                id="email-form"
                type="text"
                placeholder="E-mail"
              />
            </div>
            <div className="mb-2">
              <div className="flex items-center justify-between">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="username-form"
                >
                  Username:
                </label>
                <p className="align-baseline text-xs text-red-500 leading-tight">
                  {JSON.stringify(error?.data.error.user)?.replace(
                    /['"]+/g,
                    ''
                  )}
                </p>
              </div>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                onChange={handleChange}
                name="username"
                id="username-form"
                type="text"
                placeholder="Username"
              />
            </div>

            <div className="mb-2">
              <div className="flex items-center justify-between">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 "
                  htmlFor="password-form"
                >
                  Password:
                </label>
                <p className="align-baseline text-xs text-red-500 leading-tight">
                  {JSON.stringify(
                    error?.data.error.password
                  )?.replace(/['"]+/g, '')}
                </p>
              </div>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                onChange={handleChange}
                name="password"
                id="password-form"
                type="password"
                placeholder="Password"
              />
            </div>
            <div className="flex items-center justify-between">
              <button className="shadow appearance-none bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Register
              </button>
              <section className="w-1/2">
                <Link
                  to="/login"
                  className="no-underline inline-block align-baseline font-bold text-right text-sm text-red-400 hover:underline "
                >
                  Already have a account?
                </Link>
              </section>
            </div>

            <div className="m-5">
              <h1 className="flex items-center justify-center font-bold">
                {error ? (
                  <>Something went wrong...</>
                ) : isSignedup ? (
                  <>Successfully signed up!</>
                ) : null}
              </h1>
            </div>
          </form>

          <div>
            <div></div>
          </div>
        </section>
      </div>
    </div>
  );

  return content;
};

export default SignupForm;
