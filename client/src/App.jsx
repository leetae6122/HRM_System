import React, { Suspense } from "react";
import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import NotFound from "pages/ErrorPage/NotFound";
import Loading from "components/Common/Loading";
import RequireAuth from "components/ProtectRoute/RequireAuth";
import DashboardPage from "pages/admin/DashboardPage";
import UserPage from "pages/admin/UserPage";
import CurrencyPage from "pages/admin/CurrencyPage";
import PositionPage from "pages/admin/PositionPage";
import ProfilePage from "pages/ProfilePage";
import EmployeePage from "pages/admin/EmployeePage";

const AuthPage = React.lazy(() => import("pages/AuthPage"));
const PageLayout = React.lazy(() => import("components/Common/PageLayout"));

function App() {
  return (
    <div className="App">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Suspense fallback={<Loading />}>
        <BrowserRouter>
          <Routes>
            <Route path="/auth/*" element={<AuthPage />} />
            <Route
              path="/profile"
              element={
                <RequireAuth>
                  <PageLayout />
                </RequireAuth>
              }
            >
              <Route path="" element={<ProfilePage />} />
            </Route>
            <Route
              path="/admin/*"
              element={
                <RequireAuth>
                  <PageLayout />
                </RequireAuth>
              }
            >
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="user" element={<UserPage />} />
              <Route path="employee">
                <Route path="" element={<EmployeePage />} />
                <Route path="position" element={<PositionPage />} />
              </Route>
              <Route path="payroll">
                <Route path="salary" element={<div>Salary</div>} />
                <Route path="currency" element={<CurrencyPage />} />
              </Route>
            </Route>
            {/* <Route path="/admin/*" element={<RequireAuth>
                  <PageLayout />
                </RequireAuth>}>
              <Route path="dashboard" element={<DashboardPage />} />
            </Route> */}
            <Route path="*" element={<NotFound />} />

            <>
              {/* Redirect */}
              <Route
                exact
                path={"/"}
                element={<Navigate to="/admin/dashboard" replace />}
              />
              <Route
                exact
                path={"/auth"}
                element={<Navigate to="/auth/login" replace />}
              />
              <Route
                exact
                path={"/login"}
                element={<Navigate to="/auth/login" replace />}
              />
              <Route
                exact
                path={"/admin"}
                element={<Navigate to="/admin/dashboard" replace />}
              />
              <Route
                exact
                path={"/admin/payroll"}
                element={<Navigate to="/admin/payroll/salary" replace />}
              />
            </>
          </Routes>
        </BrowserRouter>
      </Suspense>
    </div>
  );
}

export default App;
