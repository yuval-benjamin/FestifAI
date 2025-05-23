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
        
            <div className=' d-flex flex-column bangers-regular text-left' style={{
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
              <p className="card-text"><b className="bangers-regular">departure:</b> {selectedPackage?.flights.departure[0].origin} - {selectedPackage?.flights.departure[0].destination}</p>
              {
                selectedPackage?.flights.departure[1] ? <p className="card-text">{selectedPackage?.flights.departure[1].origin} - {selectedPackage?.flights.departure[1].destination}</p>
                : <></>
              }
              <p className="card-text"><b className="bangers-regular">return: </b>{selectedPackage?.flights.return[0].origin} - {selectedPackage?.flights.return[0].destination}</p>
              {
                selectedPackage?.flights.return[1] ?  <p className="card-text">{selectedPackage?.flights.return[1].origin} - {selectedPackage?.flights.return[1].destination}</p>
                : <></>
              }
              <p className="card-text">dates: {(selectedPackage?.startDay)} til {selectedPackage?.endDay}</p>
                { (selectedPackage?.flights.departure[0].airline == selectedPackage?.flights.return[0].airline) ? 
              <p className="card-text">airline: {selectedPackage?.flights.departure[0].airline}</p>
              :<>
              <p className="card-text"><b>departure airline:</b> {selectedPackage?.flights.departure[0].airline}</p>
              <p className="card-text"><b>return airline:</b> {selectedPackage?.flights.return[0].airline}</p>
              </>}
              <p className="card-text"><b>travel class:</b> {selectedPackage?.class}</p>
              <p className="card-text"><b>accommodation:</b> {selectedPackage?.accommodation}</p>
              <p className="card-text"><b>checked bags:</b> {selectedPackage?.checkedBags}</p>
              <p className="card-text"><b>total:</b> ₪{selectedPackage?.price}</p>

            </div>
            </div>
              <HorizontalLinearStepper activeStep={4} />
            </div>
            </Fragment>
    )
}