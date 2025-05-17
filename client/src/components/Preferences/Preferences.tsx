import axios from 'axios';
import React, { Fragment, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext, FestivalInterface } from '../../App';
import HorizontalLinearStepper from '../Stepper/Stepper';
import { ClipLoader } from 'react-spinners';

export const Preferences: React.FC = () => {
  const [lowPrice, setLowPrice] = useState<number | undefined>(undefined);
  const [highPrice, setHighPrice] = useState<number | undefined>(undefined);
  const { setFestivals } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);  

  const navigate = useNavigate();

  const fetchFestivals = async () => {
    setIsLoading(true);
    const { data } = await axios.get<{ festivals: FestivalInterface[] }>(
      `http://localhost:3000/festivals?lowPrice=${lowPrice}&highPrice=${highPrice}`
    );
    setIsLoading(false);
    setFestivals?.(data.festivals);
    navigate('/festivals');
  };

  return (
    <div className=' d-flex flex-column justify-content-center align-items-center' 
    style={{
      width: "100%",
      height: "100%", backgroundImage: "url(/fest.jpg)", backgroundSize: "cover", backgroundPosition: "center" 
    }}
    >
{(
    isLoading ?
    <Fragment>
    <h1 className="display-1 bangers-regular" style={{ color: "white"}}>searching relavent festivals for you...</h1>
    <div className="sweet-loading d-flex flex-row justify-content-center align-items-center">
  <ClipLoader
    loading={true}
    size={150}
    aria-label="Loading Spinner"
    data-testid="loader"
    color="#FFFFFF"
  />
</div>
</Fragment>  :
    <Fragment>
        <div className="container mt-4 max-w-full lg:max-w-6xl mx-auto w-full"
          style={{
            marginBottom: '100px',
          }}> 
      <h1 className="display-1 bangers-regular" style={{ color: 'white' }}>
        Choose Your Preferences
      </h1>
        {/* Form Inputs */}
        <div className="form-group mt-6 bangers-regular">
          <label htmlFor="lowPrice">Low Price</label>
          <input
            value={lowPrice}
            onChange={(e) => setLowPrice(Number(e.target.value))}
            type="number"
            className="form-control rounded-lg focus:ring-blue-600 focus:border-blue-600"
            id="lowPrice"
            placeholder="Enter low price"
          />
        </div>
        <div className="form-group mt-6 bangers-regular">
          <label htmlFor="highPrice">High Price</label>
          <input
            value={highPrice}
            onChange={(e) => setHighPrice(Number(e.target.value))}
            type="number"
            className="form-control rounded-lg focus:ring-blue-600 focus:border-blue-600"
            id="highPrice"
            placeholder="Enter high price"
          /></div>
        <button className="btn mt-6 bangers-regular" style={{marginTop:"20px", backgroundColor: '#FF3366', color: 'white'}} onClick={fetchFestivals}>
          Search Festivals
        </button>
      
      </div>
      <HorizontalLinearStepper activeStep={0} />
    </Fragment>
    )}
    </div>
  );
};