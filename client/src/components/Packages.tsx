import { FC, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext, PackageInterface } from '../App';
import { useContext } from 'react';
import HorizontalLinearStepper from './Stepper/Stepper';

export const Packages: FC = () => {
  const { packages } = useContext(AppContext)
  const navigate = useNavigate();
  const { setSelectedPackage } = useContext(AppContext)

  const onSelectPackage = (selectedPackage: PackageInterface) => {
    setSelectedPackage?.(selectedPackage)
    navigate(`/checkout`)
  }

  return (
    <Fragment>
       <div className=' d-flex flex-column justify-content-center align-items-center bangers-regular' 
    style={{
      width: "100%",
      height: "100%", backgroundImage: "url(/fest.jpg)", backgroundSize: "cover", 
      backgroundPosition: "center",
    }}
    >
      <h1 className="display-1 bangers-regular text-center" style={{ color: "white" }}>choose your package</h1>
      <div className="d-flex flex-row justify-content-center align-items-center" style={{       marginBottom: '100px',
}}>
        {packages?.map((festivalPackage) => (
          <div key={festivalPackage._id} className="card text-left m-2" style={{
            width: "20rem",
            height: "25rem",
            backgroundColor: "rgba(31, 31, 61, 0.8)",
            color: "white",
            border: "none",
            cursor: "pointer",
          }} onClick={() => onSelectPackage(festivalPackage)}>
            <div className="card-body" style={{fontSize: '18px'}}>
              <h5 className="card-title bangers-regular text-center"style={{fontSize:'22px'}}>{festivalPackage.packageType}</h5>
              <p className="card-text">🗓️ {(festivalPackage.startDay)} til {festivalPackage.endDay}</p>
                { (festivalPackage.flights.departure[0].airline == festivalPackage.flights.return[0].airline) ? 
              <p className="card-text">✈️ {festivalPackage.flights.departure[0].airline}</p>
              :<>
              <p className="card-text"><b>🛫</b> {festivalPackage.flights.departure[0].airline}</p>
              <p className="card-text"><b>🛬</b> {festivalPackage.flights.return[0].airline}</p>
              </>}
              <p className="card-text">💺 {festivalPackage.class} class</p>
             
              <p className="card-text"><b>🧳 </b>  {
                festivalPackage.checkedBags === 0 ? "No checked bags" : 
                festivalPackage.checkedBags
              }</p>
               <p className="card-text"><b>🏨 </b> {festivalPackage.accommodation } 
                {Array.from({ length: festivalPackage?.hotelRating ?? 0 }, (_, i) => (
                  <span key={i}>⭐</span>
                ))}</p>
              <p className="card-text"><b>💰:</b> ₪{festivalPackage.price}</p>
            </div>
          </div>
        ))}
      </div>
     <HorizontalLinearStepper activeStep={2}/>
    </div>
    </Fragment>

  );
};
