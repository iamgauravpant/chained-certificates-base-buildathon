import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Components/Layout/Index";
import HomeLayout from "./Components/HomeLayout/Index";
import Home from "./Pages/Home/Index";
import Login from "./Pages/Login/Index";
import Dashboard from "./Pages/Dashboard/Index";
import Certificates from "./Pages/Certificates/Index";
import Receivers from "./Pages/Receivers/Index";
import Settings from "./Pages/Settings/Index";
import CreateCertificate from "./Pages/CreateCertificate/Index";
import CertificateCollections from "./Pages/CertificateCollections/Index";
import CertificateIssuers from "./Pages/CertificateIssuers/Index";

import AdminLogin from "./Pages/AdminLogin/Index";
import AboutUs from "./Pages/AboutUs/Index";
import VerifyCertificate from "./Pages/VerifyCertificate/Index";
import ResetPassword from "./Pages/ResetPassword/Index";

import CreateCertificateChecker from "./utils/CreateCertificateChecker";
import PrivateRoutes from "./utils/PrivateRoutes";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route element={<HomeLayout />}>
            <Route path="" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/about-us" element={<AboutUs />}/>
            <Route path="/verify" element={<VerifyCertificate />}/>
            <Route path="/password-reset/:userId/:token" element={<ResetPassword />} />
          </Route>

          <Route path="/" element={<Layout />}>
            <Route element={<PrivateRoutes />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="certificate-collections" element={<CertificateCollections />} />
              <Route path="certificate-issuers" element={<CertificateIssuers />} />
              <Route path="certificates" element={<Certificates />} />
              <Route path="receivers" element={<Receivers />} />
              <Route path="settings" element={<Settings />} />
              <Route element={<CreateCertificateChecker />}>
              <Route path="create-certificate" element={<CreateCertificate />}/>
              </Route>
            </Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
