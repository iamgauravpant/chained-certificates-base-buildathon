import { Outlet, Navigate } from "react-router-dom";
const CertificateIssuerRoute = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return(
        (user && user.role==="certificateIssuer") ? <Outlet/> :<Navigate to='/'/>
    )
}
export default CertificateIssuerRoute;