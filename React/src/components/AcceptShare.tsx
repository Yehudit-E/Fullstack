import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PlaylistService from "../services/PlaylistService";

const AcceptShare = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const navigate = useNavigate();

  const handleAccept = async () => {
    
    const token = searchParams.get("token");    
    if (!token) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      await PlaylistService.acceptPlaylistShare(token);
      setStatus("success");
      setTimeout(() => {
        navigate("/myPlaylists");
      }, 2000);
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <div style={{ color: "white", textAlign: "center", marginTop: "2rem" }}>
      <h2>שיתוף פלייליסט</h2>
      {status === "idle" && (
        <>
          <p>נראה שקיבלת קישור לשיתוף פלייליסט. האם ברצונך להצטרף?</p>
          <button
            onClick={handleAccept}
            style={{
              padding: "0.5rem 1rem",
              fontSize: "1rem",
              backgroundColor: "#4caf50",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            כן, אשר שיתוף
          </button>
        </>
      )}

      {status === "loading" && <p>מאמת שיתוף...</p>}
      {status === "success" && <p>השיתוף התקבל בהצלחה! מועבר לרשימת הפלייליסטים שלך...</p>}
      {status === "error" && <p>אירעה שגיאה בעת קבלת השיתוף. אולי הקישור אינו תקף.</p>}
    </div>
  );
};

export default AcceptShare;