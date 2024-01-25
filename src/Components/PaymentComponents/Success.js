import { Image } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Success(){
    return(
        <div>
        <div className="success">
            <h1>Payment Successful</h1>
            <Image src="https://fantasy11.s3.ap-south-1.amazonaws.com/Images/money3.gif"/>
            <Link to={'/dashboard'}>Go to DashBoard</Link>
        </div>
        </div>
            
    )
}