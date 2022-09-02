import { useSelector } from 'react-redux';

import UserProfile from '../features/users/userProfile';
import PizzaCard from '../features/pizza/pizzaCard';
import { useNavigate } from 'react-router-dom';

import {
  selectCurrentUser,
  logOut,
} from '../features/auth/authSlice';

import {
  useUploadFileMutation,
  useGetUserQuery,
} from '../app/services/user';

import { useDeletePizzaMutation } from '../app/services/pizzas';

const ProfilePage = () => {
  const userId = useSelector(selectCurrentUser);
  const { data: user, isLoading } = useGetUserQuery(userId);
  const [uploadImage] = useUploadFileMutation();
  const [deletePizza] = useDeletePizzaMutation();
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    //console.log(id);
    await deletePizza(id);
  };

  const handleUpdate = async (id) => {
    navigate(`/pizza/${id}`);
  };

  let userPizza = (
    <div className="flex justify-center">
      <div className="mx-5 my-4">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 ">
          {user?.pizzas.map((pizza) => (
            <div>
              {console.log(pizza)}
              <PizzaCard
                key={pizza._id}
                data={pizza}
                onClick={(id) => navigate(`/pizza/${id}`)}
              />
              <div className="flex items-center justify-between mb-5">
                <button
                  className="shadow appearance-none bg-red-400 hover:bg-red-500 no-underline inlhine-block align-baseline text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline  my-2"
                  onClick={(id) => {
                    handleDelete(pizza?._id);
                  }}
                >
                  DELETE
                </button>
                <button
                  className="shadow appearance-none bg-amber-400 hover:bg-red-500 no-underline inlhine-block align-baseline text-black font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={(id) => {
                    handleUpdate(pizza?._id);
                  }}
                >
                  EDIT
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <UserProfile
        user={user}
        uploadImage={uploadImage}
        logOut={logOut}
      />
      {isLoading ? (
        <>loading</>
      ) : user.pizzas.length === 0 ||
        user.pizzas === 'undefined' ||
        !user.pizzas ? (
        <>no pizzas found</>
      ) : (
        <>{userPizza}</>
      )}
    </div>
  );
};

export default ProfilePage;
