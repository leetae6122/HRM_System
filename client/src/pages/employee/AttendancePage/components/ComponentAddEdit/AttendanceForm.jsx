import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Input,
  Button,
  Space,
  DatePicker,
  Select,
  InputNumber,
  Radio,
  Row,
  Col,
} from 'antd';
import _ from 'lodash';
import { toast } from 'react-toastify';
import taskApi from 'api/taskApi';
import projectApi from 'api/projectApi';
import dayjs from 'dayjs';

AttendanceForm.propTypes = {
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  initialValues: PropTypes.object,
};

AttendanceForm.defaultProps = {
  onCancel: null,
  onSubmit: null,
  loading: false,
  initialValues: {
    description: '',
    attendanceDate: '',
    hourSpent: 0,
    hourOT: 0,
    status: '',
    place: '',
    taskId: null,
    projectId: null,
  },
};

const dateFormat = 'DD/MM/YYYY';

const wrapperCol = { offset: 8, span: 16 };

function AttendanceForm(props) {
  const { onCancel, onSubmit, loading, initialValues } = props;
  const [submittable, setSubmittable] = useState(false);
  const [taskOptions, setTaskOptions] = useState([]);
  const [projectOptions, setProjectOptions] = useState([]);
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
    const fetchProjectOptions = async () => {
      try {
        const response = await projectApi.getAll();
        const options = response.data.map((project) => ({
          value: project.id,
          label: project.title,
        }));
        setProjectOptions(options);
      } catch (error) {
        toast.error(error);
      }
    };
    const fetchTaskOptions = async () => {
      try {
        const response = await taskApi.getAll();
        const options = response.data.map((task) => ({
          value: task.id,
          label: task.title,
        }));
        setTaskOptions(options);
      } catch (error) {
        toast.error(error);
      }
    };
    fetchProjectOptions();
    fetchTaskOptions();
    return () => controller.abort();
  }, []);

  const disabledDate = (date) => {
    const day = dayjs(date).day();
    if (day !== 0 && day !== 6) {
      return false;
    }
    return true;
  };

  const onFinish = (values) => {
    onSubmit(values);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Form
      name="normal_attendance"
      className="attendance-form"
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
      <Row>
        {initialValues.attendanceId ? (
          <Col span={24}>
            <Form.Item name="attendanceId" label="Attendance Id">
              <Input disabled={true} />
            </Form.Item>
          </Col>
        ) : null}
        <Col span={24}>
          <Form.Item
            name="projectId"
            label="Project"
            hasFeedback
            rules={[{ required: true, message: 'Please select project!' }]}
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
              options={projectOptions}
              disabled={loading}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="taskId"
            label="Task"
            hasFeedback
            rules={[{ required: true, message: 'Please select task!' }]}
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
              options={taskOptions}
              disabled={loading}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please input description!' }]}
          >
            <Input.TextArea
              placeholder="Enter description"
              disabled={loading}
              maxLength={255}
              style={{ height: 170, resize: 'none' }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="attendanceDate"
            label="Attendance Date"
            rules={[
              { required: true, message: 'Please select attendance date!' },
            ]}
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 14 }}
          >
            <DatePicker
              disabled={loading}
              placeholder="Enter attendance date"
              format={dateFormat}
              style={{
                width: '100%',
              }}
              disabledDate={disabledDate}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="place"
            label="Place"
            hasFeedback
            rules={[{ required: true, message: 'Please select place!' }]}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          >
            <Radio.Group>
              <Radio value="Office"> Office </Radio>
              <Radio value="At Home"> At Home </Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="hourSpent"
            label="Hour Spent"
            hasFeedback
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            rules={[
              { required: true, message: 'Please input hour spent!' },
              () => ({
                validator(_, value) {
                  if (!value || value <= 8) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('Hour Spent must be less than or equal to 8!'),
                  );
                },
              }),
            ]}
          >
            <InputNumber
              style={{
                width: '100%',
              }}
              controls={false}
              min={0}
              max={8}
              disabled={loading}
              addonAfter={'hour'}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="hourOT"
            label="Hour OT"
            hasFeedback
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            rules={[
              () => ({
                validator(_, value) {
                  if (!value || value <= 2) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('Hour OT must be less than or equal to 2!'),
                  );
                },
              }),
            ]}
          >
            <InputNumber
              style={{
                width: '100%',
              }}
              controls={false}
              min={0}
              max={2}
              disabled={loading}
              addonAfter={'hour'}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item wrapperCol={wrapperCol}>
            <Space style={{ float: 'right' }}>
              <Button
                htmlType="button"
                onClick={handleCancel}
                loading={loading}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={!submittable}
              >
                {initialValues.attendanceId ? 'Save' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

export default AttendanceForm;
