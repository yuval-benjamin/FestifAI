import React, { FC, Fragment, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../App';

export const Festivals: FC = () => {
  const {festivals} = useContext(AppContext)
  const navigate = useNavigate();

  return (
    <Fragment>
      <h1 className="display-1 bangers-regular" style={{ color: "black" }}>choose your festival</h1>
      <div className="d-flex flex-row justify-content-center align-items-center">
        {festivals?.map((festival) => (
          <div
            key={festival.name}
            className="card text-center m-2"
            style={{
              width: "20rem",
              height: "22rem",
              backgroundColor: "rgba(31, 31, 61, 0.8)",
              color: "white",
              border: "none",
            }}
            onClick={() => navigate(`/festivals/package`)}>
            <div className="card-body">
              <h5 className="card-title bangers-regular">{festival.name}</h5>
              <p className="card-text">dates: {festival.startDate}-{festival.endDate}</p>
              <p className="card-text">location: {festival.location}</p>
              {/* <p className="card-text">estimated cost: ${festival.price}</p> */}
              <a href={festival.website} className="btn btn-primary">Checkout {festival.name} website</a>
            </div>
          </div>
        ))}
      </div>
    </Fragment>
  );
};
