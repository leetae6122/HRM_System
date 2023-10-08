import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import _ from 'lodash';
import OfficeForm from './OfficeForm';
import officeApi from 'api/officeApi';

ModalEditOffice.propTypes = {
  openModal: PropTypes.bool,
  toggleShowModal: PropTypes.func,
  refreshOfficeList: PropTypes.func,
};

ModalEditOffice.defaultProps = {
  openModal: false,
  toggleShowModal: null,
  refreshOfficeList: null,
};

function ModalEditOffice(props) {
  const { editOfficeId } = useSelector((state) => state.office);
  const { openModal, toggleShowModal, refreshOfficeList } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [editOffice, setEditOffice] = useState({});

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        if (editOfficeId) {
          const data = (await officeApi.getById(editOfficeId)).data;
          setEditOffice({
            officeId: data.id,
            title: data.title,
            streetAddress: data.streetAddress,
            postalCode: data.postalCode,
            stateProvince: data.stateProvince,
            city: data.city,
            countryId: data.countryId,
          });
        }
      } catch (error) {
        toast.error(error);
      }
    };
    fetchData();
    return () => controller.abort();
  }, [editOfficeId]);

  const handleEditOffice = async (values) => {
    try {
      setConfirmLoading(true);
      const data = _.omitBy(values, _.isNil);
      const response = await officeApi.update(data);
      Swal.fire({
        icon: 'success',
        title: response.message,
        showConfirmButton: true,
        confirmButtonText: 'Done',
      }).then(async (result) => {
        await refreshOfficeList();
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
        title="Edit Office"
        open={openModal}
        onCancel={handleCancel}
        footer={null}
        style={{ top: 40 }}
      >
        {!_.isEmpty(editOffice) && (
          <OfficeForm
            onCancel={handleCancel}
            onSubmit={handleEditOffice}
            loading={confirmLoading}
            initialValues={editOffice}
          />
        )}
      </Modal>
    </>
  );
}
export default ModalEditOffice;
