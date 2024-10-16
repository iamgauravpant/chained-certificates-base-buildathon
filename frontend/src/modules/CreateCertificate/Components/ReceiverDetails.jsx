import { Form, Input, Radio, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import certificateIssuerSlice, {
  setCertificateReceiverType,
  setReceiverDetailsFormData,
} from "../../../redux/slices/certificateIssuerSlice";
import { getCertificateReceiver } from "../../../redux/actions/certificateIssuer";
import { useEffect, useState } from "react";
import { useMemo } from "react"; // import useMemo

// eslint-disable-next-line react/prop-types
const ReceiverDetails = ({ form }) => {
  const dispatch = useDispatch();

  const [searchValue, setSearchValue] = useState(""); // Hold the search input value
  const [options, setOptions] = useState([]); // Hold the dynamic options

  const { selectedCertificateReceiverType, certificateReceivers } = useSelector(
    (state) => state.certificateIssuer
  );
  // const receiversList = certificateReceivers.map((certificateReceiver) => ({
  //   value: certificateReceiver._id,
  //   label: certificateReceiver.email,
  // }));

  // memoize receiversList to prevent it from changing on every render
  const receiversList = useMemo(() => {
    return certificateReceivers.map((certificateReceiver) => ({
      value: certificateReceiver._id,
      label: certificateReceiver.email,
    }));
  }, [certificateReceivers]);

  // // Update the options for the Select dropdown
  // useEffect(() => {
  //   setOptions(receiversList);
  // }, [receiversList]);
  useEffect(() => {
    // Update the options only if receiversList has changed
    setOptions((prevOptions) => {
      if (JSON.stringify(prevOptions) !== JSON.stringify(receiversList)) {
        return receiversList;
      }
      return prevOptions;
    });
  }, [receiversList]);
  

  const handleActionChange = (e) => {
    dispatch(setCertificateReceiverType(e.target.value));
  };
  const handleChange = (value) => {
    console.log(`Selected: ${value}`);
    setSearchValue(value); // Hold the selected value
    const certificateReceiverDetails = certificateReceivers.filter(
      (certificateReceiver) => certificateReceiver._id === value
    );
    console.log("certificateReceiverDetails :",certificateReceiverDetails)
    const certificateReceiverId = certificateReceiverDetails[0]._id;
    const certReceiverName = certificateReceiverDetails[0].name;
    const certReceiverEmail = certificateReceiverDetails[0].email;
    const certReceiverAddress = certificateReceiverDetails[0].ethereumAddress;
    console.log("to be dispatched :",certReceiverName,certReceiverEmail,certReceiverAddress)
    dispatch(
      setReceiverDetailsFormData({
        certificateReceiverId,
        certReceiverName,
        certReceiverEmail,
        certReceiverAddress,
      })
    );
  };
  const onSearch = (value) => {
    console.log("search value :", value);
    setSearchValue(value); // Update the search value
    value && dispatch(getCertificateReceiver({ identifier: value }));
  };

  return (
    <>
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        autoComplete="off"
        form={form}
        initialValues={{
          remember: true,
          action: selectedCertificateReceiverType, // set the default value here
        }}
      >
        <Form.Item
          label="Receiver Type"
          name="action"
          rules={[{ required: true, message: "Please select receiver type!" }]}
        >
          <Radio.Group
            initialValues={selectedCertificateReceiverType}
            onChange={handleActionChange}
          >
            <Radio value="new">New Receiver</Radio>
            <Radio value="existing">Existing Receiver</Radio>
          </Radio.Group>
        </Form.Item>
        {selectedCertificateReceiverType === "new" && (
          <>
            <Form.Item
              label="Receiver Name"
              name="certReceiverName"
              rules={[
                {
                  required: true,
                  message: "Please input receiver name!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Receiver Email"
              name="certReceiverEmail"
              rules={[
                {
                  required: true,
                  message: "Please input receiver email!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Receiver Address ( Optional )"
              name="certReceiverAddress"
              rules={[
                {
                  message: "Please input receiver ETH address!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </>
        )}
        {selectedCertificateReceiverType === "existing" && (
          <Form.Item
            label="Receiver Email"
            name="receiverEmail"
            rules={[
              { required: true, message: "Please input receiver's email" },
            ]}
          >
            <Select
              placeholder="Enter receiver's email"
              showSearch
              value={searchValue} // Set the value of the Select
              onSearch={onSearch}
              onChange={handleChange}
              options={options} // Dynamic options based on API results
              filterOption={false} // Disable default filtering, rely on API search
            />
          </Form.Item>
        )}
      </Form>
    </>
  );
};

export default ReceiverDetails;
