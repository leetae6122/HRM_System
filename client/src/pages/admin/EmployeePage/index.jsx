import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setEditEmployeeId } from "reducers/employee";
import ModalEditEmployee from "./components/ComponentAddEdit/ModalEditEmployee";
import { Route, Routes } from "react-router-dom";
import EmployeeListPage from "./components/EmployeeListPage";
import EmployeeDetailPage from "./components/EmployeeDetailPage";

function EmployeePage() {
  const dispatch = useDispatch();
  const [openModalEditEmployee, setOpenModalEditEmployee] = useState(false);

  const toggleModalEditEmployee = (id) => {
    dispatch(setEditEmployeeId(id));
    setOpenModalEditEmployee(!openModalEditEmployee);
  };

  return (
    <>
      <Routes>
        <Route
          path=""
          element={
            <EmployeeListPage
              toggleModalEditEmployee={toggleModalEditEmployee}
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
        />
      )}
    </>
  );
}
export default EmployeePage;
