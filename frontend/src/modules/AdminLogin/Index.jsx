import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Login from "./Components/Login";
import Signup from "./Components/Signup"
import { resetLoginSuccess } from "../../redux/slices/adminSlice";

const Index = () => {
    const [option, setOption] = useState("login");
    const {isRegistrationSuccess,isLoginSuccess} = useSelector(state=>state.admin);

    const navigate = useNavigate()
    const dispatch = useDispatch()
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
    )
}

export default Index