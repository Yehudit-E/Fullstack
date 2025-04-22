import { useDispatch, useSelector } from "react-redux";
import { Dispatch, StoreType } from "../store/store";
import { Avatar, Popover, Typography, IconButton, Button, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { logout } from "../store/userSlice";
import { useNavigate } from "react-router";
import { resetSong } from "../store/songSlice";

const UserDetails = () => {
    const dispatch = useDispatch<Dispatch>();
    const user = useSelector((state: StoreType) => state.user.user);

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const navigate = useNavigate();
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        dispatch(logout());
        handleClose();
        navigate("/home");
                // פעולה לניקוי הסטייט של השיר ב-redux
                dispatch(resetSong());
                // גם נגבה את sessionStorage
                sessionStorage.removeItem('songPlayer');
    };

    const open = Boolean(anchorEl);

    return (
        <>
            <IconButton onClick={handleClick} sx={{ p: 0 }}>
                <Box sx={{ position: "relative", display: "inline-block" }}>
                    {/* תמונת הפרופיל */}
                    <Avatar
                        // src={"/a.jpeg"}
                        sx={{ width: 40, height: 40, bgcolor: "#363636", color: "white" }}
                    />
                </Box>
            </IconButton>

            {/* תפריט פרופיל */}
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{
                    sx: {
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        borderRadius: 4,
                        padding: 3,
                        boxShadow: "0px 4px 10px var(--color-black)",
                        minWidth: 220,
                        textAlign: "center",
                        backgroundColor: "#1e1e1e",
                        color: "white",
                        marginTop: 1.5,
                    },
                }}
            >
                {/* כפתור סגירה */}
                <IconButton sx={{ position: "absolute", top: 5, left: 5, color: "white" }} onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
                <Box sx={{ position: "relative", display: "inline-block" }}>
                    {/* תמונת הפרופיל */}
                    <Avatar
                        // src={"/a.jpeg"}
                        sx={{ width: 40, height: 40, bgcolor: "#363636", color: "white" }}
                    />
                </Box>
                {/* שם המשתמש */}
                <Typography variant="h6" sx={{ marginTop: 1.5, fontWeight: "bold", color: "#fff" }}>
                    {user?.userName || "שם משתמש"}
                </Typography>

                {/* אימייל */}
                <Typography variant="body2" color="var(--whith-color)" sx={{ marginTop: 1 }}>
                    {user?.email || ""}
                </Typography>

                {/* כפתור יציאה */}
                <Box sx={{ display: "flex", justifyContent: "center", gap: 1, width: "100%", marginTop: 3 }}>
                    <Button
                        variant="outlined"
                        onClick={handleLogout}
                        sx={{
                            width: "40%",
                            borderColor: "var(--whith-color)",
                            color: "var(--whith-color)",
                            borderRadius:"32px",
                            "&:hover": {
                                backgroundColor: "transparent", // מונע שינוי צבע רקע
                                borderColor: "var(--whith-color)", // שומר על צבע המסגרת
                                color: "var(--whith-color)", // מונע שינוי צבע טקסט
                            },
                        }}
                    >
                        יציאה
                    </Button>
                </Box>
            </Popover>

        </>
    );
};

export default UserDetails;
