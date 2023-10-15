import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Space, DatePicker, Radio } from 'antd';
import _ from 'lodash';

ProjectForm.propTypes = {
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  initialValues: PropTypes.object,
};

ProjectForm.defaultProps = {
  onCancel: null,
  onSubmit: null,
  loading: false,
  initialValues: {
    title: '',
    summary: '',
    detail: '',
    startDate: null,
    endDate: null,
    status: '',
  },
};

const dateFormat = 'DD/MM/YYYY';

const wrapperCol = { offset: 8, span: 16 };

function ProjectForm(props) {
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
      name="normal_project"
      className="project-form"
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
      {initialValues.projectId ? (
        <Form.Item name="projectId" label="Project Id">
          <Input disabled={true} />
        </Form.Item>
      ) : null}
      <Form.Item
        name="title"
        label="Title"
        hasFeedback
        rules={[
          { required: true, message: 'Please input the title of the project!' },
        ]}
      >
        <Input
          placeholder="Enter the project title"
          disabled={loading}
          showCount
          maxLength={40}
        />
      </Form.Item>
      <Form.Item
        name="summary"
        label="Summary"
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please input the summary of the project!',
          },
        ]}
      >
        <Input.TextArea
          placeholder="Enter the project summary"
          disabled={loading}
          showCount
          maxLength={80}
        />
      </Form.Item>
      <Form.Item name="detail" label="Detail" hasFeedback>
        <Input.TextArea
          placeholder="Enter the project detail"
          disabled={loading}
          rows={3}
        />
      </Form.Item>
      <Form.Item
        name="startDate"
        label="Start Date"
        hasFeedback
        rules={[{ required: true, message: 'Please select start date!' }]}
      >
        <DatePicker
          disabled={loading}
          placeholder="Enter start date"
          format={dateFormat}
          style={{
            width: '100%',
          }}
        />
      </Form.Item>
      <Form.Item name="endDate" label="End Date">
        <DatePicker
          disabled={loading}
          placeholder="Enter end date"
          format={dateFormat}
          style={{
            width: '100%',
          }}
        />
      </Form.Item>
      {initialValues.projectId ? (
        <Form.Item
          name="status"
          label="Status"
          hasFeedback
          rules={[{ required: true, message: 'Please select status!' }]}
        >
          <Radio.Group>
            <Radio value="Running">
              <span style={{ color: 'blue' }}>Running</span>
            </Radio>
            <Radio value="Complete">
              <span style={{ color: 'green' }}>Complete</span>
            </Radio>
          </Radio.Group>
        </Form.Item>
      ) : null}

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
            {initialValues.projectId ? 'Save' : 'Add'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

export default ProjectForm;
