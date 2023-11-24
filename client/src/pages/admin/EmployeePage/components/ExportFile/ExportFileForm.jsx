import PropTypes from 'prop-types';
import { Form, Button, Space, DatePicker } from 'antd';
import { useEffect, useState } from 'react';
import { getMonthName } from 'utils/handleDate';
import _ from 'lodash';

ExportFileForm.propTypes = {
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
};

ExportFileForm.defaultProps = {
  onCancel: null,
  onSubmit: null,
  loading: false,
};

const initialValues = {
  month: '',
};

const wrapperCol = { offset: 8, span: 16 };

function ExportFileForm(props) {
  const { onCancel, onSubmit, loading } = props;
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
  }, [values, form]);

  const onFinish = (values) => {
    onSubmit(values);
  };

  const handleCancel = () => {
    onCancel();
  };

  const disabledDate = (current) => {
    return current && current.valueOf() > Date.now();
  };

  return (
    <Form
      name="normal_export_statistics_file"
      className="export-statistics-file-form"
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
        name="month"
        label="Month"
        rules={[{ required: true, message: 'Please select month!' }]}
      >
        <DatePicker
          picker="month"
          allowClear={false}
          format={(value) => getMonthName(value)}
          disabled={loading}
          style={{
            width: '100%',
          }}
          disabledDate={disabledDate}
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
            Export
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

export default ExportFileForm;
