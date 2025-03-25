import { Box, Button } from "@mui/material";

export default function Home() {
  return (
    <Box sx={{ width: "100vw", overflow: "hidden" }}>
      {/* תמונת רקע ברוחב מלא עם גובה שמתאים לה */}
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
      {/* כפתור ממורכז על התמונה */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Button
          variant="contained"
          sx={{
            bgcolor: "rgba(255, 255, 255, 0.8)",
            color: "black",
            fontSize: "1.2rem",
            padding: "10px 20px",
            borderRadius: "8px",
            "&:hover": { bgcolor: "rgba(255, 255, 255, 1)" },
          }}
        >
          Get Started
        </Button>
      </Box>
    </Box>
  );
}
