import React from 'react';

export default function DashboardOverview() {
  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">TEACHER DASHBOARD</h1>
      <p className="text-slate-500 text-sm mb-8">Manage your assigned classes, mark attendance, and view your profile.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-[#e6f7f6] p-6 rounded border border-[#d0ecea]">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Total Students</h3>
          <p className="text-3xl font-black text-slate-800">124</p>
        </div>
        <div className="bg-[#e6f7f6] p-6 rounded border border-[#d0ecea]">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Attendance Marked (Today)</h3>
          <p className="text-3xl font-black text-slate-800">2/3 <span className="text-sm font-medium text-slate-500">Classes</span></p>
        </div>
      </div>

      <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Today's Schedule</h2>
      <div className="space-y-3">
        {[
          { time: '09:00 AM - 10:00 AM', subject: 'Data Structures (CS-301)', branch: 'CSE - 2nd Year', status: 'Completed' },
          { time: '11:30 AM - 12:30 PM', subject: 'Algorithm Design (CS-302)', branch: 'CSE - 3rd Year', status: 'Completed' },
          { time: '02:00 PM - 04:00 PM', subject: 'Web Dev Lab (CS-303L)', branch: 'IT - 3rd Year', status: 'Pending' },
        ].map((cls, idx) => (
          <div key={idx} className="flex items-center justify-between p-4 border border-gray-100 rounded hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-slate-50 p-3 rounded text-slate-600 font-medium text-sm w-40 text-center">
                {cls.time}
              </div>
              <div>
                <h4 className="font-bold text-slate-800">{cls.subject}</h4>
                <p className="text-sm text-slate-500">{cls.branch}</p>
              </div>
            </div>
            <div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                cls.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {cls.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
