import { FC, Fragment, useContext, useState } from "react";
import { AppContext } from "../../App";
import HorizontalLinearStepper from "../Stepper/Stepper";
import { useFestivals } from "../FetchFestivalsContext";
import { CategoryItem, fetchCategories } from "../../services/categoryService";

export const Checkout: FC = () => {
  const { selectedPackage } = useContext(AppContext)
  const { chosenFestivalCategory } = useFestivals();
  const [categoryItems, setCategoryItems] = useState<CategoryItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const handleOpenModal = async () => {
    const item = await fetchCategories(chosenFestivalCategory!);
    setCategoryItems(item.items);
    setIsModalOpen(true);
  };

  return (
    <Fragment>
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(12px)',
            borderRadius: '15px', padding: '30px', width: '80%', maxHeight: '80vh',
            overflowY: 'auto', color: 'white'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '28px' }}>Recommended Items for {selectedPackage?.festivalId}</h2>
              <button onClick={() => setIsModalOpen(false)} style={{
                backgroundColor: '#FF3366', border: 'none', color: 'white',
                padding: '8px 16px', borderRadius: '8px', cursor: 'pointer'
              }}>Close</button>
            </div>
            <ul style={{
              listStyleType: 'none', paddingLeft: 0,
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px'
            }}>
              {categoryItems.map((item, index) => (
                <li key={index} style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.3)', padding: '10px 15px',
                  borderRadius: '8px', textAlign: 'center'
                }}>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'block',
                      padding: '10px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '6px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                      e.currentTarget.style.transform = 'scale(1.03)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{
          width: "100%",
          height: "100%",
          backgroundImage: "url(/sziget.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Title */}
        <h1
          className="display-1 bangers-regular text-center"
          style={{ color: "white" }}
        >
          Your selected package
        </h1>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: "40px",
            width: "60%",
          }}
        >
          {/* Festival Data Block */}
          <div
            className="d-flex flex-column bangers-regular text-center"
            style={{
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderRadius: "10px",
              padding: "20px",
              color: "white",
              width: "100%",
              fontSize: "22px",
            }}
          >
            <div
              className="bangers-regular"
              style={{ color: "white", fontSize: "25px" }}
            >
              {selectedPackage?.festivalId}
            </div>
            <div className="bangers-regular"
              style={{ color: "white", fontSize: "20px" }}
            >
              🗓️ {selectedPackage?.festivalDatesStart} til {selectedPackage?.festivalDatesEnd}
            </div>
            <div className="bangers-regular"
              style={{ color: "white", fontSize: "20px" }}
            >
              <b>💰</b> ${selectedPackage?.price} total package price
            </div>
            {/* Action Buttons */}
            <div className="d-flex flex-row align-items-center justify-content-center gap-3">
              <button
                onClick={handleOpenModal}
                className="btn bangers-regular"
                style={{
                  backgroundColor: "#FF3366",
                  color: "white",
                  width: "200px",
                  display: "flex",
                  justifyContent: "center",
                  alignSelf: "center",
                }}
              >
                Festival essentials 🛒
              </button>
              <a
                onClick={(event) => event.stopPropagation()}
                href={
                  selectedPackage?.festivalLink.startsWith("http")
                    ? selectedPackage.festivalLink
                    : `https://${selectedPackage?.festivalLink}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="btn bangers-regular"
                style={{
                  backgroundColor: "#FF3366",
                  color: "white",
                  width: "200px",
                  display: "flex",
                  justifyContent: "center",
                  alignSelf: "center",
                }}
              >
                Buy festival ticket  🎫
              </a>
            </div>
          </div>

          {/* Flights and Hotel Row */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              gap: "20px",
              marginTop: "20px",
            }}
          >
            {/* Flights Block */}
            <div
              className="d-flex flex-column bangers-regular text-center"
              style={{
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                borderRadius: "10px",
                padding: "20px",
                color: "white",
                width: "65%", // Larger block for flights
                fontSize: "22px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: "20px",
                  marginTop: "20px",
                  textAlign: "center",
                }}
              >
                {/* Departure Flights Block */}
                <div
                  style={{
                    width: "48%",
                    backdropFilter: "blur(10px)",
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    borderRadius: "10px",
                    padding: "10px",
                    color: "white",
                  }}
                >
                  <h3 className="bangers-regular" style={{ color: "white", fontSize: "20px" }}>
                    🛫 {selectedPackage?.startDay}
                  </h3>
                  {selectedPackage?.flights.departure.map((flight, index) => (
                    <p key={index} className="card-text">
                      {flight.origin} - {flight.destination} operated by {flight.airline}
                    </p>
                  ))}
                </div>

                {/* Return Flights Block */}
                <div
                  style={{
                    width: "48%",
                    backdropFilter: "blur(10px)",
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    borderRadius: "10px",
                    padding: "10px",
                    color: "white",
                  }}
                >
                  <h3 className="bangers-regular" style={{ color: "white", fontSize: "20px" }}>
                    🛬 {selectedPackage?.endDay}
                  </h3>
                  {selectedPackage?.flights.return.map((flight, index) => (
                    <p key={index} className="card-text">
                      {flight.origin} - {flight.destination} operated by {flight.airline}
                    </p>
                  ))}
                </div>
              </div>
              <div className="bangers-regular"
                style={{ color: "white", fontSize: "20px", marginTop: "10px" }}
              >
                <b>💰</b> ${selectedPackage?.flightPrice} (Flight)
              </div>
            </div>

            {/* Hotel Block */}
            <div
              className="d-flex flex-column bangers-regular text-center"
              style={{
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                borderRadius: "10px",
                padding: "20px",
                color: "white",
                width: "35%", // Smaller block for hotel
                fontSize: "22px",
              }}
            >
              <div className="card-text" style={{
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                borderRadius: "10px",
                padding: "20px",
                color: "#FF3366",
                fontSize: "22px",
                marginBottom: "10px",
              }}>
                {selectedPackage?.packageType} package
              </div>
              <p className="card-text" style={{
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                borderRadius: "10px",
                padding: "10px",
                color: "white",
              }}>
                🏨 {selectedPackage?.accommodation} {Array.from({ length: selectedPackage?.hotelRating ?? 0 }, (_, i) => (
                  <span key={i}>⭐</span>
                ))}
              </p>
              <div className="bangers-regular" style={{ color: "white", fontSize: "20px" }}>
                <b>💰</b> ${selectedPackage?.hotelPrice} (Hotel)
              </div>
              {/* Luggage and Travel Class */}
              <div style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
              }}
              >
                <div className="card-text" style={{
                  display: "flex",
                  textAlign: "center",
                  justifyContent: "space-around", backdropFilter: "blur(10px)",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderRadius: "10px",
                  padding: "10px",
                  color: "white",
                  width: "70%"
                }}>
                  💺 {selectedPackage?.class} class
                </div>
                <div className="card-text" style={{
                  display: "flex",
                  textAlign: "center",
                  backdropFilter: "blur(10px)",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderRadius: "10px",
                  padding: "10px",
                  color: "white",
                  width: "25%"
                }}>
                  🧳 {selectedPackage?.checkedBags === 0
                    ? " No checked bags"
                    : selectedPackage?.checkedBags}
                </div>
                <p className="card-text" style={{ fontSize: '18px' }}><b className='bangers-regular'>category:</b> {festival.category}
                    {
                      chosenFestivalCategory === 'nature' && <span className='bangers-regular'> 🌳</span>
                    }
                    {
                      chosenFestivalCategory === 'urban' && <span className='bangers-regular'> 🌆</span>
                    }
                    {
                      chosenFestivalCategory === 'desert' && <span className='bangers-regular'> 🏜️</span>
                    }
                    </p>
              </div>
            </div>
          </div>
        </div>
        <HorizontalLinearStepper activeStep={4} />
      </div>
    </Fragment>
  )
}