import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HorizontalLinearStepper from '../Stepper/Stepper';
import { ClipLoader } from 'react-spinners';
import { useFestivals } from '../FetchFestivalsContext';

export const Preferences: React.FC = () => {
  const { fetchFestivals, error, setCountry, setPriceArea, priceArea, date, setDate, country, isLoading } = useFestivals()
  const navigate = useNavigate();
  const [loadingText, setLoadingText] = useState('🎉 Searching relavent festivals for you...');

  const loadingMessages = [
    '🎉 Searching relavent festivals for you...',
    '🎶 Evaluting your musical taste...',
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % loadingMessages.length;
      setLoadingText(loadingMessages[index]);
    }, 4000);
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

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
            <h1 className="display-1 bangers-regular" style={{ color: "white", fontSize: '70px' }}>{loadingText}</h1>
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
              <h1 className="display-1 bangers-regular text-center" style={{ color: 'white' }}>
                Choose Your Preferences
              </h1>
              <div className="form-group mt-4 bangers-regular">
                <label htmlFor="lowPrice">Festival ticket price Range 💵</label>
                <input
                  value={priceArea}
                  onChange={(e) => setPriceArea(Number(e.target.value))}
                  type="number"
                  className="form-control rounded-lg focus:ring-blue-600 focus:border-blue-600"
                  id="lowPrice"
                  placeholder="Enter Price Range"
                />
              </div>
              <div className="form-group mt-4 bangers-regular">
                <label htmlFor="location">Location - country or area 📍</label>
                <input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="form-control rounded-lg focus:ring-blue-600 focus:border-blue-600"
                  id="location"
                  placeholder="Enter Location"
                />
              </div>
              <div className="form-group mt-4 bangers-regular">
                <label htmlFor="month">Month Area 🗓️</label>
                <input
                  type="month"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="form-control rounded-lg focus:ring-blue-600 focus:border-blue-600"
                  id="month"
                  min={new Date().toISOString().slice(0, 7)}
                  max={new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().slice(0, 7)}
                  placeholder="Select a month"
                />
              </div>
              <button
                className="btn mt-6 bangers-regular"
                style={{
                  marginTop: "20px",
                  color: 'white',
                  backgroundColor: '#FF3366',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0px 4px 15px rgba(255, 51, 102, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
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