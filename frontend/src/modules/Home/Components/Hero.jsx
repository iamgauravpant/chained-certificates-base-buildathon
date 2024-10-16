import { Typography , Button} from "antd"
import { useNavigate } from "react-router-dom";
import illustration from "../../../assets/home-illustration.svg";

const {Title} = Typography;
const Hero = () => {
    const navigate = useNavigate();
    return (
        <>
        <img src={illustration} width={"400px"} height={"300px"}></img>
        <Title>ChainedCertificates</Title>
        <Title level={3}>Blockchain-Driven Certification: Reliable, Immutable, Authentic</Title>
        <Button size="large" type="primary" onClick={()=>navigate('/login')}>Log In</Button>
        </>
    )
}

export default Hero