import { Button, Form, Steps, theme } from "antd";
import CertificateCollection from "./CertificateCollection";
import { setCreateCertificateCurrentView, setReceiverDetailsFormData } from "../../../redux/slices/certificateIssuerSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getCertificateCollections, getCertificateReceivers } from "../../../redux/actions/certificateIssuer";
import ReceiverDetails from "./ReceiverDetails";
import CertificateGeneratorTool from "./CertificateGeneratorTool";

const Hero = () => {
  const { token } = theme.useToken();
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const {selectedCertificateReceiverType} = useSelector(state=> state.certificateIssuer);
  const steps = [
    {
      title: "Certificate Collection",
      content: <CertificateCollection form={form1} />,
    },
    {
      title: "Receiver Details",
      content: <ReceiverDetails form={form2} />,
    },
    {
      title: "Generate Certificate",
      content: <CertificateGeneratorTool/>,
    },
  ];  
  const dispatch = useDispatch();
  const {createCertificateCurrentView} = useSelector(state => state.certificateIssuer);
  const next = () => {
    if (createCertificateCurrentView === 0) {
      form1
        .validateFields()
        .then(values => {
          console.log("values :",values)
          dispatch(setCreateCertificateCurrentView(createCertificateCurrentView + 1));
        })
        .catch(errorInfo => {
          console.log('Failed:', errorInfo);
        });
    } else if (createCertificateCurrentView === 1) {
      form2
        .validateFields()
        .then(values => {
          selectedCertificateReceiverType==="new"&& dispatch(setReceiverDetailsFormData(values));
          dispatch(setCreateCertificateCurrentView(createCertificateCurrentView + 1));
        })
        .catch(errorInfo => {
          console.log('Failed:', errorInfo);
        });
    }  
    else {
      dispatch(setCreateCertificateCurrentView(createCertificateCurrentView + 1));
    }
  };
  const prev = () => {
    dispatch(setCreateCertificateCurrentView(createCertificateCurrentView - 1));
  };
  //     createCertificateCurrentView === 1 && dispatch()

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));
  const contentStyle = {
    textAlign: "center",
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
  };
  useEffect(()=>{
    dispatch(getCertificateCollections());
  },[dispatch]);
  useEffect(()=>{
    dispatch(getCertificateReceivers());
  },[dispatch])
  return (
    <>
      <Steps current={createCertificateCurrentView} items={items} />
      <div style={contentStyle}>{steps[createCertificateCurrentView].content}</div>
      <div
        style={{
          marginTop: 24,
        }}
      >
        {createCertificateCurrentView < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            Next
          </Button>
        )}
        {/* {createCertificateCurrentView === steps.length - 1 && (
          <Button
            type="primary"
            onClick={() => message.success("Processing complete!")}
          >
            Done
          </Button>
        )} */}
        {createCertificateCurrentView > 0 && (
          <Button
            style={{
              margin: "0 8px",
            }}
            onClick={() => prev()}
          >
            Previous
          </Button>
        )}
      </div>
    </>
  );
};

export default Hero;
