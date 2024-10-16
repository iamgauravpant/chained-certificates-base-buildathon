import AdminHero from "./Components/AdminHero";
import CertificateIssuerHero from "./Components/CertificateIssuerHero";
import UserHero from "./Components/UserHero";
const Index = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const admin = JSON.parse(localStorage.getItem("admin"));

  return (
    <>
      {admin && admin.role==="admin" && <AdminHero/>}
      {user && user.role === "certificateIssuer" && <CertificateIssuerHero />}
      {user &&  user.role === "user" && <UserHero />}
    </>
  );
};

export default Index;
