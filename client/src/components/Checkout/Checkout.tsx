import { FC, Fragment, useContext } from "react";
import { AppContext } from "../../App";
import { useNavigate } from "react-router-dom";

export const Checkout: FC = () => {
    const {packages } = useContext(AppContext) 
    const navigate = useNavigate();

    return (
            <Fragment>
               <div className=' d-flex flex-column justify-content-center align-items-center' 
            style={{
              width: "100%",
              height: "100%", backgroundImage: "url(/fest.jpg)", backgroundSize: "cover", backgroundPosition: "center" 
            }}>
            <h1 className="display-1 bangers-regular" style={{ color: "white" }}>Your selected package</h1>

            </div>
            </Fragment>
    )
}