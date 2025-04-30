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
            height: "35rem",
            backgroundColor: "rgba(31, 31, 61, 0.8)",
            color: "white",
            border: "none",
          }} onClick={() => navigate(`/checkout`)}>
            <div className="card-body">
              <h5 className="card-title bangers-regular">{festivalPackage.packageType}</h5>
              <p className="card-text">dates: {(festivalPackage.startDay)}-{festivalPackage.endDay}</p>
                { (festivalPackage.flights.departure[0].airline == festivalPackage.flights.return[0].airline) ? 
              <p className="card-text">airline: {festivalPackage.flights.departure[0].airline}</p>
              :<>
              <p className="card-text">departure airline: {festivalPackage.flights.departure[0].airline}</p>
              <p className="card-text">return airline: {festivalPackage.flights.return[0].airline}</p>
              </>}
              <p className="card-text">travel class: {festivalPackage.class}</p>
              <p className="card-text">accommodation: {festivalPackage.accommodation}</p>
              <p className="card-text">checked bags: {festivalPackage.checkedBags}</p>
              <p className="card-text">departure: {festivalPackage.flights.departure[0].origin} - {festivalPackage.flights.departure[0].destination}</p>
              <p className="card-text">{festivalPackage.flights.departure[1].origin} - {festivalPackage.flights.departure[1].destination}</p>
              <p className="card-text">return: {festivalPackage.flights.return[0].origin} - {festivalPackage.flights.return[0].destination}</p>
              <p className="card-text">{festivalPackage.flights.return[1].origin} - {festivalPackage.flights.return[1].destination}</p>
              <p className="card-text">total: ₪{festivalPackage.price}</p>
            </div>
          </div>
        ))}
      </div>
    </Fragment>
  );
};
