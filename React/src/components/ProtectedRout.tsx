import { useSelector } from "react-redux";
import { StoreType } from "../store/store";
import { Navigate } from "react-router"; // או Link אם לא רוצים לעבור ישירות לדף
import { JSX } from "react";

interface ProtectedRouteProps {
  element: JSX.Element;
}
const ProtectedRoute = ({ element }: ProtectedRouteProps) => {
  const authState = useSelector((store: StoreType) => store.user.authState);
  const status = useSelector((store: StoreType) => store.user.status);

  // אם המידע טוען, אפשר להציג הודעת טעינה או להמתין
  if (status === "loading") {
    return <div>טוען...</div>; // או spinner טעינה
  }

  if (!authState) {
    return <Navigate to="/auth" />; // מפנה אם המשתמש לא מחובר
  }

  return element; // מציג את התוכן המוגן אם המשתמש מחובר
};


export default ProtectedRoute;
