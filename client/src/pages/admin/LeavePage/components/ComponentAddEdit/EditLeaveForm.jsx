import { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Space, Descriptions, Radio } from 'antd';

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

const createItems = (value) => [
  {
    key: '1',
    label: 'Leave Id',
    children: value.leaveId,
  },
  {
    key: '2',
    label: 'Employee Name',
    children: `${value.employeeData.firstName} ${value.employeeData.lastName}`,
  },
  {
    key: '3',
    label: 'Title',
    children: value.title,
    span: 2,
  },
  {
    key: '4',
    label: 'Description',
    children: value.description,
    span: 2,
  },
  {
    key: '5',
    label: 'Leave From',
    children: value.leaveFrom,
  },
  {
    key: '6',
    label: 'Leave To',
    children: value.leaveTo,
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
        title="Leave Info"
        column={2}
        items={items}
      />
      {infoLeave.status === 'Pending' ? (
        <Form
          name="normal_edit_leave"
          className="edit-leave-form"
          initialValues={initialValues}
          onFinish={onFinish}
          form={form}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          style={{
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
                value="Approve"
                onClick={() => setIsChangeReject(false)}
                style={{ color: 'green' }}
              >
                Approve
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
              <Button htmlType="button" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Space>
          </Form.Item>
        </Form>
      ) : null}
    </div>
  );
}

export default EditLeaveForm;
