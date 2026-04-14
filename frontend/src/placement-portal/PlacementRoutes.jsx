import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PlacementProvider } from './PlacementContext';
import PlacementLanding from './pages/PlacementLanding';
import AlumniStart from './pages/AlumniStart';
import AlumniLinkedIn from './pages/AlumniLinkedIn';
import AlumniOnboarding from './pages/AlumniOnboarding';
import AlumniProfilePage from './pages/AlumniProfilePage';
import StudentLogin from './pages/StudentLogin';
import StudentDiscover from './pages/StudentDiscover';
import SeniorProfileView from './pages/SeniorProfileView';
import StudentAIChat from './pages/StudentAIChat';

export default function PlacementRoutes() {
  return (
    <PlacementProvider>
      <Routes>
        <Route index element={<PlacementLanding />} />
        <Route path="alumni" element={<AlumniStart />} />
        <Route path="alumni/linkedin" element={<AlumniLinkedIn />} />
        <Route path="alumni/onboarding" element={<AlumniOnboarding />} />
        <Route path="alumni/profile" element={<AlumniProfilePage />} />
        <Route path="student" element={<StudentLogin />} />
        <Route path="student/discover" element={<StudentDiscover />} />
        <Route path="student/profile/:id" element={<SeniorProfileView />} />
        <Route path="student/chat" element={<StudentAIChat />} />
        <Route path="*" element={<Navigate to="/placement" replace />} />
      </Routes>
    </PlacementProvider>
  );
}
