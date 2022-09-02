import { useState } from 'react';
import { useGetUserQuery } from '../../app/services/user';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar,
  faLocationDot,
  faDollarSign,
  faPizzaSlice,
} from '@fortawesome/free-solid-svg-icons';

import { Link } from 'react-router-dom';

import PizzaCarousel from './pizzaCarousel';

const PizzaCard = (props) => {
  const pizza = props?.data;

  const { data: user } = useGetUserQuery(pizza?.user);

  const Star = ({ starId, marked }) => {
    let fill = '#b2b2b2';
    if (!marked) {
      fill = '#ff9933';
    }

    return (
      <FontAwesomeIcon
        data-star-id={starId}
        icon={faStar}
        size="xl"
        color={fill}
      />
    );
  };

  const Dollar = ({ dollarId, marked }) => {
    let fill = '#b2b2b2';
    if (!marked) {
      fill = '#58b169';
    }

    return (
      <FontAwesomeIcon
        className="mr-0.5"
        data-dollar-id={dollarId}
        icon={faDollarSign}
        size="xl"
        color={fill}
      />
    );
  };

  const StarRate = ({ value }) => {
    const [rating, setRating] = useState(parseInt(value) || 0);
    return (
      <div className="row-auto">
        {Array.from({ length: 5 }, (v, i) => (
          <Star
            style={{ flex: i }}
            starId={i + 1}
            key={`star_${i + 1}`}
            marked={rating <= i}
          />
        ))}
      </div>
    );
  };

  const DollarRate = ({ value }) => {
    const [rating, setRating] = useState(parseInt(value) || 0);
    return (
      <div className="row-auto">
        {Array.from({ length: 3 }, (v, i) => (
          <>
            <Dollar
              style={{ flex: i }}
              dollarId={i + 1}
              key={`star_${i + 1}`}
              marked={rating <= i}
            />
          </>
        ))}
      </div>
    );
  };

  let content = (
    <div className="container max-w-sm border border-slate-300 rounded-xl shadow-lg ">
      <div className="flex items-center px-2 py-2 ">
        <img
          src={user?.profileImage.secure_url}
          alt=""
          className="rounded-full w-14 h-14 drop-shadow-md"
        />

        <div className="font-bold ml-4 w-3/4 ">
          <span className="block text-l truncate ...">
            <Link to={`/pizza/${pizza?._id}`}>
              {pizza?.pizzaTitle}{' '}
            </Link>
          </span>
          <span className="block text-xs">
            by
            <Link to={`/user/${user?.id}`}> {user?.username}</Link>
          </span>
        </div>
      </div>
      <PizzaCarousel images={pizza?.images} />

      <div className="px-3 py-2">
        <div className="px-0.5 pb-1 pt-2 text-sm font-bold border-dashed border-2 pl-3 pr-3">
          <div className="flex items-center justify-between">
            <div className="flex my-1 gap-x-0.5">
              <FontAwesomeIcon
                className="pr-1"
                icon={faLocationDot}
                size="xl"
                color="#d14a4a"
                fixedWidth
              />
              <p className="pr-3">Location</p>
            </div>
            <p className="text-xs text-right truncate ...">
              {pizza?.location?.value ? (
                <>
                  <div>
                    <a
                      href={`https://www.google.com/maps/place/?q=place_id:${pizza?.location?.value.place_id}`}
                    >
                      <div className="text-ellipsis overflow-hidden ...">
                        {
                          pizza?.location?.value.structured_formatting
                            .main_text
                        }
                      </div>
                      <div className="text-ellipsis overflow-hidden ...">
                        {
                          pizza?.location?.value.structured_formatting
                            .secondary_text
                        }
                      </div>
                    </a>
                  </div>
                </>
              ) : (
                <>Unknown</>
              )}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex my-2 gap-x-0.5">
              <FontAwesomeIcon
                className="pr-1"
                icon={faDollarSign}
                size="xl"
                color="#4f9043"
                fixedWidth
              />
              <p>Cost</p>
            </div>
            <DollarRate value={pizza?.cost ? pizza.cost : 0} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex my-2 gap-x-0.5">
              <FontAwesomeIcon
                className="pr-1"
                icon={faPizzaSlice}
                size="xl"
                color="#ed7960"
                fixedWidth
              />
              <p>Rating</p>
            </div>
            <StarRate value={pizza?.rating} />
          </div>
        </div>
        <div className="border border-2 my-2 ">
          <div className="px-2 py-1 ">
            <h2 className="font-bold text-ml"> Review</h2>
            <div className="text-sm px-6 py-2 leading-normal ">
              {pizza?.body}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  return <div>{content}</div>;
};

export default PizzaCard;
