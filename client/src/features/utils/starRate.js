import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

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

const StarRate = (props) => {
  let rating = props.ratingValue;
  const setRating = props.setRatingValue;
  return (
    <div className="row-auto">
      {Array.from({ length: 5 }, (v, i) => (
        <button key={i} className="" onClick={() => setRating(i + 1)}>
          <Star
            style={{ flex: i }}
            starId={i + 1}
            key={`star_${i + 1}`}
            marked={rating <= i}
          ></Star>
        </button>
      ))}
    </div>
  );
};

export default StarRate;
