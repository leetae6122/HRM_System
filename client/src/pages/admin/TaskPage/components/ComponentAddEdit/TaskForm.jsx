import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Space } from 'antd';
import _ from 'lodash';

TaskForm.propTypes = {
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  initialValues: PropTypes.object,
};

TaskForm.defaultProps = {
  onCancel: null,
  onSubmit: null,
  loading: false,
  initialValues: {
    title: '',
    describe: '',
  },
};

const wrapperCol = { offset: 8, span: 16 };

function TaskForm(props) {
  const { onCancel, onSubmit, loading, initialValues } = props;
  const [submittable, setSubmittable] = useState(false);
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

  const onFinish = (values) => {
    onSubmit(values);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Form
      name="normal_task"
      className="task-form"
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
      {initialValues.taskId ? (
        <Form.Item name="taskId" label="Task Id">
          <Input disabled={true} />
        </Form.Item>
      ) : null}
      <Form.Item
        name="title"
        label="Title"
        hasFeedback
        rules={[
          { required: true, message: 'Please input the title of the task!' },
        ]}
      >
        <Input
          placeholder="Enter the task title"
          disabled={loading}
          showCount
          maxLength={40}
        />
      </Form.Item>
      <Form.Item name="describe" label="Describe" hasFeedback>
        <Input.TextArea
          placeholder="Enter the task describe"
          disabled={loading}
          showCount
          rows={4}
          maxLength={200}
        />
      </Form.Item>
      <Form.Item wrapperCol={wrapperCol}>
        <Space style={{ float: 'right' }}>
          <Button htmlType="button" onClick={handleCancel} loading={loading}>
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={!submittable}
          >
            {initialValues.taskId ? 'Save' : 'Add'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

export default TaskForm;
