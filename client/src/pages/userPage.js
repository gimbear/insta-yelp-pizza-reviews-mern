import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { selectCurrentUser } from '../features/auth/authSlice';
import { useGetUserQuery } from '../app/services/user';

import PizzaCard from '../features/pizza/pizzaCard';

const UserPage = () => {
  const navigate = useNavigate();

  const userId = useSelector(selectCurrentUser);
  const id = useParams();

  useEffect(() => {
    if (userId === id.userId.toString()) {
      navigate('/user/profile');
    }
  });

  const { data: user } = useGetUserQuery(id.userId);
  const welcomeMessage = user
    ? `Welcome to ${user?.username}'s userPage!`
    : 'Welcome!';

  //console.log(user);

  let userPizza = (
    <div className="flex justify-center">
      <div className="mx-5 my-4">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 ">
          {user.pizzas.map((pizza) => (
            <div>
              <PizzaCard
                key={pizza._id}
                data={pizza}
                onClick={(id) => navigate(`/pizza/${id}`)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  let content = (
    <div>
      <section className="flex items-center justify-center">
        <div className="my-5">
          <img
            className="rounded-full border border-gray-100 shadow-sm"
            src={user?.profileImage?.secure_url}
            alt="profile"
          />
          <h1 className="font-bold text-2xl align-baseline text-center my-2">
            {welcomeMessage}
          </h1>
        </div>
      </section>
      <h1 className="mx-5 text-xl font-bold">
        Posts by {user?.username}
      </h1>
      <section>{userPizza}</section>
    </div>
  );

  return <div>{content}</div>;
};

export default UserPage;
