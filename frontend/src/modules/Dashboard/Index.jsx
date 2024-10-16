import UserHero from "./Components/UserHero";
import AdminHero from "./Components/AdminHero";
import CertificateIssuerHero from "./Components/CertificateIssuerHero";
import { useEffect } from "react";
import { getLoggedInUserTimezone } from "../../utils/getLoggedInUserTimezone";

const Index = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const admin = JSON.parse(localStorage.getItem("admin"));
  console.log("admin :",admin)
  useEffect(()=>{
    getLoggedInUserTimezone()
  },[])
  
  return (
    <>
        {
            admin && admin.role==="admin" && <AdminHero />
        }
        {
            user && user.role==="certificateIssuer" && <CertificateIssuerHero/>
        }
        {
            user && user.role==="user" && <UserHero />
        }
    </>
  );
};

export default Index;
