import AdminLayout from "./AdminLayout"
import UserLayout from "./UserLayout"
const Index = () => {
  const userData = JSON.parse(localStorage.getItem("user"));
  console.log("userData :",userData);
  const adminData = JSON.parse(localStorage.getItem("admin"));
  console.log("adminData :",adminData);
  return (
    <>
      {userData===null && adminData && <AdminLayout />}
      {adminData===null && userData && <UserLayout />}
    </>
  );
};
export default Index;