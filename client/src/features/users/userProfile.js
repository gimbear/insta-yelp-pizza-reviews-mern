import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

const UserProfile = (props) => {
  const currentUser = props.user;
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const onSubmit = async (values, e) => {
    values.image = e.target.image.files;
    //console.log(values.image);
    await props.uploadImage(values.image[0]);
  };
  const welcomeMessage = currentUser
    ? `Welcome ${currentUser?.username}!`
    : 'Welcome!';

  let content = (
    <div>
      <section className="flex items-center justify-center">
        <div className="my-5">
          <img
            className="rounded-full border border-gray-100 shadow-sm"
            src={currentUser?.profileImage?.secure_url}
            alt="profile"
          />
          <h1 className="font-bold text-2xl align-baseline text-center my-2">
            {welcomeMessage}
          </h1>
        </div>
      </section>
      <section className="flex items-center justify-center">
        <div className="py-6 px-4 bg-gray-100 w-1/3 border-solid border-4 rounded-2xl border-gray-300">
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2 "
              htmlFor="password"
            >
              E-mail
            </label>
            <div className="bg-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 mb-3 leading-tight focus:outline-none focus:shadow-outline">
              {currentUser?.email}
            </div>
          </div>

          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2 "
              htmlFor="password"
            >
              userID
            </label>
            <div className="font-mono bg-gray-600 text-amber-300 shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 mb-3 leading-tight focus:outline-none focus:shadow-outline">
              {currentUser?._id}
            </div>
          </div>

          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2 "
              htmlFor="password"
            >
              Change profile picture
            </label>
            <div>
              <form
                className="flex items-center justify-between mb-5"
                onSubmit={handleSubmit(onSubmit)}
              >
                <input
                  className="bg-white shadow appearance-none border rounded w-full py-2 px-3 mr-2 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
                  name="image"
                  type="file"
                  {...register('image')}
                />
                <section className="w-1/3">
                  <button
                    type="submit"
                    className="shadow appearance-none bg-red-400 hover:bg-red-500 no-underline inlhine-block align-baseline text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Upload
                  </button>
                </section>
              </form>
            </div>
          </div>

          <button
            onClick={() => {
              dispatch(props.logOut());
            }}
            className="shadow appearance-none bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Logout
          </button>
        </div>
      </section>
    </div>
  );

  return <div>{content}</div>;
};

export default UserProfile;
