import { useEffect, useState } from "react";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetLoginSuccess } from "../../redux/slices/userSlice";
const Index = () => {
  const [option, setOption] = useState("login");
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {isRegistrationSuccess,isLoginSuccess} = useSelector(state=>state.user)
  const setIt = (val) => {
    console.log("setIt invoked...",val)
    setOption(val);
  };
  useEffect(()=>{
    isRegistrationSuccess===true && setTimeout(()=>window.location.reload(),1000)
  },[isRegistrationSuccess,navigate])
  useEffect(()=>{
    isLoginSuccess===true && navigate('/dashboard')
    dispatch(resetLoginSuccess())
  },[isLoginSuccess,navigate,dispatch])
  return (
    <>
      {option === "login" ? (
        <Login setOption={setIt} />
      ) : (
        <Signup setOption={setIt} />
      )}
    </>
  );
};

export default Index;
