import { useSelector } from "react-redux";
import { StoreType } from "../store/store";
import { Link, useLocation } from "react-router";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import UserDetails from "./userDetails";

const Header = () => {
  const authState = useSelector((store: StoreType) => store.user.authState);
  // const user = useSelector((store: StoreType) => store.user);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar position="static" sx={{ backgroundColor: "#363636", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
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
              height:"23px",
              borderRadius: "32px",
              padding: "6px", // הוספתי מרווח פנימי שיתאים לגודל הטקסט
              minWidth: "unset", // מאפשר לכפתור להיות ברוחב התוכן בלבד
              position: "relative",
              marginLeft: "10px",
              backgroundColor: "#363636",
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
        <Box>
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
          {authState && (
            // <Typography variant="body1" component="span" sx={{ color: "#ffffff" }}>
            //   {user.user.userName}
            // </Typography>
            <UserDetails></UserDetails>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
