import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Space, InputNumber, Select } from 'antd';
import { toast } from 'react-toastify';
import _ from 'lodash';
import countryApi from 'api/countryApi';
import TextArea from 'antd/es/input/TextArea';

OfficeForm.propTypes = {
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  initialValues: PropTypes.object,
};

OfficeForm.defaultProps = {
  onCancel: null,
  onSubmit: null,
  loading: false,
  initialValues: {
    title: '',
    streetAddress: '',
    postalCode: null,
    stateProvince: '',
    city: '',
    countryId: null,
  },
};

const wrapperCol = { offset: 8, span: 16 };

function OfficeForm(props) {
  const { onCancel, onSubmit, loading, initialValues } = props;
  const [countryOptions, setCountryOptions] = useState([]);
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

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        const response = await countryApi.getAll();
        const options = response.data.map((country) => ({
          value: country.id,
          label: `${country.name} - ${country.isoCode}`,
        }));
        setCountryOptions(options);
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

  return (
    <Form
      name="normal_office"
      className="office-form"
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
      {initialValues.officeId ? (
        <Form.Item name="officeId" label="Office Id">
          <Input disabled={true} />
        </Form.Item>
      ) : null}
      <Form.Item
        name="title"
        label="Title"
        hasFeedback
        rules={[
          { required: true, message: 'Please input the title of the office!' },
        ]}
      >
        <Input
          placeholder="Enter office title"
          disabled={loading}
          showCount
          maxLength={40}
        />
      </Form.Item>
      <Form.Item
        name="streetAddress"
        label="Street Address"
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please input the street address of the office!',
          },
        ]}
      >
        <TextArea
          placeholder="Enter street address"
          disabled={loading}
          showCount
          maxLength={100}
          rows={2}
        />
      </Form.Item>
      <Form.Item
        name="stateProvince"
        label="State / Province"
        hasFeedback
      >
        <Input
          placeholder="Enter State / Province"
          disabled={loading}
          showCount
          maxLength={30}
        />
      </Form.Item>
      <Form.Item
        name="postalCode"
        label="Postal Code"
        hasFeedback
      >
        <InputNumber
          style={{
            width: '100%',
          }}
          placeholder="Enter Postal Code"
          min={1}
          maxLength={10}
          disabled={loading}
        />
      </Form.Item>
      <Form.Item
        name="city"
        label="City"
        hasFeedback
        rules={[
          { required: true, message: 'Please input the city of the office!' },
        ]}
      >
        <Input
          placeholder="Enter city"
          disabled={loading}
          showCount
          maxLength={30}
        />
      </Form.Item>
      <Form.Item
        name="countryId"
        label="Country"
        hasFeedback
        rules={[{ required: true, message: 'Please select country!' }]}
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
          options={countryOptions}
          disabled={loading}
        />
      </Form.Item>
      <Form.Item wrapperCol={wrapperCol}>
        <Space style={{ float: 'right' }}>
          <Button htmlType="button" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" disabled={!submittable}>
            {initialValues.officeId ? 'Save' : 'Add'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

export default OfficeForm;
