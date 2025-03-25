import { useSelector } from "react-redux";
import { StoreType } from "../store/store";
import { Link, useLocation } from "react-router";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import UserDetails from "./userDetails";
import { useState, useEffect } from "react";

const Header = () => {
  const authState = useSelector((store: StoreType) => store.user.authState);
  const location = useLocation();

  const [imageHeight, setImageHeight] = useState<number>(0);

  const isActive = (path: string) => location.pathname === path;

  // הפונקציה הזו מחשבת את הגובה של התמונה לאחר שהיא נטענת או כל שינוי בגודל המסך
  const updateImageHeight = () => {
    const image = document.querySelector('img.header-background') as HTMLImageElement;
    if (image) {
      setImageHeight(image.height); // מגדירים את הגובה של התמונה
    }
  };

  useEffect(() => {
    // כשהקומפוננטה עולה, אנחנו בודקים את הגובה של התמונה
    updateImageHeight();

    // מאזינים לשינוי גודל המסך
    window.addEventListener('resize', updateImageHeight);

    // מנקים את המאזין כשעוזבים את הקומפוננטה
    return () => {
      window.removeEventListener('resize', updateImageHeight);
    };
  }, []); // רץ פעם אחת כשמופיעה הקומפוננטה

  return (
    <Box sx={{ position: "relative", width: "100vw", overflow: "hidden" }}>
      {/* תמונת רקע */}
      <Box
        component="img"
        src="/images/header.jpg"
        alt="Header Background"
        className="header-background"
        sx={{
          width: "100%",
          height: "auto",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: -1, // שהתוכן יופיע מעל התמונה
        }}
      />

      {/* Header עם טקסט על התמונה */}
      <AppBar position="static" sx={{ backgroundColor: "transparent", boxShadow: "none", height: `${imageHeight}px` }}>
        <Toolbar sx={{marginTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", height: "100%" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h6" component="div" sx={{ color: "#ffffff", ml: 2 }}>
              Music App
            </Typography>
            {["/home", "/songs", "/playlists"].map((path) => (
              <Button
                key={path}
                color="inherit"
                component={Link}
                to={path}
                sx={{
                  fontSize: "16px",
                  height: "23px",
                  borderRadius: "32px",
                  padding: "6px",
                  minWidth: "unset",
                  position: "relative",
                  marginLeft: "10px",
                  "&::before": isActive(path)
                    ? {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        borderRadius: "32px",
                        padding: "0.5px",
                        background: "linear-gradient(90deg, var(--gradient-start), var(--gradient-middle), var(--gradient-end))",
                        WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                        WebkitMaskComposite: "destination-out",
                        maskComposite: "exclude",
                      }
                    : {},
                }}
              >
                {path === "/home" ? "בית" : path === "/songs" ? "מוזיקה" : "הפלייליסטים שלי"}
              </Button>
            ))}
          </Box>

          {/* שם המשתמש בקצה השמאלי */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {!authState && (
              <>
                <Button color="inherit" component={Link} to="/login">
                  התחברות
                </Button>
                <Button color="inherit" component={Link} to="/register">
                  הרשמה
                </Button>
              </>
            )}
            {authState && <UserDetails />}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
