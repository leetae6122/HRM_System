import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Input,
  Button,
  Space,
  Descriptions,
  Radio,
  Typography,
} from 'antd';
import dayjs from 'dayjs';

EditLeaveForm.propTypes = {
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  infoLeave: PropTypes.object,
};

EditLeaveForm.defaultProps = {
  onCancel: null,
  onSubmit: null,
  loading: false,
  infoLeave: {
    leaveId: null,
    title: '',
    description: '',
    leaveFrom: null,
    leaveTo: null,
    employeeData: null,
    status: '',
  },
};

const createItems = (data) => [
  {
    key: '1',
    label: 'Leave Id',
    children: data.leaveId,
  },
  {
    key: '2',
    label: 'Status',
    children: (
      <span
        style={{
          color:
            data.status === 'Reject'
              ? 'red'
              : data.status === 'Approved'
              ? 'green'
              : '',
        }}
      >
        {data.status}
      </span>
    ),
  },
  {
    key: '3',
    label: 'Employee',
    children: `#${data.employeeData.id} - ${data.employeeData.lastName} ${data.employeeData.firstName}`,
    span: 2,
  },
  {
    key: '4',
    label: 'Title',
    children: data.title,
    span: 2,
  },
  {
    key: '5',
    label: 'Description',
    children: data.description,
    span: 2,
  },
  {
    key: '6',
    label: 'Leave From',
    children: dayjs(data.leaveFrom).format('DD/MM/YYYY'),
  },
  {
    key: '7',
    label: 'Leave To',
    children: dayjs(data.leaveTo).format('DD/MM/YYYY'),
  },
  {
    key: '8',
    label: 'Handler',
    children: data.adminEId
      ? `#${data.handlerData.id} - ${data.handlerData.lastName} ${data.handlerData.firstName}`
      : '',
  },
];

const initialValues = {
  status: '',
  reasonRejection: null,
};

const wrapperCol = { offset: 8, span: 16 };

function EditLeaveForm(props) {
  const { onCancel, onSubmit, loading, infoLeave } = props;
  const [isChangeReject, setIsChangeReject] = useState(false);
  const [form] = Form.useForm();
  const items = createItems(infoLeave);

  const onFinish = (values) => {
    onSubmit(values);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div>
      <Descriptions
        layout="horizontal"
        bordered
        title={<Typography.Title level={4}>Info Leave</Typography.Title>}
        column={2}
        items={items}
      />
      {infoLeave.status === 'Pending' ? (
        <>
          <Typography.Title level={4}>Edit Leave</Typography.Title>
          <Form
            name="normal_edit_leave"
            className="edit-leave-form"
            initialValues={initialValues}
            onFinish={onFinish}
            form={form}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            style={{
              marginTop: 10,
              maxWidth: 600,
            }}
            size="large"
          >
            <Form.Item
              label="Status"
              name="status"
              rules={[
                {
                  required: true,
                  message: 'Please select status!',
                },
              ]}
            >
              <Radio.Group disabled={loading}>
                <Radio.Button
                  value="Reject"
                  onClick={() => setIsChangeReject(true)}
                  style={{ color: 'red' }}
                >
                  Reject
                </Radio.Button>
                <Radio.Button
                  value="Approved"
                  onClick={() => setIsChangeReject(false)}
                  style={{ color: 'green' }}
                >
                  Approved
                </Radio.Button>
              </Radio.Group>
            </Form.Item>
            {isChangeReject ? (
              <>
                <Form.Item
                  name="reasonRejection"
                  label="Reasons for rejection"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  rules={[
                    {
                      required: true,
                      message: 'Please input Reasons for rejection!',
                    },
                  ]}
                >
                  <Input.TextArea
                    rows={3}
                    placeholder="Enter Reasons for rejection"
                    disabled={loading}
                  />
                </Form.Item>
              </>
            ) : null}
            <Form.Item wrapperCol={wrapperCol}>
              <Space style={{ float: 'right' }}>
                <Button
                  htmlType="button"
                  onClick={handleCancel}
                  loading={loading}
                >
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Save
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </>
      ) : null}
    </div>
  );
}

export default EditLeaveForm;
