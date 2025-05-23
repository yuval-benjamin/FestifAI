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
            <h1 className="display-1 bangers-regular" style={{ color: "white" }}>Your selected package</h1>
            <div style={{display: 'flex', flexDirection:'row', marginBottom: '100px', height: '50vh', width: '80%'}}>
        
            <div className=' d-flex flex-column justify-content-center align-items-center' style={{
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              padding: '20px',
              margin: '20px',
              color: 'white',
              width: "80%",
            }}
            >
            <div className="bangers-regular" style={{ color: "white" }}>{selectedPackage?.festivalId}</div>            
              <p className="card-text"><b className="bangers-regular">departure:</b> {selectedPackage?.flights.departure[0].origin} - {selectedPackage?.flights.departure[0].destination}</p>
              {
                selectedPackage?.flights.departure[1] ? <p className="card-text">{selectedPackage.flights.departure[1].origin} - {selectedPackage.flights.departure[1].destination}</p>
                : <></>
              }
              <p className="card-text"><b className="bangers-regular">return: </b>{selectedPackage?.flights.return[0].origin} - {selectedPackage?.flights.return[0].destination}</p>
              {
                selectedPackage?.flights.return[1] ?  <p className="card-text">{selectedPackage?.flights.return[1].origin} - {selectedPackage?.flights.return[1].destination}</p>
                : <></>
              }
            </div>
              <HorizontalLinearStepper activeStep={4} />
            </div>
            </div>
            </Fragment>
    )
}