import React, { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import HorizontalLinearStepper from '../Stepper/Stepper';
import { ClipLoader } from 'react-spinners';
import { useFestivals } from '../FetchFestivalsContext';

export const Preferences: React.FC = () => {
  const { fetchFestivals, error, setCountry, setPriceArea, priceArea, date, setDate, country, isLoading } = useFestivals()
  const navigate = useNavigate();

  return (
    <div className=' d-flex flex-column justify-content-center align-items-center'
      style={{
        width: "100%",
        height: "100%",
        backgroundImage: "url(/fest.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}>
      {(
        isLoading ?
          <Fragment>
            <h1 className="display-1 bangers-regular" style={{ color: "white" }}>searching relavent festivals for you...</h1>
            <div className="sweet-loading d-flex flex-row justify-content-center align-items-center">
              <ClipLoader
                loading={true}
                size={150}
                aria-label="Loading Spinner"
                data-testid="loader"
                color="#FFFFFF"
              />
            </div>
          </Fragment> :
          <Fragment>
            <div className="container mt-4 max-w-full lg:max-w-6xl mx-auto w-full"
              style={{
                marginBottom: '100px',
              }}>
              <h1 className="display-1 bangers-regular" style={{ color: 'white' }}>
                Choose Your Preferences
              </h1>
              <div className="form-group mt-6 bangers-regular">
                <label htmlFor="lowPrice">Price Area</label>
                <input
                  value={priceArea}
                  onChange={(e) => setPriceArea(Number(e.target.value))}
                  type="number"
                  className="form-control rounded-lg focus:ring-blue-600 focus:border-blue-600"
                  id="lowPrice"
                  placeholder="Enter Price Area"
                />
              </div>
              <div className="form-group mt-6 bangers-regular">
                <label htmlFor="location">Location - country or area</label>
                <input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="form-control rounded-lg focus:ring-blue-600 focus:border-blue-600"
                  id="location"
                  placeholder="Enter Location"
                />
              </div>
              <div className="form-group mt-6 bangers-regular">
                <label htmlFor="date">Date Area</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="form-control rounded-lg focus:ring-blue-600 focus:border-blue-600"
                  id="date"
                  placeholder="Select a date area"
                />
              </div>

              <button
                className="btn mt-6 bangers-regular"
                style={{ marginTop: "20px", backgroundColor: '#FF3366', color: 'white' }}
                onClick={async () => {
                  try {
                    await fetchFestivals()
                  } catch (error) {
                    console.log(error)
                  }
                  navigate("/festivals");
                }}>
                Search Festivals
              </button>
            </div>
            {error && <div className="alert alert-danger mt-2" role="alert">
              *Error Fetching Festivals try again later
            </div>}
            <HorizontalLinearStepper activeStep={0} />
          </Fragment>
      )}
    </div>
  );
};