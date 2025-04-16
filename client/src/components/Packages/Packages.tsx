import React, { FC, Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PackageInterface, PackageEnum } from '../../App';


interface PackagesProps {
}

export const Packages: FC<PackagesProps> = () => {
  let [packages] = useState<PackageInterface[]>([]);
  const navigate = useNavigate();
  packages = [
    {
      _id: '1',
      price: 500,
      festivalId: '1',
      startDay: '2023-04-14',
      endDay: '2023-04-16',
      accommodation: 'Hotel California',
      packageType: PackageEnum.LITE,
      flights: {
        _id: '1',
        departure: new Date('2023-04-14'),
        arrival: new Date('2023-04-16'),
        airline: 'Delta Airlines',
      }
    },
    {
      _id: '2',
      price: 700,
      festivalId: '2',
      startDay: '2023-07-28',
      endDay: '2023-07-31',
      accommodation: 'Hilton Chicago',
      packageType: PackageEnum.STANDARD,
      flights: {
        _id: '2',
        departure: new Date('2023-07-28'),
        arrival: new Date('2023-07-31'),
        airline: 'United Airlines',
      }
    },
    {
      _id: '3',
      price: 900,
      festivalId: '3',
      startDay: '2023-06-15',
      endDay: '2023-06-18',
      accommodation: 'Bonnaroo Campground',
      packageType: PackageEnum.PREMIUM,
      flights: {
        _id: '3',
        departure: new Date('2023-06-15'),
        arrival: new Date('2023-06-18'),
        airline: 'American Airlines',
      }
    }
  ]


  return (
    <Fragment>
      <h1 className="display-1 bangers-regular" style={{ color: "black" }}>choose your package</h1>
      <div className="d-flex flex-row justify-content-center align-items-center">
        {packages.map((festivalPackage) => (
          <div key={festivalPackage._id} className="card text-center m-2" style={{
            width: "20rem",
            height: "22rem",
            backgroundColor: "rgba(31, 31, 61, 0.8)",
            color: "white",
            border: "none",
          }} onClick={() => navigate(`/checkout`)}>
            <div className="card-body">
              <h5 className="card-title bangers-regular">{festivalPackage.packageType}</h5>
              <p className="card-text">airline: {festivalPackage.flights.airline}</p>
              <p className="card-text">dates: {festivalPackage.startDay}-{festivalPackage.endDay}</p>
              <p className="card-text">accommodation: {festivalPackage.accommodation}</p>
              <p className="card-text">total: ${festivalPackage.price}</p>
            </div>
          </div>
        ))}
      </div>
    </Fragment>
  );
};
