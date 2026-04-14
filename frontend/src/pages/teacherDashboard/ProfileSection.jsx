import React, { useState } from 'react';

const defaultPhoto =
  'data:image/jpeg;base64,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';

export default function ProfileSection({ profile, setProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editState, setEditState] = useState(profile || {
    name: 'Dr. Natthan Singh',
    title: 'Associate Professor, Computer Science and Engineering Department',
    employeeId: 'EMP-2015-CS-042',
    department: 'Computer Science & Engineering',
    joiningDate: '14 August 2015',
    email: 'natthan.singh@ietlucknow.ac.in',
    phone: '+91 98765 43210',
    cabin: 'Room 304, Academic Block A',
    avatar: defaultPhoto,
  });

  React.useEffect(() => {
    if (!isEditing && profile) {
      setEditState(profile);
    }
  }, [profile, isEditing]);

  const handleSave = () => {
    setProfile(editState);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditState(profile);
    setIsEditing(false);
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Teacher Profile</h1>
      <p className="text-slate-500 text-sm mb-8">View and manage your personal and academic information.</p>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="bg-[#e6f7f6] h-32 relative"></div>

        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
              <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
            </div>
            {isEditing ? (
              <div className="flex gap-2">
                <button onClick={handleSave} className="bg-green-600 text-white text-sm font-semibold py-2 px-4 rounded shadow-sm hover:bg-green-700">
                  Save
                </button>
                <button onClick={handleCancel} className="bg-gray-100 text-slate-700 text-sm font-semibold py-2 px-4 rounded shadow-sm hover:bg-gray-200">
                  Cancel
                </button>
              </div>
            ) : (
              <button onClick={() => setIsEditing(true)} className="bg-white border border-gray-200 hover:bg-gray-50 text-slate-700 text-sm font-semibold py-2 px-4 rounded shadow-sm">
                Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Profile Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const result = event.target?.result;
                      if (typeof result === 'string') {
                        setEditState((prev) => ({ ...prev, avatar: result }));
                      }
                    };
                    reader.readAsDataURL(file);
                  }}
                  className="block w-full text-sm text-slate-700"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Full Name</label>
                <input value={editState.name} onChange={(e) => setEditState({ ...editState, name: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Title</label>
                <input value={editState.title} onChange={(e) => setEditState({ ...editState, title: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Email</label>
                <input value={editState.email} onChange={(e) => setEditState({ ...editState, email: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Phone Number</label>
                  <input value={editState.phone} onChange={(e) => setEditState({ ...editState, phone: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Office Cabin</label>
                  <input value={editState.cabin} onChange={(e) => setEditState({ ...editState, cabin: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2" />
                </div>
              </div>
            </div>
          ) : (
            <>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{profile.name}</h2>
                <p className="text-slate-500 font-medium">{profile.title}</p>
              </div>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b pb-2">Institutional Details</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Employee ID</p>
                      <p className="text-sm font-semibold text-slate-800">{profile.employeeId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Department</p>
                      <p className="text-sm font-semibold text-slate-800">{profile.department}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Date of Joining</p>
                      <p className="text-sm font-semibold text-slate-800">{profile.joiningDate}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b pb-2">Contact Information</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Official Email</p>
                      <p className="text-sm font-semibold text-slate-800">{profile.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Phone Number</p>
                      <p className="text-sm font-semibold text-slate-800">{profile.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Office Cabin</p>
                      <p className="text-sm font-semibold text-slate-800">{profile.cabin}</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}