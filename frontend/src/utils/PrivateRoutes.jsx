import { Outlet, Navigate } from "react-router-dom";
const PrivateRoutes = () => {
    const accessToken = localStorage.getItem("accessToken");
    return(
        (!accessToken || accessToken==="") ? <Navigate to='/'/> : <Outlet/>
    )
}
export default PrivateRoutes;