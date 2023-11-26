import PropTypes from 'prop-types';
import { Form, Button, Select } from 'antd';
import { useEffect, useState } from 'react';
import shiftApi from 'api/shiftApi';
import { toast } from 'react-toastify';
import { PlayCircleFilled } from '@ant-design/icons';

CreateQRCodeForm.propTypes = {
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  initialValues: PropTypes.object,
};

CreateQRCodeForm.defaultProps = {
  onSubmit: null,
  loading: false,
  initialValues: {
    shiftId: '',
  },
};

function CreateQRCodeForm(props) {
  const { onSubmit, loading, initialValues } = props;
  const [shiftOptions, setShiftOptions] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        const data = (await shiftApi.getCurrentShiftList()).data;
        const options = data.map((shift) => ({
          value: shift.id,
          label: `${shift.name} (${shift.startTime} - ${shift.endTime})`,
        }));
        setShiftOptions(options);
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

  return (
    <Form
      name="normal_create_qrcode_timekeeper"
      className="create-qr-code-timekeeper-form"
      initialValues={initialValues}
      onFinish={onFinish}
      form={form}
      size="large"
    >
      <Form.Item
        name="shiftId"
        label="Shift"
        hasFeedback
        rules={[{ required: true, message: 'Please select an shift!' }]}
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
          options={shiftOptions}
          disabled={loading}
        />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          style={{ width: '100%', marginLeft: 10 }}
          icon={<PlayCircleFilled />}
        >
          Create
        </Button>
      </Form.Item>
    </Form>
  );
}

export default CreateQRCodeForm;
