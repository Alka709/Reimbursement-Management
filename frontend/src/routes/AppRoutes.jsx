import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import LoginPage from '../pages/Login/LoginPage.jsx';
import DashboardPage from '../pages/Dashboard/DashboardPage.jsx';
import EmployeesPage from '../pages/Employees/EmployeesPage.jsx';
import ReimbursementsPage from '../pages/Reimbursements/ReimbursementsPage.jsx';
import CreateReimbursementPage from '../pages/CreateReimbursement/CreateReimbursementPage.jsx';
import AssignEmployeePage from '../pages/AssignEmployee/AssignEmployeePage.jsx';
import AssignRolePage from '../pages/AssignRole/AssignRolePage.jsx';
import NotFoundPage from '../pages/NotFound/NotFoundPage.jsx';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute.jsx';

function AppRoutes() {
  return (
    <Routes>
      {/* Root redirects to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />

      {/* Dashboard routes using DashboardLayout wrapped in ProtectedRoute */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/reimbursements" element={<ReimbursementsPage />} />
          <Route path="/create-reimbursement" element={<CreateReimbursementPage />} />
          <Route path="/assign-role" element={<AssignRolePage />} />
          <Route path="/assign-employee" element={<AssignEmployeePage />} />
        </Route>
      </Route>

      {/* 404 catch-all */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;

