import { useSelector } from "react-redux";
import { StoreType } from "../store/store";

import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import ShareIcon from '@mui/icons-material/Share';
import GroupIcon from '@mui/icons-material/Group';
import { Box } from "@mui/material";

const Home = () =>{
    const user = useSelector((store: StoreType) => store.user);
    console.log("-----------------------------");
    console.log(user);
    const path = "https://yehuditmusic.s3.amazonaws.com/%D7%9E%D7%A9%D7%94%20%D7%A7%D7%9C%D7%99%D7%99%D7%9F%20-%20%D7%A2%D7%95%D7%93%20%D7%9C%D7%90%20%D7%9E%D7%90%D7%95%D7%97%D7%A8.mp3?AWSAccessKeyId=AKIA4T4OB7R7ICX7DZAU&Expires=1742321757&Signature=5iAH76qEEkIqhalFbnu00%2B04gGw%3D";
    return(
        <>
            home {user.user.userName}
            <br />
            <audio controls>
                <source src={path} type="audio/mpeg" />
                הדפדפן שלך לא תומך בניגון אודיו.
            </audio>
            {/* <ReactAudioPlayer
      src={path}
      controls
      autoPlay={false}
    /> */}
<LockIcon></LockIcon>
<LockOpenIcon></LockOpenIcon>
<ShareIcon></ShareIcon>
<GroupIcon></GroupIcon>
<Box
    sx={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "50px", // ניתן לשנות לפי הצורך
      height: "50px", // ניתן לשנות לפי הצורך
      borderRadius: "50%", // מעגל
      background: "linear-gradient(150deg, rgb(249, 50, 50), rgb(168, 71, 195), rgb(74, 90, 236))",
      padding: "10px",
      boxShadow: "0 0 20px rgba(0, 0, 0, 0.4)",
    }}
  >
    <GroupIcon sx={{ fontSize: 30, color: "white" }} />
  </Box>


  
  <h1
    style={{
      background: "linear-gradient(150deg, rgb(249, 50, 50) , rgb(168, 71, 195) , rgb(74, 90, 236) )", // הגדרת גרדיאנט
      WebkitBackgroundClip: "text", // החלת הגרדיאנט על הטקסט
      color: "transparent", // חשוב: צבע הטקסט עצמו צריך להיות שקוף
      fontSize: "40px", // גודל טקסט
      fontWeight: "bold", // עובי גופן
      display: 'inline-block'
    }}
  >
    טקסט עם גרדיאנט
  </h1>
  <div></div>
            <div>איקון אנשים מנעול אנשים גם לטופס שיתוף וגם לרשימות בצד</div>
            <div>פרופיל תמונה</div>
            <div>לוגו</div>
            <div>עיצוב בית יפה</div>

       </>
    )

}
export default Home