import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import _ from 'lodash';
import CountryForm from './CountryForm';
import countryApi from 'api/countryApi';

ModalEditCountry.propTypes = {
  openModal: PropTypes.bool,
  toggleShowModal: PropTypes.func,
  refreshCountryList: PropTypes.func,
};

ModalEditCountry.defaultProps = {
  openModal: false,
  toggleShowModal: null,
  refreshCountryList: null,
};

function ModalEditCountry(props) {
  const { editCountryId } = useSelector((state) => state.country);
  const { openModal, toggleShowModal, refreshCountryList } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [editCountry, setEditCountry] = useState({});

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        if (editCountryId) {
          const data = (await countryApi.getById(editCountryId)).data;
          setEditCountry({
            countryId: data.id,
            name: data.name,
            countryCode: data.countryCode,
            isoCode: data.isoCode,
          });
        }
      } catch (error) {
        toast.error(error);
      }
    };
    fetchData();
    return () => controller.abort();
  }, [editCountryId]);

  const handleEditCountry = async (values) => {
    try {
      setConfirmLoading(true);
      const data = _.omitBy(values, _.isNil);
      const response = await countryApi.update(data);
      Swal.fire({
        icon: 'success',
        title: response.message,
        showConfirmButton: true,
        confirmButtonText: 'Done',
      }).then(async (result) => {
        await refreshCountryList();
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
        title="Edit Country"
        open={openModal}
        onCancel={handleCancel}
        footer={null}
        width={'100vh'}
      >
        {!_.isEmpty(editCountry) && (
          <CountryForm
            onCancel={handleCancel}
            onSubmit={handleEditCountry}
            loading={confirmLoading}
            initialValues={editCountry}
          />
        )}
      </Modal>
    </>
  );
}
export default ModalEditCountry;
