import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';

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

const DollarRate = (props) => {
  let rating = props.ratingValue;
  const setRating = props.setRatingValue;

  return (
    <div className="row-auto">
      {Array.from({ length: 3 }, (v, i) => (
        <button key={i} className="" onClick={() => setRating(i + 1)}>
          <Dollar
            style={{ flex: i }}
            dollarId={i + 1}
            key={`star_${i + 1}`}
            marked={rating <= i}
          />
        </button>
      ))}
    </div>
  );
};

export default DollarRate;
