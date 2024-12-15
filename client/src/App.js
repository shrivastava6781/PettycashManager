import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Correct named import
import Login from './authentication/Login';
import Dashboard from './pages/Dashboard';
import ResetPassword from './authentication/ResetPassword';
import ForgotPassword from './authentication/ForgotPassword';
import Employeelist from './pages/EmployeeMaster/Employeelist';
import CompanyList from './pages/Company Master/CompanyList';
import DepartmentList from './pages/Department_Position/DepartmentList';
import ProjectList from './pages/Project_Master/ProjectList';
import UserDashboard from './pages/UserDashboard';
import SidebarEmployee from './components/sidebar/SidebarEmployee';
import SearchBarEmployee from './components/sidebar/SearchBarEmployee';
import PageNotFound from './pages/PageNotFound';
import CashLedger from './pages/PettyCash/CashLedger';
import SupervisorList from './pages/ProjectSuperVisior/SupervisorList';
import PaymentModeList from './pages/PaymentModeMaster/PaymentModeList';
import HeadList from './pages/HeadMaster/HeadList';
import ViewLedger from './pages/UserDetails/EntryLedger/ViewLedger';
import ExpensesLedger from './pages/PettyCash/ExpensesLedger';
import ProjectLedger from './pages/PettyCash/ProjectLedger';
import UserProjectLedger from './pages/UserDetails/EntryLedger/UserProjectLedger';
import Signup from './authentication/Signup';
import ArchivedSupervisor from './pages/ProjectSuperVisior/ArchivedSupervisor';
import FundRequestList from './pages/FundRequest/FundRequestList';
import FundUserRequestList from './pages/UserDetails/FundRequest/FundUserRequestList';
import FundStatus from './pages/UserDetails/FundRequest/FundStatus';
import ApplicationSetting from './pages/SettingMaster/ApplicationSetting';
import ProjectReport from './pages/AllReportMaster/ProjectReport';
import SuperVisorReport from './pages/AllReportMaster/SuperVisorReport';
import CashLedgerReport from './pages/AllReportMaster/CashLedgerReport';
import ExpensesCashReport from './pages/AllReportMaster/ExpensesCashReport';
import PettyCashReport from './pages/AllReportMaster/PettyCashReport';
import ApprovRejectList from './pages/FundRequest/ApproveRejectList';
import TotalRecivedList from './pages/UserDetails/EntryLedger/TotalRecivedList';
import ProjectCreditDebitReport from './pages/AllReportMaster/ProjectCredtDebitReport';
import UserMonthlyReport from './pages/UserDetails/EntryLedger/UserMonthlyReport';
import EmployeeReport from './pages/AllReportMaster/EmployeeReport';
import HeadReport from './pages/AllReportMaster/HeadReport';
import UserHeadReport from './pages/UserDetails/EntryLedger/UserHeadReport';
import LabourList from './pages/LabourMaster/LabourList';
import AddLabourAttendences from './pages/UserDetails/LabourDetails/AddLabourAttendences';
import LabourAttendences from './pages/LabourMaster/LabourAttendance';
import ViewAttendance from './pages/LabourMaster/ViewAttendance';
import LabourPaymentList from './pages/LabourMaster/LabourPaymentList';
import ViewLabourList from './pages/UserDetails/LabourDetails/ViewLabourList';
import ViewLabourAttendance from './pages/UserDetails/LabourDetails/ViewLabourAttendance';
import PayLabourPayment from './pages/LabourMaster/PayLabourPayment';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [userType, setUserType] = useState(''); // Add userType state
  const [employeeId, setEmployeeId] = useState(''); // Add employeeId state
  const [projectId, setProjectId] = useState(''); // Add projectId state
  const [loading, setLoading] = useState(true);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);

        // Expiry time is in seconds, convert to milliseconds by multiplying by 1000
        if (decodedToken.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          localStorage.removeItem('userType');
          localStorage.removeItem('employeeId');
          localStorage.removeItem('projectId');
          localStorage.removeItem('fetchemail');
          return false;
        }
        return true;
      } catch (error) {
        return false;
      }
    }
    return false;
  };

  useEffect(() => {
    const isAuthenticated = checkAuth();
    if (isAuthenticated) {
      setUsername(localStorage.getItem('username'));
      setUserType(localStorage.getItem('userType'));
      setEmployeeId(localStorage.getItem('employeeId'));
      setProjectId(localStorage.getItem('projectId'));
    }
    setIsAuthenticated(isAuthenticated);
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userType');
    localStorage.removeItem('employeeId');
    localStorage.removeItem('projectId');
    localStorage.removeItem('fetchemail');

    setIsAuthenticated(false);
    setUsername('');
    setUserType(''); // Clear userType on logout
    setEmployeeId(''); // Clear employeeId on logout
    setProjectId(''); // Clear projectId on logout

    // Reload the page to ensure a fresh state
    window.location.reload();
    // Redirect to the login or home page
    window.location.href = "/";

  };

  const handleLogin = ({ token, username, userType, employeeId, projectId }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    localStorage.setItem('userType', userType);
    localStorage.setItem('employeeId', employeeId);
    localStorage.setItem('projectId', projectId);
    setIsAuthenticated(true);
    setUsername(username);
    setUserType(userType);
    setEmployeeId(employeeId);
    setProjectId(projectId);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? (<Navigate to={userType === 'user' ? "/userdashboard" : "/dashboard"} replace />) : (<Login handleLogin={handleLogin} />)} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        {/* Routes accessible by 'user' */}
        {userType === 'user' && (
          <>
            <Route path="/userdashboard" element={isAuthenticated ? <UserDashboard username={username} userType={userType} employeeId={employeeId} projectId={projectId} handleLogout={handleLogout} /> : <Navigate to="/" replace />} />
            <Route path="/sidebaremployee" element={isAuthenticated ? <SidebarEmployee username={username} userType={userType} employeeId={employeeId} projectId={projectId} handleLogout={handleLogout} /> : <Navigate to="/" replace />} />
            <Route path="/searchbaremployee" element={isAuthenticated ? <SearchBarEmployee username={username} userType={userType} employeeId={employeeId} projectId={projectId} handleLogout={handleLogout} /> : <Navigate to="/" replace />} />
            <Route path="/viewledger" element={isAuthenticated ? <ViewLedger username={username} userType={userType} employeeId={employeeId} projectId={projectId} handleLogout={handleLogout} /> : <Navigate to="/" replace />} />
            <Route path="/userprojectledger" element={isAuthenticated ? <UserProjectLedger username={username} userType={userType} employeeId={employeeId} projectId={projectId} handleLogout={handleLogout} /> : <Navigate to="/" replace />} />
            <Route path="/faunduserrequestlist" element={isAuthenticated ? <FundUserRequestList username={username} userType={userType} employeeId={employeeId} projectId={projectId} handleLogout={handleLogout} /> : <Navigate to="/" replace />} />
            <Route path="/fundstatus" element={isAuthenticated ? <FundStatus username={username} userType={userType} employeeId={employeeId} projectId={projectId} handleLogout={handleLogout} /> : <Navigate to="/" replace />} />
            <Route path="/totalrecived" element={isAuthenticated ? <TotalRecivedList username={username} userType={userType} employeeId={employeeId} projectId={projectId} handleLogout={handleLogout} /> : <Navigate to="/" replace />} />
            <Route path="/projectmonthlyreport" element={isAuthenticated ? <UserMonthlyReport username={username} userType={userType} employeeId={employeeId} projectId={projectId} handleLogout={handleLogout} /> : <Navigate to="/" replace />} />
            <Route path="/userheadreport" element={isAuthenticated ? <UserHeadReport username={username} userType={userType} employeeId={employeeId} projectId={projectId} handleLogout={handleLogout} /> : <Navigate to="/" replace />} />
            <Route path="/addlabourattendance" element={isAuthenticated ? <AddLabourAttendences username={username} userType={userType} employeeId={employeeId} projectId={projectId} handleLogout={handleLogout} /> : <Navigate to="/" replace />} />
            <Route path="/viewlabourlist" element={isAuthenticated ? <ViewLabourList username={username} userType={userType} employeeId={employeeId} projectId={projectId} handleLogout={handleLogout} /> : <Navigate to="/" replace />} />
            <Route path="/viewlabourattendance" element={isAuthenticated ? <ViewLabourAttendance username={username} userType={userType} employeeId={employeeId} projectId={projectId} handleLogout={handleLogout} /> : <Navigate to="/" replace />} />
          </>
        )}
        {/* Routes accessible by 'manager' or 'admin' */}
        {(userType === 'manager' || userType === 'admin') && (
          <>
            {/* Petty Cash  */}
            <Route path="/dashboard" element={isAuthenticated ? (<Dashboard username={username} employeeId={employeeId} userType={userType} handleLogout={handleLogout} />) : (<Navigate to="/" replace />)} />
            <Route path="/employeelist" element={isAuthenticated ? <Employeelist username={username} userType={userType} employeeId={employeeId} handleLogout={handleLogout} /> : <Navigate to="/" replace />} />
            <Route path="/companylist" element={isAuthenticated ? <CompanyList username={username} userType={userType} employeeId={employeeId} handleLogout={handleLogout} /> : <Navigate to="/" replace />} />
            <Route path="/cashledger" element={isAuthenticated ? <CashLedger username={username} userType={userType} employeeId={employeeId} handleLogout={handleLogout} /> : <Navigate to="/" replace />} />
            <Route path="/supervisorlist" element={isAuthenticated ? <SupervisorList username={username} userType={userType} employeeId={employeeId} handleLogout={handleLogout} /> : <Navigate to="/" replace />} />
            <Route path="/departmentlist" element={isAuthenticated ? <DepartmentList username={username} userType={userType} employeeId={employeeId} handleLogout={handleLogout} /> : <Navigate to="/" replace />} />
            <Route path="/projectlist" element={isAuthenticated ? <ProjectList username={username} userType={userType} employeeId={employeeId} handleLogout={handleLogout} /> : <Navigate to="/" replace />} />
            <Route path="/paymentmodelist" element={isAuthenticated ? <PaymentModeList username={username} userType={userType} employeeId={employeeId} handleLogout={handleLogout} /> : <Navigate to="/" replace />} />
            <Route path="/headlist" element={isAuthenticated ? <HeadList username={username} userType={userType} employeeId={employeeId} handleLogout={handleLogout} /> : <Navigate to="/" replace />} />
            <Route path="/expensesledger" element={isAuthenticated ? <ExpensesLedger username={username} userType={userType} employeeId={employeeId} handleLogout={handleLogout} /> : <Navigate to="/" replace />} />
            <Route path="/projectledger" element={isAuthenticated ? <ProjectLedger username={username} userType={userType} employeeId={employeeId} handleLogout={handleLogout} /> : <Navigate to="/" replace />} />
            <Route path="/archivedsupervisor" element={isAuthenticated ? <ArchivedSupervisor username={username} userType={userType} employeeId={employeeId} handleLogout={handleLogout} /> : <Navigate to="/" replace />} />
            <Route path="/fundrequest" element={isAuthenticated ? <FundRequestList username={username} userType={userType} employeeId={employeeId} handleLogout={handleLogout} /> : <Navigate to="/" replace />} />
            <Route path="/applicationsetting" element={isAuthenticated ? <ApplicationSetting username={username} userType={userType} employeeId={employeeId} handleLogout={handleLogout} /> : <Navigate to="/" replace />} />
            <Route path="/labourlist" element={isAuthenticated ? <LabourList username={username} userType={userType} employeeId={employeeId} handleLogout={handleLogout} /> : <Navigate to="/" replace />} />
            <Route path="/labourattendance" element={isAuthenticated ? <LabourAttendences username={username} userType={userType} employeeId={employeeId} handleLogout={handleLogout} /> : <Navigate to="/" replace />} />
            <Route path="/viewattendance" element={isAuthenticated ? <ViewAttendance username={username} userType={userType} employeeId={employeeId} handleLogout={handleLogout} /> : <Navigate to="/" replace />} />
            <Route path="/labourpaymentlist" element={isAuthenticated ? <LabourPaymentList username={username} userType={userType} employeeId={employeeId} handleLogout={handleLogout} /> : <Navigate to="/" replace />} />
            <Route path="/paylabourAmount" element={isAuthenticated ? <PayLabourPayment username={username} userType={userType} employeeId={employeeId} handleLogout={handleLogout} /> : <Navigate to="/" replace />} />
            {/* REPORTS */}
            <Route path="/projectreport" element={isAuthenticated ? <ProjectReport username={username} userType={userType} employeeId={employeeId} handleLogout={handleLogout} /> : <Navigate to="/" replace />} />
            <Route path="/headreport" element={isAuthenticated ? <HeadReport username={username} userType={userType} employeeId={employeeId} handleLogout={handleLogout} /> : <Navigate to="/" replace />} />
            <Route path="/employeereport" element={isAuthenticated ? <EmployeeReport username={username} userType={userType} employeeId={employeeId} handleLogout={handleLogout} /> : <Navigate to="/" replace />} />
            <Route path="/supervisorreport" element={isAuthenticated ? <SuperVisorReport username={username} userType={userType} employeeId={employeeId} handleLogout={handleLogout} /> : <Navigate to="/" replace />} />
            <Route path="/cashledgerreport" element={isAuthenticated ? <CashLedgerReport username={username} userType={userType} employeeId={employeeId} handleLogout={handleLogout} /> : <Navigate to="/" replace />} />
            <Route path="/expensesCashreport" element={isAuthenticated ? <ExpensesCashReport username={username} userType={userType} employeeId={employeeId} handleLogout={handleLogout} /> : <Navigate to="/" replace />} />
            <Route path="/pettycashreport" element={isAuthenticated ? <PettyCashReport username={username} userType={userType} employeeId={employeeId} handleLogout={handleLogout} /> : <Navigate to="/" replace />} />
            <Route path="/projectcreditdebitreport" element={isAuthenticated ? <ProjectCreditDebitReport username={username} userType={userType} employeeId={employeeId} handleLogout={handleLogout} /> : <Navigate to="/" replace />} />
            <Route path="/approvreject" element={isAuthenticated ? <ApprovRejectList username={username} userType={userType} employeeId={employeeId} handleLogout={handleLogout} /> : <Navigate to="/" replace />} />
          </>
        )}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
