import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Form, Input, Button, Space, Select, Switch, Row, Col } from "antd";
import { toast } from "react-toastify";
import _ from "lodash";
import employeeApi from "api/employeeApi";
import { LockOutlined } from "@ant-design/icons";

UserForm.propTypes = {
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  initialValues: PropTypes.object,
};

UserForm.defaultProps = {
  onCancel: null,
  onSubmit: null,
  loading: false,
  initialValues: {
    username: "",
    password: "",
    isAdmin: null,
    isActived: null,
    employeeId: null,
  },
};

const wrapperCol = { offset: 8, span: 16 };

function UserForm(props) {
  const { onCancel, onSubmit, loading, initialValues } = props;
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [submittable, setSubmittable] = useState(false);
  const [isChangePass, setIsChangePass] = useState(
    initialValues.userId ? false : true
  );
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
        const data = (await employeeApi.getEmployeeNotHaveUser()).data;
        const options = data.map((employee) => ({
          value: employee.id,
          label: `${employee.firstName} ${employee.lastName}`,
        }));
        setEmployeeOptions(options);
      } catch (error) {
        toast.error(error);
      }
    };
    fetchData();
    return () => controller.abort();
  }, []);

  const onFinish = (values) => {
    onSubmit(values);
  };

  const handleCancel = () => {
    onCancel();
  };

  const onEmployeeChange = (value) => {
    const findEmployee = employeeOptions.find((item) => item.value === value);
    const data = _.lowerCase(findEmployee.label).replace(/\s/g, ".");
    form.setFieldValue("username", data);
  };

  return (
    <Form
      name="normal_user"
      className="user-form"
      initialValues={initialValues}
      onFinish={onFinish}
      form={form}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      style={{
        maxWidth: 600,
      }}
      size="large"
    >
      {initialValues.userId ? (
        <Form.Item name="userId" label="User Id">
          <Input disabled={true} />
        </Form.Item>
      ) : null}
      {initialValues.userId ? (
        <Form.Item name="employeeId" label="Employee Id">
          <Input disabled={true} />
        </Form.Item>
      ) : (
        <Form.Item
          name="employeeId"
          label="Employee"
          hasFeedback
          rules={[{ required: true, message: "Please select employee!" }]}
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
            options={employeeOptions}
            onChange={onEmployeeChange}
            disabled={loading}
          />
        </Form.Item>
      )}

      <Form.Item
        name="username"
        label="Username"
        hasFeedback
        rules={[
          {
            required: true,
            message: "Please input the username of the employee!",
          },
        ]}
      >
        <Input
          placeholder="Enter username"
          disabled={loading}
          showCount
          maxLength={100}
        />
      </Form.Item>
      {initialValues.userId ? (
        <Form.Item label="Change Password" valuePropName="checked">
          <Switch
            disabled={loading}
            checked={isChangePass}
            onClick={() => setIsChangePass(!isChangePass)}
          />
        </Form.Item>
      ) : null}

      {isChangePass ? (
        <>
          <Form.Item
            name="password"
            label="Password"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please input the password of the employee!",
              },
              {
                pattern: new RegExp(
                  "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
                ),
                message:
                  "Password must contain at least one lowercase letter, uppercase letter, number, and special character",
              },
            ]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Enter password"
              disabled={loading}
              showCount
              maxLength={100}
            />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please confirm password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "The confirm password that you entered do not match!"
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Enter your confirm password"
              disabled={loading}
            />
          </Form.Item>
        </>
      ) : null}
      <Row justify="center">
        <Col span={8}>
          <Form.Item name="isAdmin" label="Admin" valuePropName="checked">
            <Switch disabled={loading} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="isActived" label="Active" valuePropName="checked">
            <Switch disabled={loading} />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item wrapperCol={wrapperCol}>
        <Space style={{ float: "right" }}>
          <Button htmlType="button" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" disabled={!submittable}>
            {initialValues.positionId ? "Save" : "Add"}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

export default UserForm;
