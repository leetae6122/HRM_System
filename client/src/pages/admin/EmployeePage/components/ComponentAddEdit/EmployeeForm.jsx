import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Input,
  Button,
  Space,
  Col,
  DatePicker,
  Select,
  Row,
  Upload,
} from 'antd';
import _ from 'lodash';
import positionApi from 'api/positionApi';
import { toast } from 'react-toastify';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import departmentApi from 'api/departmentApi';

EmployeeForm.propTypes = {
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  initialValues: PropTypes.object,
};

EmployeeForm.defaultProps = {
  onCancel: null,
  onSubmit: null,
  loading: false,
  initialValues: {
    employeeId: null,
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    gender: null,
    address: '',
    dateBirth: null,
    dateHired: null,
    positionId: null,
    dateOff: null,
    avatar: null,
    departmentId: null,
  },
};

const checkFile = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    toast.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    toast.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

const dateFormat = 'DD/MM/YYYY';

const wrapperCol = { offset: 8, span: 16 };

function EmployeeForm(props) {
  const { onCancel, onSubmit, loading, initialValues } = props;
  const [submittable, setSubmittable] = useState(false);
  const [positionOptions, setPositionOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [loadingPositionOption, setLoadingPositionOption] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialValues.avatar);
  const [form] = Form.useForm();

  const values = Form.useWatch([], form);

  useEffect(() => {
    form.validateFields({ validateOnly: true }).then(
      () => {
        if (!_.isEqual(initialValues, values)) {
          setSubmittable(true);
        } else {
          setSubmittable(false);
        }
      },
      () => setSubmittable(false),
    );
  }, [values, form, initialValues]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchDepartmentOptions = async () => {
      try {
        const response = await departmentApi.getAll();
        const options = response.data.map((department) => ({
          value: department.id,
          label: department.name,
        }));
        setDepartmentOptions(options);
      } catch (error) {
        toast.error(error);
      }
    };
    fetchDepartmentOptions();
    return () => controller.abort();
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    const fetchDepartmentOptions = async () => {
      try {
        const response = await departmentApi.getAll();
        const options = response.data.map((department) => ({
          value: department.id,
          label: department.name,
        }));
        setDepartmentOptions(options);
      } catch (error) {
        toast.error(error);
      }
    };
    const fetchPositionOptions = async () => {
      try {
        if (initialValues.departmentId) {
          const response = await positionApi.getAllWithDepartmentId(
            initialValues.departmentId,
          );
          const options = response.data.map((position) => ({
            value: position.id,
            label: position.name,
          }));
          setPositionOptions(options);
        }
      } catch (error) {
        toast.error(error);
      }
    };
    fetchDepartmentOptions();
    fetchPositionOptions();
    return () => controller.abort();
  }, [initialValues.departmentId]);

  const handleChange = (info) => {
    if (!checkFile) return;
    setLoadingUpload(true);
    const src = URL.createObjectURL(info.file);
    setImageUrl(src);
    setLoadingUpload(false);
  };

  const onFinish = (values) => {
    onSubmit(values);
  };

  const handleCancel = () => {
    onCancel();
  };

  const UploadButton = () => (
    <div>
      {loadingUpload ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  const onChangeDepartment = async (value) => {
    try {
      setLoadingPositionOption(true);
      const response = await positionApi.getAllWithDepartmentId(value);
      const options = response.data.map((position) => ({
        value: position.id,
        label: position.name,
      }));
      setPositionOptions(options);
      form.setFieldValue('positionId', null);
      setLoadingPositionOption(false);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <Form
      name="normal_employee"
      className="employee-form"
      initialValues={initialValues}
      onFinish={onFinish}
      form={form}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{
        maxWidth: '100%',
      }}
      size="large"
    >
      <Row>
        <Col span={12}>
          <Form.Item
            name="avatar"
            label="Avatar"
            valuePropName="file"
            getValueFromEvent={(e) => e.file}
          >
            <Upload
              name="avatar"
              listType="picture-card"
              showUploadList={false}
              maxCount={1}
              beforeUpload={() => false}
              onChange={handleChange}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="avatar"
                  style={{
                    width: '100%',
                  }}
                />
              ) : (
                <UploadButton />
              )}
            </Upload>
          </Form.Item>
        </Col>
        {initialValues.employeeId ? (
          <Col span={12}>
            <Form.Item name="dateOff" label="Days off work">
              <DatePicker
                disabled={loading}
                placeholder="Enter days off work"
                format={dateFormat}
                style={{
                  width: '100%',
                }}
              />
            </Form.Item>
          </Col>
        ) : null}

        <Col span={initialValues.employeeId ? 24 : 12}>
          <Form.Item
            name="employeeId"
            label="Employee Id"
            rules={[{ required: true, message: 'Please input employee Id!' }]}
            hasFeedback
            labelCol={{ span: initialValues.employeeId ? 4 : 6 }}
            wrapperCol={{ span: initialValues.employeeId ? 20 : 18 }}
          >
            <Input
              disabled={initialValues.employeeId ? true : loading}
              style={{
                color: 'black',
              }}
              placeholder="Enter employee Id"
              showCount
              maxLength={10}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: 'Please input last name!' }]}
            hasFeedback
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          >
            <Input
              placeholder="Enter last name"
              disabled={loading}
              maxLength={30}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: 'Please input first name!' }]}
            hasFeedback
          >
            <Input
              placeholder="Enter first name"
              disabled={loading}
              maxLength={30}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input email!' },
              {
                type: 'email',
                message: 'The email entered is not a valid email!',
              },
            ]}
            hasFeedback
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            <Input
              placeholder="Enter email"
              disabled={loading}
              showCount
              maxLength={60}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="citizenshipId"
            label="Citizenship ID"
            rules={[
              {
                required: true,
                message: 'Please input citizenship ID!',
              },
            ]}
            hasFeedback
          >
            <Input
              placeholder="Enter citizenship ID"
              disabled={loading}
              showCount
              maxLength={20}
            />
          </Form.Item>
        </Col>
        <Col span={16}>
          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[
              { required: true, message: 'Please input phone number!' },
              () => ({
                validator(_, value) {
                  if (!value || Number(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('The phone number must have a number!'),
                  );
                },
              }),
              () => ({
                validator(_, value) {
                  if (!value || value.length === 10) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('Phone number must have 10 digits!'),
                  );
                },
              }),
            ]}
            hasFeedback
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          >
            <Input
              placeholder="Enter phone number"
              disabled={loading}
              showCount
              maxLength={10}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ required: true, message: 'Please select gender!' }]}
            hasFeedback
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 17 }}
          >
            <Select disabled={loading} placeholder="Select gender">
              <Select.Option value={true}>Male</Select.Option>
              <Select.Option value={false}>Female</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="dateBirth"
            label="Date of birth"
            rules={[
              { required: true, message: 'Please select date of birth!' },
            ]}
            hasFeedback
          >
            <DatePicker
              disabled={loading}
              placeholder="Enter date of birth"
              format={dateFormat}
              style={{
                width: '100%',
              }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="dateHired"
            label="Date of hire"
            rules={[{ required: true, message: 'Please select date of hire!' }]}
            hasFeedback
          >
            <DatePicker
              disabled={loading}
              placeholder="Enter date of hire"
              format={dateFormat}
              style={{
                width: '100%',
              }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="departmentId"
            label="Department"
            hasFeedback
            rules={[{ required: true, message: 'Please select a department!' }]}
          >
            <Select
              showSearch
              style={{
                width: '100%',
              }}
              placeholder="Search to Select"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '').includes(input)
              }
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '')
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? '').toLowerCase())
              }
              options={departmentOptions}
              disabled={loading}
              onChange={onChangeDepartment}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="positionId"
            label="Position"
            hasFeedback
            rules={[{ required: true, message: 'Please select a position!' }]}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          >
            <Select
              showSearch
              style={{
                width: '100%',
              }}
              placeholder="Search to Select"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '').includes(input)
              }
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '')
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? '').toLowerCase())
              }
              options={positionOptions}
              disabled={
                loading ||
                !form.getFieldValue('departmentId') ||
                loadingPositionOption
              }
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="address"
            label="Address"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            <Input.TextArea
              rows={2}
              placeholder="Enter address"
              disabled={loading}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item wrapperCol={wrapperCol}>
            <Space style={{ float: 'right' }}>
              <Button
                htmlType="button"
                onClick={handleCancel}
                loading={loading}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={!submittable}
              >
                {initialValues.employeeId ? 'Save' : 'Add'}
              </Button>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

export default EmployeeForm;
