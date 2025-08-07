import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/common/Layout';
import DashboardPage from './pages/DashboardPage';
import StudentsPage from './pages/StudentsPage';
import LessonsPage from './pages/LessonsPage';
import PaymentsPage from './pages/PaymentsPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/lessons" element={<LessonsPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
