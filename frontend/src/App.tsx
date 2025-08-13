import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/common/Layout';
import SplashScreen from './components/common/SplashScreen';
import DashboardPage from './pages/DashboardPage';
import StudentsPage from './pages/StudentsPage';
import LessonsPage from './pages/LessonsPage';
import PaymentsPage from './pages/PaymentsPage';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

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
