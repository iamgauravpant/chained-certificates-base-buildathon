import { Outlet, Navigate } from "react-router-dom";
const CreateCertificateChecker = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("user logged ehre ",user)
    return(
        (user && user.role==="certificateIssuer" && !user.ethereumAddress) ? <Navigate to='/dashboard'/> : <Outlet/>
    )
}
export default CreateCertificateChecker;