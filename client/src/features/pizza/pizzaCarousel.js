import React from 'react';
import Carousel from 'react-gallery-carousel';

import 'react-gallery-carousel/dist/index.css';

const PizzaCarousel = (props) => {
  const images = props?.images.map((image) => ({
    src: image?.url,
    alt: `Dogs are domesticated mammals, not natural wild animals. They were originally bred from wolves. They have been bred by humans for a long time, and were the first animals ever to be domesticated.`,
  }));

  return (
    <section className="section" aria-labelledby="example1">
      <div className="carousel-container short">
        {!images ? (
          <>NO IMAGE</>
        ) : (
          <Carousel
            images={images}
            isLoop={false}
            hasIndexBoard={false}
            hasMediaButton={false}
            hasSizeButton={false}
            hasDotButtons="bottom"
            hasThumbnails={false}
            style={{ height: 400 }}
          />
        )}
      </div>
    </section>
  );
};

export default PizzaCarousel;
