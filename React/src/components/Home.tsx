import { Box } from "@mui/material";
import { useNavigate } from "react-router";

export default function Home() {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: "100vw", overflow: "hidden", position: "relative" }}>
      {/* תמונת רקע ברוחב מלא */}
      <Box
        component="img"
        src="/images/home-page.jpg"
        alt="Background"
        sx={{
          width: "100%",
          height: "auto",
          display: "block",
        }}
      />

      {/* כפתור ממורכז בתוך התמונה */}
      <Box
        sx={{
          position: "absolute",
          top: "77.5%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <button
          onClick={() => navigate("/music")}
          style={{
            color: "var(--color-white)",
            border: "none",
            fontSize: "1.2rem",
            background: "none", // ללא רקע
            cursor: "pointer", // מציין שזה לחיץ
            pointerEvents: "auto", // כדי שהכפתור יישאר פעיל למרות ה-background
          }}
        >למוזיקה {" >"}
        </button>
      </Box>
    </Box>
  );
}
