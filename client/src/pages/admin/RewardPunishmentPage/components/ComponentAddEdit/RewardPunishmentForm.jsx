import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Input,
  Button,
  Space,
  InputNumber,
  Select,
  DatePicker,
  Radio,
} from 'antd';
import { toast } from 'react-toastify';
import _ from 'lodash';
import employeeApi from 'api/employeeApi';

RewardPunishmentForm.propTypes = {
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  initialValues: PropTypes.object,
};

RewardPunishmentForm.defaultProps = {
  onCancel: null,
  onSubmit: null,
  loading: false,
  initialValues: {
    type: '',
    amount: 0,
    reason: '',
    date: '',
    employeeId: null,
    employees: [],
  },
};

const dateFormat = 'DD/MM/YYYY';

const wrapperCol = { offset: 8, span: 16 };

function RewardPunishmentForm(props) {
  const { onCancel, onSubmit, loading, initialValues } = props;
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [submittable, setSubmittable] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState();
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);

  useEffect(() => {
    const defaultValues = {
      rewardPunishmentId: initialValues.rewardPunishmentId,
      type: initialValues.type,
      amount: initialValues.amount,
      reason: initialValues.reason,
      date: initialValues.date,
    };
    form.validateFields({ validateOnly: true }).then(
      () => {
        if (!_.isEqual(defaultValues, values)) {
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
    const fetchDataEmployeeOptions = async () => {
      try {
        const data = (await employeeApi.getAll()).data;
        const options = data.map((employee) => ({
          value: employee.id,
          label: `${employee.lastName} ${employee.firstName}`,
          desc: `#${employee.id} - ${employee.lastName} ${employee.firstName}`,
        }));
        setEmployeeOptions(options);
      } catch (error) {
        toast.error(error);
      }
    };
    fetchDataEmployeeOptions();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      if (initialValues.rewardPunishmentId) {
        const data = (await employeeApi.getById(initialValues.employeeId)).data;
        setSelectedEmployee(data);
      }
    };
    fetchData();
    return () => controller.abort();
  }, [initialValues.rewardPunishmentId, initialValues.employeeId]);

  const onFinish = (values) => {
    onSubmit(values);
  };

  const handleCancel = () => {
    onCancel();
  };

  const disabledDate = (current) => {
    return current && current.valueOf() >= Date.now();
  };

  return (
    <Form
      name="normal_reward_punishment"
      className="reward-punishment-form"
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
      {initialValues.rewardPunishmentId ? (
        <Form.Item
          name="rewardPunishmentId"
          label={
            initialValues.type === 'Reward' ? 'Reward Id' : 'Punishment Id'
          }
        >
          <Input
            disabled={true}
            style={{
              color: 'black',
            }}
          />
        </Form.Item>
      ) : null}
      {initialValues.rewardPunishmentId ? (
        <Form.Item label="Employee">
          <Input
            disabled={true}
            value={
              selectedEmployee
                ? `#${selectedEmployee.id} - ${selectedEmployee.lastName} ${selectedEmployee.firstName}`
                : ''
            }
            style={{
              color: 'black',
            }}
          />
        </Form.Item>
      ) : (
        <Form.Item
          name="employees"
          label="Employees"
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please select an employee!',
              type: 'array',
            },
          ]}
        >
          <Select
            mode="multiple"
            allowClear
            style={{
              width: '100%',
            }}
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.desc ?? '').includes(input)
            }
            filterSort={(optionA, optionB) =>
              (optionA?.desc ?? '')
                .toLowerCase()
                .localeCompare((optionB?.desc ?? '').toLowerCase())
            }
            placeholder="Please select"
            options={employeeOptions}
            disabled={loading}
            optionRender={(option) => option.data.desc}
          />
        </Form.Item>
      )}
      {!initialValues.rewardPunishmentId ? (
        <Form.Item
          name="type"
          label="Type"
          hasFeedback
          rules={[{ required: true, message: 'Please select type!' }]}
        >
          <Radio.Group disabled={loading} buttonStyle="solid">
            <Radio.Button value={'Reward'}>Reward</Radio.Button>
            <Radio.Button value={'Punishment'}>Punishment</Radio.Button>
          </Radio.Group>
        </Form.Item>
      ) : (
        <Form.Item name="type" label="Type">
          <Input
            disabled={true}
            style={{
              color: initialValues.type === 'Reward' ? 'green' : 'red',
            }}
          />
        </Form.Item>
      )}
      <Form.Item
        name="reason"
        label="Reason"
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please enter a reason!',
          },
        ]}
      >
        <Input.TextArea
          rows={2}
          placeholder="Enter reason"
          disabled={loading}
          showCount
          maxLength={200}
        />
      </Form.Item>
      <Form.Item
        name="amount"
        label="Amount"
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please enter the amount!',
          },
        ]}
      >
        <InputNumber
          style={{
            width: '100%',
          }}
          min={0}
          controls={false}
          disabled={loading}
          formatter={(value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          addonAfter={'VNĐ'}
        />
      </Form.Item>
      <Form.Item
        name="date"
        label="Effective Date"
        hasFeedback
        rules={[
          { required: true, message: 'Please select an effective date!' },
        ]}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
      >
        <DatePicker
          disabled={loading}
          style={{ width: '100%' }}
          format={dateFormat}
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
            {initialValues.rewardPunishmentId ? 'Save' : 'Add'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

export default RewardPunishmentForm;
