import UserHero from "./Components/UserHero";
import AdminHero from "./Components/AdminHero";

const Index = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const admin = JSON.parse(localStorage.getItem("admin"));

  return (
    <>
      {admin===null && user && <UserHero/>}
      {user===null && admin && <AdminHero/> }  
    </>
  );
};

export default Index;
