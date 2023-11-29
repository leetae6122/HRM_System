import React, { Suspense } from 'react';
import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';

import NotFound from 'pages/ErrorPage/NotFound';
import Loading from 'components/Common/Loading';
import RequireAuth from 'components/ProtectRoute/RequireAuth';
import DepartmentManagerAuth from 'components/ProtectRoute/DepartmentManagerAuth';
import AdminAuth from 'components/ProtectRoute/AdminAuth';

// Employee Page
import EmployeeDashboardPage from 'pages/employee/DashboardPage';
import EmployeeLeavePage from 'pages/employee/LeavePage';
import EmployeeAttendancePage from 'pages/employee/AttendancePage';
import EmployeeTimekeeperPage from 'pages/employee/TimekeeperPage';
import EmployeeAllowancePage from 'pages/employee/AllowancePage';
import EmployeeRewardPunishmentPage from 'pages/employee/RewardPunishmentPage';

// Admin Page
import AdminDashboardPage from 'pages/admin/DashboardPage';
import UserPage from 'pages/admin/UserPage';
import PositionPage from 'pages/admin/PositionPage';
import AdminEmployeePage from 'pages/admin/EmployeePage';
import WagePage from 'pages/admin/WagePage';
import DepartmentPage from 'pages/admin/DepartmentPage';
import AdminLeavePage from 'pages/admin/LeavePage';
import AdminAttendancePage from 'pages/admin/AttendancePage';
import ShiftPage from 'pages/admin/ShiftPage';
import AdminAllowancePage from 'pages/admin/AllowancePage';
import AdminRewardPunishmentPage from 'pages/admin/RewardPunishmentPage';

// Other
import ManageAttendancePage from 'pages/employee/ManageAttendancePage';
import TimekeeperPage from 'pages/TimekeeperPage';

const AuthPage = React.lazy(() => import('pages/AuthPage'));
const PageLayout = React.lazy(() => import('components/Common/PageLayout'));
const ProfilePage = React.lazy(() => import('pages/ProfilePage'));

function App() {
  const { user } = useSelector((state) => state.auth);
  return (
    <div className="App">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        limit={3}
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
                  <AdminAuth>
                    <PageLayout />
                  </AdminAuth>
                </RequireAuth>
              }
            >
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="user" element={<UserPage />} />
              <Route exact path="employee/*" element={<AdminEmployeePage />} />
              <Route path="position" element={<PositionPage />} />
              <Route path="wage" element={<WagePage />} />
              <Route path="department" element={<DepartmentPage />} />
              <Route path="leave" element={<AdminLeavePage />} />
              <Route path="attendance" element={<AdminAttendancePage />} />
              <Route path="shift" element={<ShiftPage />} />
              <Route path="allowance" element={<AdminAllowancePage />} />
              <Route
                path="reward-punishment"
                element={<AdminRewardPunishmentPage />}
              />
            </Route>

            <Route
              path="/employee/*"
              element={
                <RequireAuth>
                  <PageLayout />
                </RequireAuth>
              }
            >
              <Route path="dashboard" element={<EmployeeDashboardPage />} />
              <Route path="attendance" element={<EmployeeAttendancePage />} />
              <Route path="leave" element={<EmployeeLeavePage />} />
              <Route path="timekeeper" element={<EmployeeTimekeeperPage />} />
              <Route path="allowance" element={<EmployeeAllowancePage />} />
              <Route
                path="reward-punishment"
                element={<EmployeeRewardPunishmentPage />}
              />
              <Route
                path="manage-attendance"
                element={
                  <DepartmentManagerAuth>
                    <ManageAttendancePage />
                  </DepartmentManagerAuth>
                }
              />
            </Route>
            <Route path="/timekeeper" element={<TimekeeperPage />} />
            <Route path="*" element={<NotFound />} />

            <>
              {/* Redirect */}
              <Route
                exact
                path={'/'}
                element={
                  <RequireAuth>
                    {user?.isAdmin === 1 ? (
                      <Navigate to="/admin/dashboard" replace />
                    ) : (
                      <Navigate to="/employee/dashboard" replace />
                    )}
                  </RequireAuth>
                }
              />
              <Route
                exact
                path={'/auth'}
                element={<Navigate to="/auth/login" replace />}
              />
              <Route
                exact
                path={'/login'}
                element={<Navigate to="/auth/login" replace />}
              />
              <Route
                exact
                path={'/admin'}
                element={<Navigate to="/admin/dashboard" replace />}
              />
              <Route
                exact
                path={'/employee'}
                element={<Navigate to="/employee/dashboard" replace />}
              />
            </>
          </Routes>
        </BrowserRouter>
      </Suspense>
    </div>
  );
}

export default App;
