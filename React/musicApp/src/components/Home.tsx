import { useSelector } from "react-redux";
import { StoreType } from "../store/store";
import FileUploader from "./FileUploader";

const Home = () =>{
    const user = useSelector((store: StoreType) => store.user);
    console.log("-----------------------------");
    console.log(user);
    return(<>
    home {user.user.userName}
    <FileUploader/>
    </>)
}
export default Home