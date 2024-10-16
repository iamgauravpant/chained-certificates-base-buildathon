import { Button, Form, Input, Radio, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { deployCertificateCollection } from '../../../redux/actions/certificateIssuer';
import { setDeployedCertificateCollection, setSelectedCertificateCollectionType } from '../../../redux/slices/certificateIssuerSlice';

// eslint-disable-next-line react/prop-types
const CertificateCollection = ({form}) => {
  const dispatch = useDispatch();
  const { selectedCertificateCollectionType } = useSelector(state => state.certificateIssuer);
  const {deployedCertificateCollection,isDeployCertificateCollectionSuccess,isDeployCertificateCollectionLoading,certificateCollections} = useSelector(state => state.certificateIssuer);
  console.log("certificateCollections ",certificateCollections)
  const deployedCollections = certificateCollections.map((collection)=>({value:collection.collection_name,label:collection.collection_name}))
  const handleActionChange = (e) => {
    dispatch(setSelectedCertificateCollectionType(e.target.value))
  };

  const handleChange = (value) => {
    console.log(`Selected: ${value}`);
    const selectedCollection = certificateCollections.filter((collection)=>collection.collection_name===value)
    dispatch(setDeployedCertificateCollection(selectedCollection[0]))
  };

  const onFinish = (values) => {
    console.log('Success:', values);
    if(values.action==="create") {
      dispatch(deployCertificateCollection({collection_name:values.collection_name,collection_symbol:values.collection_symbol}))
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      form={form}
      name="certificate_collection"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{
        remember: true,
        action: selectedCertificateCollectionType, // set the default value here
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Collection Type"
        name="action"
        rules={[{ required: true, message: 'Please select an action!' }]}
      >
        <Radio.Group initialValue={selectedCertificateCollectionType} onChange={handleActionChange}>
          <Radio value="create">New Collection</Radio>
          <Radio value="use">Existing Collection</Radio>
        </Radio.Group>
      </Form.Item>

      {selectedCertificateCollectionType === 'create' && (
        <>
          <Form.Item
            label="Collection Name"
            name="collection_name"
            rules={[{ required: true, message: 'Please input Collection Name!' }]}
            initialValue={deployedCertificateCollection && deployedCertificateCollection.collection_name}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Collection Symbol"
            name="collection_symbol"
            rules={[{ required: true, message: 'Please input Collection Symbol!' }]}
            initialValue={deployedCertificateCollection && deployedCertificateCollection.collection_symbol}
          >
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" loading={isDeployCertificateCollectionLoading} disabled={isDeployCertificateCollectionSuccess}>
              Deploy Collection
            </Button>
          </Form.Item>
        </>
      )}

      {selectedCertificateCollectionType === 'use' && (
        <Form.Item
          label="Collection"
          name="collection"
          rules={[{ required: true, message: 'Please input Collection Name!' }]}
          initialValue={deployedCertificateCollection && deployedCertificateCollection.collection_name}
        >
          <Select onChange={handleChange} options={deployedCollections} />
        </Form.Item>
      )}
    </Form>
  );

}

export default CertificateCollection