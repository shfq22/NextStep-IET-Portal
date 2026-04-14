import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { MOCK_SENIORS } from './mockSeniors';

const PlacementContext = createContext(null);

const makeId = (prefix) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

export function PlacementProvider({ children }) {
  const [seniors, setSeniors] = useState(MOCK_SENIORS);
  const [alumniUser, setAlumniUser] = useState(null);
  const [studentUser, setStudentUser] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [studentNotifications, setStudentNotifications] = useState([]);

  const registerAlumniFromLinkedIn = useCallback((profile) => {
    const id = `alumni-${Date.now()}`;
    setAlumniUser({
      id,
      ...profile,
      profileComplete: false,
    });
  }, []);

  const saveAlumniPlacementProfile = useCallback((payload) => {
    setAlumniUser((prev) => (prev ? { ...prev, ...payload, profileComplete: true } : null));
    setSeniors((prev) => {
      const seniorId = payload.id;
      const senior = {
        id: seniorId,
        linkedInImported: true,
        photoUrl: payload.photoUrl,
        name: payload.name,
        headline: payload.headline,
        company: payload.company,
        role: payload.role,
        offerYear: payload.offerYear,
        placementType: payload.placementType,
        rounds: payload.rounds || [],
        tips: payload.tips || '',
        resources: payload.resources || [],
        linkedInUrl: payload.linkedInUrl || '#',
      };
      const idx = prev.findIndex((s) => s.id === seniorId);
      if (idx >= 0) {
        return prev.map((s) => (s.id === seniorId ? { ...s, ...senior } : s));
      }
      return [senior, ...prev];
    });
  }, []);

  const sendReferralRequest = useCallback(
    ({ seniorId, studentName, studentEmail, message }) => {
      const senior = seniors.find((s) => s.id === seniorId);
      if (!senior || !studentUser) return null;
      const row = {
        id: makeId('ref'),
        seniorId,
        seniorName: senior.name,
        company: senior.company,
        role: senior.role,
        studentId: studentUser.id,
        studentName: studentName || studentUser.name,
        studentEmail,
        message,
        status: 'pending',
        seniorReply: '',
        createdAt: new Date().toLocaleString(),
      };
      setReferrals((prev) => [row, ...prev]);
      return row;
    },
    [seniors, studentUser],
  );

  const updateReferral = useCallback((id, patch) => {
    setReferrals((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const next = { ...r, ...patch };
        if (patch.status === 'accepted' || patch.status === 'declined') {
          setStudentNotifications((n) => [
            {
              id: makeId('notif'),
              referralId: id,
              text:
                patch.status === 'accepted'
                  ? `${r.seniorName} accepted your referral request.`
                  : `${r.seniorName} declined your referral request.`,
              read: false,
              at: new Date().toLocaleString(),
            },
            ...n,
          ]);
        } else if (patch.status === 'replied') {
          setStudentNotifications((n) => [
            {
              id: makeId('notif'),
              referralId: id,
              text: `${r.seniorName} replied to your referral request.`,
              read: false,
              at: new Date().toLocaleString(),
            },
            ...n,
          ]);
        }
        return next;
      }),
    );
  }, []);

  const markNotificationsRead = useCallback(() => {
    setStudentNotifications((n) => n.map((x) => ({ ...x, read: true })));
  }, []);

  const loginStudent = useCallback((name, email) => {
    setStudentUser({ id: `stu-${makeId('u')}`, name, email });
  }, []);

  const logoutStudent = useCallback(() => setStudentUser(null), []);
  const logoutAlumni = useCallback(() => setAlumniUser(null), []);

  const value = useMemo(
    () => ({
      seniors,
      alumniUser,
      studentUser,
      referrals,
      studentNotifications,
      registerAlumniFromLinkedIn,
      saveAlumniPlacementProfile,
      sendReferralRequest,
      updateReferral,
      markNotificationsRead,
      loginStudent,
      logoutStudent,
      logoutAlumni,
    }),
    [
      seniors,
      alumniUser,
      studentUser,
      referrals,
      studentNotifications,
      registerAlumniFromLinkedIn,
      saveAlumniPlacementProfile,
      sendReferralRequest,
      updateReferral,
      markNotificationsRead,
      loginStudent,
      logoutStudent,
      logoutAlumni,
    ],
  );

  return <PlacementContext.Provider value={value}>{children}</PlacementContext.Provider>;
}

export function usePlacement() {
  const ctx = useContext(PlacementContext);
  if (!ctx) throw new Error('usePlacement must be used inside PlacementProvider');
  return ctx;
}
