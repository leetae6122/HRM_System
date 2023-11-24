import { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import ExportFileForm from './ExportFileForm';
import fileApi from 'api/fileApi';
import { saveAs } from 'file-saver';
import dayjs from 'dayjs';

ModalExportFile.propTypes = {
  openModal: PropTypes.bool,
  toggleShowModal: PropTypes.func,
};

ModalExportFile.defaultProps = {
  openModal: false,
  toggleShowModal: null,
};

function ModalExportFile(props) {
  const { openModal, toggleShowModal } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleExportFile = async (values) => {
    try {
      setConfirmLoading(true);
      let response;
      let fileName = 'example.xlsx';
      if (values.changeExport) {
        response = await fileApi.exportExcelDate({
          date: values.attendanceDate,
        });
        fileName = `AttendanceStatisticsDate_${dayjs(
          values.attendanceDate,
        ).format('DD-MM-YYYY')}.xlsx`;
      } else {
        response = await fileApi.exportExcelEmployee({
          employeeId: values.employeeId,
          month: values.month,
        });
        fileName = `AttendanceStatistics_EmployeeId-${values.employeeId}.xlsx`;
      }

      const blob = new Blob([response], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, fileName);

      Swal.fire({
        icon: 'success',
        title: 'Export file successfully',
        showConfirmButton: true,
        confirmButtonText: 'Done',
      }).then(async (result) => {
        setConfirmLoading(false);
        if (result.isConfirmed) {
          toggleShowModal();
        }
      });
    } catch (error) {
      toast.error(error);
      setConfirmLoading(false);
    }
  };

  const handleCancel = () => {
    toggleShowModal();
  };

  return (
    <>
      <Modal
        title='Export Excel File'
        open={openModal}
        onCancel={handleCancel}
        footer={null}
        width={'100vh'}
        style={{
          top: 40,
        }}
      >
        <ExportFileForm
          onCancel={handleCancel}
          onSubmit={handleExportFile}
          loading={confirmLoading}
        />
      </Modal>
    </>
  );
}
export default ModalExportFile;
