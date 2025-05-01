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

  const [imageHeight, setImageHeight] = useState<number>(64); // גובה ברירת מחדל

  const isActive = (path: string) => location.pathname === path;

  const updateImageHeight = () => {
    const image = document.querySelector("img.header-background") as HTMLImageElement;
    if (image) {
      setImageHeight(image.height);
    }
  };

  useEffect(() => {
    updateImageHeight();
    window.addEventListener("resize", updateImageHeight);
    return () => {
      window.removeEventListener("resize", updateImageHeight);
    };
  }, []);

  return (
    <>
      {/* מרווח לגובה ההדר כדי שהתוכן לא ייכנס מתחת */}
      <Box sx={{ height: `${imageHeight}px` }} />

      {/* HEADER קבוע למעלה */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          zIndex: 1100, // מודלים יהיו עם zIndex גבוה יותר
        }}
      >
        

        {/* תוכן ההדר */}
        <AppBar
          position="static"
          sx={{
            backgroundColor: "transparent",
            boxShadow: "none",
            height: `${imageHeight}px`,
            paddingBottom: "50 0px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <Toolbar
            sx={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <img src="/images/musical-notes.png" alt="Logo" style={{ height: "44px", width: "44px",margin:"0px 15px 10px 30px"}}></img>
              {["/home", "/music"].map((path) => (
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
                  {path === "/home" ? "בית" : "מוזיקה"}
                </Button>
              ))}
              {authState && (
                <Button
                  key="/playlists"
                  color="inherit"
                  component={Link}
                  to="/playlists"
                  sx={{
                    fontSize: "16px",
                    height: "23px",
                    borderRadius: "32px",
                    padding: "6px",
                    minWidth: "unset",
                    position: "relative",
                    marginLeft: "10px",
                    "&::before": isActive("/playlists")
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
                  הפלייליסטים שלי
                </Button>
              )}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              {!authState && (
                <Button color="inherit" component={Link} to="/auth">
                  התחברות
                </Button>
              )}
              {authState && <UserDetails />}
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
};

export default Header;
