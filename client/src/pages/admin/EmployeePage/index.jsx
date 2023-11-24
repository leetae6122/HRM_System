import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { setEditEmployeeId } from 'reducers/employee';
import ModalEditEmployee from './components/ComponentAddEdit/ModalEditEmployee';
import EmployeeListPage from './components/EmployeeListPage';
import EmployeeDetailPage from './components/EmployeeDetailPage';
import employeeApi from 'api/employeeApi';
import { setData } from 'reducers/employee';
import { setFilterData } from 'reducers/employee';

function EmployeePage() {
  const dispatch = useDispatch();
  const [openModalEditEmployee, setOpenModalEditEmployee] = useState(false);
  const { defaultFilter } = useSelector((state) => state.employee);

  const toggleModalEditEmployee = (id) => {
    dispatch(setEditEmployeeId(id));
    setOpenModalEditEmployee(!openModalEditEmployee);
  };

  const refreshEmployeeList = async () => {
    const response = (await employeeApi.getList(defaultFilter)).data;
    const data = response.data.map((item) => ({ key: item.id, ...item }));
    dispatch(
      setData({
        employeeList: data,
        total: response.total,
        currentPage: response.currentPage,
      }),
    );
    dispatch(setFilterData(defaultFilter));
  };

  return (
    <>
      <Routes>
        <Route
          path=""
          element={
            <EmployeeListPage
              toggleModalEditEmployee={toggleModalEditEmployee}
              refreshEmployeeList={refreshEmployeeList}
            />
          }
        />
        <Route
          path=":id"
          element={
            <EmployeeDetailPage
              toggleModalEditEmployee={toggleModalEditEmployee}
            />
          }
        />
      </Routes>
      {openModalEditEmployee && (
        <ModalEditEmployee
          openModal={openModalEditEmployee}
          toggleShowModal={toggleModalEditEmployee}
          refreshEmployeeList={refreshEmployeeList}
        />
      )}
    </>
  );
}
export default EmployeePage;
