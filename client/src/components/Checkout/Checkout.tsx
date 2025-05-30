import { FC, Fragment, useContext } from "react";
import { AppContext } from "../../App";
import HorizontalLinearStepper from "../Stepper/Stepper";

export const Checkout: FC = () => {
    const { selectedPackage } = useContext(AppContext)

    return (
            <Fragment>
               <div className=' d-flex flex-column justify-content-center align-items-center' 
            style={{
              width: "100%",
              height: "100%", backgroundImage: "url(/sziget.png)", backgroundSize: "cover", backgroundPosition: "center" 
            }}>
            <h1 className="display-1 bangers-regular text-center" style={{ color: "white" }}>Your selected package</h1>
            <div style={{display: 'flex', flexDirection:'row', marginBottom: '100px', width: '80%'}}>
        
            <div className=' d-flex flex-column bangers-regular text-center' style={{
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              padding: '20px',
              margin: '20px',
              color: 'white',
              width: "100%",
              fontSize: '22px',
            }}
            >
            <div className="bangers-regular" style={{ color: "white", fontSize: '25px' }}>{selectedPackage?.festivalId} with a {selectedPackage?.packageType} package</div>            
              <div style={{display:'flex', flexDirection: 'row', justifyContent:'space-evenly'}}>
              <p className="card-text"><b className="bangers-regular">departure:</b>
              {selectedPackage?.flights.departure.map((flight, index) => (
                <p key={index} className="card-text">{flight.origin} - {flight.destination} operated by {flight.airline}</p>
              ))}</p>
              <p className="card-text"><b className="bangers-regular">return: </b>
              {selectedPackage?.flights.return.map((flight, index) => (
                <p key={index} className="card-text">{flight.origin} - {flight.destination} operated by {flight.airline}</p>
              ))}</p>
              </div>
              <p className="card-text">dates: {(selectedPackage?.startDay)} til {selectedPackage?.endDay}</p>
              <p className="card-text"><b>travel class:</b> {selectedPackage?.class}</p>
              <p className="card-text"><b>accommodation:</b> {selectedPackage?.accommodation} 
              {Array.from({ length: selectedPackage?.hotelRating ?? 0 }, (_, i) => (
                  <span key={i}>⭐</span>
                ))}</p>
              <p className="card-text"><b>checked bags:</b> 
              {
                selectedPackage?.checkedBags === 0 ? "No checked bags" : 
                selectedPackage?.checkedBags
              }
              </p>
              <p className="card-text"><b>total:</b> ₪{selectedPackage?.price}</p>
              <a onClick={(event) => event.stopPropagation()} href={selectedPackage?.festivalLink.startsWith("http") ? selectedPackage.festivalLink : `https://${selectedPackage?.festivalLink}`} target="_blank" rel="noopener noreferrer" className="btn bangers-regular" style={{ marginTop: "20px", backgroundColor: '#FF3366', color: 'white', width: '300px', display: 'flex',justifyContent: 'center', alignSelf: 'center' }} > Buy {selectedPackage?.festivalId} ticket here </a>
              </div>
            </div>
              <HorizontalLinearStepper activeStep={4} />
            </div>
            </Fragment>
    )
}