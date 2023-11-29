import PropTypes from 'prop-types';
import { Form, Button, Space, Select, Radio, DatePicker } from 'antd';
import { useEffect, useState } from 'react';
import employeeApi from 'api/employeeApi';
import { toast } from 'react-toastify';
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
  changeExport: true,
  attendanceDate: '',
  month: '',
  employeeId: null,
};

const wrapperCol = { offset: 8, span: 16 };

function ExportFileForm(props) {
  const { onCancel, onSubmit, loading } = props;
  const [employeeOptions, setEmployeeOptions] = useState([]);
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

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        const data = (await employeeApi.getAll()).data;
        const options = data.map((employee) => ({
          value: employee.id,
          label: `#${employee.id} - ${employee.lastName} ${employee.firstName}`,
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

  const disabledDate = (current) => {
    return current && current.valueOf() > Date.now();
  };

  return (
    <Form
      name="normal_attendance_export_file"
      className="attendance-export-file-form"
      initialValues={initialValues}
      onFinish={onFinish}
      form={form}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      style={{
        marginTop: 20,
        maxWidth: 600,
      }}
      size="large"
    >
      <Form.Item name="changeExport" label="Export">
        <Radio.Group disabled={loading} buttonStyle="solid">
          <Radio.Button value={true}>Attendance Date</Radio.Button>
          <Radio.Button value={false}>Employee Name</Radio.Button>
        </Radio.Group>
      </Form.Item>
      {values && values.changeExport ? (
        <Form.Item
          name="attendanceDate"
          label="Attendance Date"
          rules={[
            { required: true, message: 'Please select attendance date!' },
          ]}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
        >
          <DatePicker
            allowClear={false}
            format={'DD/MM/YYYY'}
            disabled={loading}
            style={{
              width: '100%',
            }}
            disabledDate={disabledDate}
          />
        </Form.Item>
      ) : (
        <>
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
          <Form.Item
            name="employeeId"
            label="Employee"
            hasFeedback
            rules={[{ required: true, message: 'Please select an employee!' }]}
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
              options={employeeOptions}
              disabled={loading}
            />
          </Form.Item>
        </>
      )}
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
