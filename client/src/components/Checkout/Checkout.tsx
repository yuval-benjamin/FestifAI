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
      <div className=' d-flex flex-column justify-content-center align-items-center'
        style={{
          width: "100%",
          height: "100%", backgroundImage: "url(/sziget.png)", backgroundSize: "cover", backgroundPosition: "center"
        }}>
        <h1 className="display-1 bangers-regular text-center" style={{ color: "white" }}>Your selected package</h1>
        <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '100px', width: '80%' }}>
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
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
              <p className="card-text"><b className="bangers-regular">🛫</b>
                {selectedPackage?.flights.departure.map((flight, index) => (
                  <p key={index} className="card-text">{flight.origin} - {flight.destination} operated by {flight.airline}</p>
                ))}</p>
              <p className="card-text"><b className="bangers-regular">🛬 </b>
                {selectedPackage?.flights.return.map((flight, index) => (
                  <p key={index} className="card-text">{flight.origin} - {flight.destination} operated by {flight.airline}</p>
                ))}</p>
            </div>
            <p className="card-text">🗓️ {(selectedPackage?.startDay)} til {selectedPackage?.endDay}</p>
            <p className="card-text"><b>travel class:</b> {selectedPackage?.class}</p>
            <p className="card-text"><b>🏨</b> {selectedPackage?.accommodation}
              {Array.from({ length: selectedPackage?.hotelRating ?? 0 }, (_, i) => (
                <span key={i}>⭐</span>
              ))}</p>
            <p className="card-text"><b>🧳 </b>
              {
                selectedPackage?.checkedBags === 0 ? "No checked bags" :
                  selectedPackage?.checkedBags
              }
            </p>
            <p className="card-text"><b>💰</b> ₪{selectedPackage?.price}</p>
            <button
              onClick={handleOpenModal}
              className="card-text btn bangers-regular"
              style={{
                outline: 'none',
                border: 'none',
                fontSize: '22px',
                cursor: 'pointer'
              }}
            >
              Check out items for festival 🛒
            </button>
            <a onClick={(event) => event.stopPropagation()} href={selectedPackage?.festivalLink.startsWith("http") ? selectedPackage.festivalLink : `https://${selectedPackage?.festivalLink}`} target="_blank" rel="noopener noreferrer" className="btn bangers-regular" style={{ marginTop: "20px", backgroundColor: '#FF3366', color: 'white', width: '300px', display: 'flex', justifyContent: 'center', alignSelf: 'center' }} > Buy {selectedPackage?.festivalId} ticket here </a>
          </div>
        </div>
        <HorizontalLinearStepper activeStep={4} />
      </div>
    </Fragment>
  )
}