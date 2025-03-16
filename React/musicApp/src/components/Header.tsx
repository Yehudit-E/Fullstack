
// import { useSelector } from "react-redux";
// import { StoreType } from "../store/store";
// import { Link } from "react-router";


// const Header =()=>{
  
//   const authState = useSelector((store: StoreType) => store.user.authState);
//   const user = useSelector((store: StoreType) => store.user);
//   console.log(user);
  
//   return(<>
//     {!authState && <Link to='/login'><button>התחברות</button></Link>}
//     {!authState && <Link to='/register'><button>הרשמה</button></Link>}
//     <Link to='/home'><button>בית</button></Link>
//     {/* {authState && <span>{user.user.userName}</span>} */}
//   </>)
// }
// export default Header
import { useSelector } from "react-redux";
import { StoreType } from "../store/store";
import { Link } from "react-router";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const Header = () => {
  const authState = useSelector((store: StoreType) => store.user.authState);
  const user = useSelector((store: StoreType) => store.user);
  console.log(user);

  return (
    <AppBar position="static" sx={{ backgroundColor: '#000000', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#FFA500' }}>
          Music App
        </Typography>
        <Box>
          {!authState && (
            <>
              <Button color="inherit" component={Link} to="/login">התחברות</Button>
              <Button color="inherit" component={Link} to="/register">הרשמה</Button>
            </>
          )}
          <Button color="inherit" component={Link} to="/home">בית</Button>
          {authState && <Typography variant="body1" component="span" sx={{ color: '#FFA500' }}>{user.user.userName}</Typography>}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;