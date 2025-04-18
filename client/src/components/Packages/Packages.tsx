import React, { FC, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../App';
import { useContext } from 'react';

export const Packages: FC = () => {
  const { packages } = useContext(AppContext)
  const navigate = useNavigate();

  return (
    <Fragment>
      <h1 className="display-1 bangers-regular" style={{ color: "black" }}>choose your package</h1>
      <div className="d-flex flex-row justify-content-center align-items-center">
        {packages?.map((festivalPackage) => (
          <div key={festivalPackage._id} className="card text-center m-2" style={{
            width: "20rem",
            height: "22rem",
            backgroundColor: "rgba(31, 31, 61, 0.8)",
            color: "white",
            border: "none",
          }} onClick={() => navigate(`/checkout`)}>
            <div className="card-body">
              <h5 className="card-title bangers-regular">{festivalPackage.packageType}</h5>
                { (festivalPackage.flights.departure.airline == festivalPackage.flights.return.airline) ? 
              <p className="card-text">airline: {festivalPackage.flights.departure.airline}</p>
              :<>
              <p className="card-text">departure airline: {festivalPackage.flights.departure.airline}</p>
              <p className="card-text">return airline: {festivalPackage.flights.return.airline}</p>
              </>}
              <p className="card-text">dates: {(festivalPackage.startDay)}-{festivalPackage.endDay}</p>
              <p className="card-text">accommodation: {festivalPackage.accommodation}</p>
              <p className="card-text">checked bags: {festivalPackage.checkedBags}</p>
              <p className="card-text">departure: {festivalPackage.flights.departure.origin} - {festivalPackage.flights.departure.destination}</p>
              <p className="card-text">return: {festivalPackage.flights.return.origin} - {festivalPackage.flights.return.destination}</p>
              <p className="card-text">total: ${festivalPackage.price}</p>
            </div>
          </div>
        ))}
      </div>
    </Fragment>
  );
};
