import { FC, Fragment, useContext, useEffect, useMemo, useState } from 'react';
import ArrowCircleLeftRoundedIcon from '@mui/icons-material/ArrowCircleLeftRounded';
import ArrowCircleRightRoundedIcon from '@mui/icons-material/ArrowCircleRightRounded';
import { useNavigate } from 'react-router-dom';
import { AppContext, FestivalInterface } from '../../App';
import { ClipLoader } from 'react-spinners';
import { fetchAmadeusToken } from '../../services/amaduesService';
import HorizontalLinearStepper from '../Stepper/Stepper';
import { useFestivals } from '../FetchFestivalsContext';
import _ from 'lodash';


export const Festivals: FC = () => {
  const { setPackages } = useContext(AppContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('🎉 Customizing your festival packages...');
  const { fetchFestivals, currentFestivals, isLoading: isFestivalsLoading, setChosenFestivalCategory } = useFestivals();
  const [allFestivals, setAllFestivals] = useState<FestivalInterface[]>([]);
  const [page, setPage] = useState(0);

  const currentChunkFestivals =
    useMemo(
      () => allFestivals.slice(page * 2, (page + 1) * 2),
      [page, allFestivals])

  const loadingMessages = [
    '🎉 Customizing your festival packages...',
    '✈️ Finding the best flight deals for you...',
    '🏨 Looking for the nicest hotels...',
    '🎶 Preparing your festival experience...',
  ];

  useEffect(
    () => {
      setAllFestivals(festivals => _.uniqBy([...festivals, ...currentFestivals], festival => festival.name));
    },
    [currentFestivals])

    useEffect(
      () => {
        setPage(Math.ceil(allFestivals.length / 2) - 1)
      },
      [allFestivals])

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % loadingMessages.length;
      setLoadingText(loadingMessages[index]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const fetchPackages = async (festival: FestivalInterface) => {
    setChosenFestivalCategory(festival.category);
    setIsLoading(true)
    const packages = await fetchAmadeusToken(festival)
    setIsLoading(false)
    setPackages?.(packages);
    navigate(`/festivals/package`)
  }

  return (
    <div className=' d-flex flex-column justify-content-center align-items-center'
      style={{
        width: "100%",
        height: "100%",
        backgroundImage: "url(/fest.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}>
      {(isLoading ?
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
          <div className="container max-w-full lg:max-w-6xl mx-auto w-full" style={{ marginBottom: '100px' }}>
            <h1 className="display-1 bangers-regular text-center" style={{ color: "white" }}>choose your festival</h1>
            <div className="d-flex flex-row justify-content-center align-items-center">
              <div style={{ width: "46px" }}>
                {page > 0 && <ArrowCircleLeftRoundedIcon style={{ height: "46px", width: "46px", cursor: "pointer" }} onClick={() => setPage(page => page - 1)} />}
              </div>
              {currentChunkFestivals?.map((festival) => (
                <div
                  key={festival.name}
                  className="card text-center m-2"
                  style={{
                    width: "20rem",
                    backgroundColor: "rgba(31, 31, 61, 0.8)",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    minHeight: "350px",
                    transition: "transform 0.3s ease, background-color 0.3s ease",
                  }}
                  onClick={(e) => {
                    e.currentTarget.style.border = "2px solid rgb(255, 51, 102)";
                    fetchPackages(festival)}}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                      e.currentTarget.style.backgroundColor = "rgba(31, 31, 61, 0.9)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.backgroundColor = "rgba(31, 31, 61, 0.8)";
                    }}
                  >
                  <div className="card-body bangers-regular" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <h5 className="card-title" style={{ fontSize: '25px' }}>{festival.name}</h5>
                    <p className="card-text" style={{ fontSize: '18px' }}>🗓️ {festival.startDate}, {festival.endDate}</p>
                    <p className="card-text" style={{ fontSize: '18px' }}>📍 {festival.location}</p>
                    <p className="card-text" style={{ fontSize: '18px' }}><b className='bangers-regular'>category:</b> {festival.category}
                    {
                      festival.category === 'nature' && <span className='bangers-regular'> 🌳</span>
                    }
                    {
                      festival.category === 'urban' && <span className='bangers-regular'> 🌆</span>
                    }
                    {
                      festival.category === 'desert' && <span className='bangers-regular'> 🏜️</span>
                    }
                    </p>
                    <p className="card-text" style={{ fontSize: '18px' }}>Because you like {festival.genre} 🎵</p>
                    <a
                      onClick={(event) => event.stopPropagation()}
                      href={festival.website.startsWith("http") ? festival.website : `https://${festival.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn bangers-regular card-text"
                      style={{
                        backgroundColor: '#FF3366',
                        color: 'white',
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
                    >
                      Checkout {festival.name}
                    </a>
                  </div>
                </div>
              ))}
              <div style={{ width: "46px" }}>
                {(page + 1) < (Math.ceil(allFestivals.length / 2)) && <ArrowCircleRightRoundedIcon style={{ height: "46px", width: "46px", cursor: "pointer" }} onClick={() => setPage(page => page + 1)} />}
              </div>
            </div>
            <div className="d-flex justify-content-end mt-4 me-4">
              <div
                className="d-flex align-items-center gap-2 px-4 py-2 text-white rounded-pill shadow-sm"
                style={{ cursor: "pointer", backgroundColor: '#FF3366' }}
                onClick={fetchFestivals}>
                <span className="fw-bold bangers-regular" >Fetch More Festivals</span>
                {isFestivalsLoading &&
                  <ClipLoader
                    loading={true}
                    size={15}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                    color='#FFFFFF'
                  />}
              </div>
            </div>
          </div>
          <HorizontalLinearStepper activeStep={1} />
        </Fragment>)
      } </div>
  );
};