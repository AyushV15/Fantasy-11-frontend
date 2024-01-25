import { Image } from "react-bootstrap"

export default function FantasyScoreSystem(){
    return(
        <div style={{
            display : "flex",
            flexDirection : "column",
            justifyContent : "center",
            alignItems : "center"
        }}>
          <Image src="https://fantasy11.s3.ap-south-1.amazonaws.com/Images/1.png" alt="fantasy-points-image" width={800}/>
          <Image src="https://fantasy11.s3.ap-south-1.amazonaws.com/Images/2.png" alt="fantasy-points-image" width={800}/>
        </div>
    )
}

