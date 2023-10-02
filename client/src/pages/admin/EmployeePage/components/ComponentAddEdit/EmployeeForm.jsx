import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
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
} from "antd";
import _ from "lodash";
import positionApi from "api/positionApi";
import { toast } from "react-toastify";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

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
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    gender: null,
    address: "",
    dateBirth: null,
    dateHired: null,
    positionId: null,
  },
};

const checkFile = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    toast.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    toast.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

const dateFormat = "DD/MM/YYYY";

const wrapperCol = { offset: 8, span: 16 };

function EmployeeForm(props) {
  const { onCancel, onSubmit, loading, initialValues } = props;
  const [submittable, setSubmittable] = useState(false);
  const [positionOptions, setPositionOptions] = useState([]);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialValues.avatarUrl);
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
      () => setSubmittable(false)
    );
  }, [values, form, initialValues]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        const response = await positionApi.getAll();
        const options = response.data.map((position) => ({
          value: position.id,
          label: position.name,
        }));
        setPositionOptions(options);
      } catch (error) {
        toast.error(error);
      }
    };
    fetchData();
    return () => controller.abort();
  }, []);

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
        maxWidth: 800,
      }}
      size="large"
    >
      <Row>
        {initialValues.employeeId ? (
          <Col span={12}>
            <Form.Item
              name="employeeId"
              label="Currency Id"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
            >
              <Input disabled={true} />
            </Form.Item>
          </Col>
        ) : null}
        <Col span={initialValues.employeeId ? 12 : 24}>
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
                    width: "100%",
                  }}
                />
              ) : (
                <UploadButton />
              )}
            </Upload>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: "Please input first name!" }]}
          >
            <Input
              placeholder="Enter first name"
              disabled={loading}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: "Please input last name!" }]}
          >
            <Input
              placeholder="Enter last name"
              disabled={loading}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="email"
            label="Email"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            rules={[
              { required: true, message: "Please input email!" },
              {
                type: "email",
                message: "The email entered is not a valid email!",
              },
            ]}
          >
            <Input placeholder="Enter email" disabled={loading} />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 19 }}
            rules={[
              { required: true, message: "Please input phone number!" },
              () => ({
                validator(_, value) {
                  if (!value || Number(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The phone number must have a number!")
                  );
                },
              }),
              () => ({
                validator(_, value) {
                  if (!value || value.length === 10) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Phone number must have 10 digits!")
                  );
                },
              }),
            ]}
          >
            <Input
              placeholder="Enter phone number"
              disabled={loading}
              showCount
              maxLength={10}
            />
          </Form.Item>
        </Col>
        <Col span={11}>
          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ required: true, message: "Please select gender!" }]}
          >
            <Select disabled={loading} placeholder="Select gender">
              <Select.Option value={true}>Male</Select.Option>
              <Select.Option value={false}>Female</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={13}>
          <Form.Item
            name="dateBirth"
            label="Date of birth"
            rules={[
              { required: true, message: "Please select date of birth!" },
            ]}
          >
            <DatePicker
              disabled={loading}
              placeholder="Enter date of birth"
              format={dateFormat}
            />
          </Form.Item>
        </Col>
        <Col span={11}>
          <Form.Item
            name="dateHired"
            label="Date of hire"
            labelCol={{ span: 9 }}
            wrapperCol={{ span: 15 }}
            rules={[{ required: true, message: "Please select date of hire!" }]}
          >
            <DatePicker
              disabled={loading}
              placeholder="Enter date of hire"
              format={dateFormat}
            />
          </Form.Item>
        </Col>
        <Col span={13}>
          <Form.Item
            name="positionId"
            label="Position"
            hasFeedback
            rules={[{ required: true, message: "Please select position!" }]}
          >
            <Select
              showSearch
              style={{
                width: "100%",
              }}
              placeholder="Search to Select"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "").includes(input)
              }
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={positionOptions}
              disabled={loading}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="address"
            label="Address"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            rules={[{ required: true, message: "Please input address!" }]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Enter address"
              disabled={loading}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item wrapperCol={wrapperCol}>
            <Space style={{ float: "right" }}>
              <Button htmlType="button" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" disabled={!submittable}>
                {initialValues.employeeId ? "Save" : "Add"}
              </Button>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

export default EmployeeForm;
