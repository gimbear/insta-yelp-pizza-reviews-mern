import React from 'react';
import { useGetPizzaQuery } from '../../app/services/pizzas';
import PizzaCard from './pizzaCard';
import { useNavigate } from 'react-router-dom';

const PizzaList = () => {
  const { data: pizzas, isLoading } = useGetPizzaQuery();
  const navigate = useNavigate();
  //console.log(pizzas);
  if (isLoading) {
    return <div>Loading</div>;
  }

  if (!pizzas) {
    return <div>No posts :(</div>;
  }
  //<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 grid-flow-row-dense"></div>
  return (
    <div className="flex justify-center">
      <div className="mx-5 my-4">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 grid-flow-row-dense">
          {pizzas.map((pizza) => (
            <div className="box">
              <PizzaCard
                key={pizza?._id}
                data={pizza}
                onClick={(id) => navigate(`/pizza/${id}`)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PizzaList;
