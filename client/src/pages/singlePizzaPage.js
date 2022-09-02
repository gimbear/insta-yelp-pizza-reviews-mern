import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import EditPizzaForm from '../features/pizza/editPizzaForm';
import { useGetPizzaByIdQuery } from '../app/services/pizzas';
import { selectCurrentUser } from '../features/auth/authSlice';
import { useProtectedMutation } from '../app/services/api';
import PizzaCard from '../features/pizza/pizzaCard';

const SinglePizzaPage = () => {
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const user = useSelector(selectCurrentUser);
  const [attemptAccess] = useProtectedMutation();
  const id = useParams();
  //console.log(id.pizzaId);
  const { data: pizza, isLoading } = useGetPizzaByIdQuery(id.pizzaId);
  //console.log(pizza);

  useEffect(() => {
    if (user === pizza?.user) {
      setCanEdit(true);
    }
  }, [pizza?.user, user]);

  let content = (
    <div>
      {isLoading ? (
        <p>Loading</p>
      ) : (
        <div className="flex justify-center my-5">
          <div>
            <button
              className="mr-10 shadow appearance-none bg-teal-400 hover:bg-red-500 no-underline inlhine-block align-baseline text-black font-bold py-1 px-7 rounded focus:outline-none focus:shadow-outline"
              onClick={() => navigate(-1)}
            >
              Return
            </button>
            {canEdit ? (
              <div className="mt-2">
                {isEdit ? (
                  <>
                    <EditPizzaForm edit={true} pizza={pizza} />
                  </>
                ) : (
                  <div>
                    <button
                      className="mr-10 shadow appearance-none bg-teal-400 hover:bg-red-500 no-underline inlhine-block align-baseline text-black font-bold py-1 px-10 rounded focus:outline-none focus:shadow-outline"
                      onClick={() => {
                        attemptAccess();
                        setIsEdit(true);
                      }}
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="">
            <PizzaCard key={id.pizzaId} data={pizza} />
          </div>
        </div>
      )}
    </div>
  );

  return <div>{content}</div>;
};

export default SinglePizzaPage;
