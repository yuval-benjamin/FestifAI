import { FC, Fragment, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext, FestivalInterface } from '../../App';
import { ClipLoader } from 'react-spinners';
import { fetchAmadeusToken } from '../../services/amaduesService';

export const Festivals: FC = () => {
  const {festivals, setPackages} = useContext(AppContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchPackages = async (festival: FestivalInterface) => {
    setIsLoading(true)
   const packages = await fetchAmadeusToken(festival)
  setIsLoading(false)
  setPackages?.(packages);
    navigate(`/festivals/package`)
  }

  return (
    isLoading ? 
    <Fragment>
      <h1 className="display-1 bangers-regular" style={{ color: "black" }}>customizing your festival packages...</h1>
      <div className="sweet-loading d-flex flex-row justify-content-center align-items-center">
    <ClipLoader
      loading={true}
      size={150}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  </div>
  </Fragment>  :
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
            onClick={() => fetchPackages(festival)}>
            <div className="card-body">
              <h5 className="card-title bangers-regular">{festival.name}</h5>
              <p className="card-text">dates: {festival.startDate}, {festival.endDate}</p>
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
