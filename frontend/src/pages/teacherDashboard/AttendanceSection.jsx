import React, { useState, useMemo } from 'react';

// Class/subject definitions with their students
const CLASS_DATA = {
  'Data Structures (CS-301) - CSE 2nd Yr': {
    department: 'CSE',
    year: '2nd',
    students: [
      { id: '210052010001', name: 'Aarav Patel' },
      { id: '210052010002', name: 'Diya Sharma' },
      { id: '210052010003', name: 'Kabir Singh' },
      { id: '210052010004', name: 'Meera Reddy' },
      { id: '210052010005', name: 'Vivaan Gupta' },
    ],
  },
  'Algorithm Design (CS-302) - CSE 3rd Yr': {
    department: 'CSE',
    year: '3rd',
    students: [
      { id: '210052010011', name: 'Rohit Verma' },
      { id: '210052010012', name: 'Sneha Iyer' },
      { id: '210052010013', name: 'Amit Tiwari' },
      { id: '210052010014', name: 'Priya Chauhan' },
    ],
  },
  'Database Systems (CS-401) - CSE 4th Yr': {
    department: 'CSE',
    year: '4th',
    students: [
      { id: '210052010021', name: 'Neha Agrawal' },
      { id: '210052010022', name: 'Raghav Mishra' },
      { id: '210052010023', name: 'Tanvi Kapoor' },
    ],
  },
  'Operating Systems (CS-303) - CSE 3rd Yr': {
    department: 'CSE',
    year: '3rd',
    students: [
      { id: '210052010011', name: 'Rohit Verma' },
      { id: '210052010012', name: 'Sneha Iyer' },
      { id: '210052010013', name: 'Amit Tiwari' },
      { id: '210052010014', name: 'Priya Chauhan' },
      { id: '210052010015', name: 'Karan Malhotra' },
      { id: '210052010016', name: 'Shruti Pandey' },
    ],
  },
  'Computer Networks (CS-304) - CSE 2nd Yr': {
    department: 'CSE',
    year: '2nd',
    students: [
      { id: '210052010001', name: 'Aarav Patel' },
      { id: '210052010002', name: 'Diya Sharma' },
      { id: '210052010003', name: 'Kabir Singh' },
      { id: '210052010004', name: 'Meera Reddy' },
      { id: '210052010005', name: 'Vivaan Gupta' },
      { id: '210052010006', name: 'Ananya Joshi' },
    ],
  },
};

const classNames = Object.keys(CLASS_DATA);

export default function AttendanceSection() {
  const [selectedClass, setSelectedClass] = useState(classNames[0]);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [saved, setSaved] = useState(false);

  // Track attendance per class+date combo
  const [attendanceMap, setAttendanceMap] = useState({});

  const classInfo = CLASS_DATA[selectedClass];

  // Build a unique key for class + date combo
  const comboKey = `${selectedClass}__${date}`;

  // Get or initialize attendance for current selection
  const currentAttendance = useMemo(() => {
    if (attendanceMap[comboKey]) return attendanceMap[comboKey];
    // Default all to present
    const initial = {};
    classInfo.students.forEach((s) => { initial[s.id] = 'present'; });
    return initial;
  }, [comboKey, attendanceMap, classInfo]);

  const toggleStatus = (studentId) => {
    setSaved(false);
    const updated = {
      ...currentAttendance,
      [studentId]: currentAttendance[studentId] === 'present' ? 'absent' : 'present',
    };
    setAttendanceMap((prev) => ({ ...prev, [comboKey]: updated }));
  };

  const handleSave = () => {
    // Persist current attendance into the map
    setAttendanceMap((prev) => ({ ...prev, [comboKey]: { ...currentAttendance } }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const presentCount = classInfo.students.filter((s) => currentAttendance[s.id] === 'present').length;
  const absentCount = classInfo.students.length - presentCount;

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Mark Attendance</h1>
          <p className="text-slate-500 text-sm">Select subject and date to record student attendance.</p>
        </div>
        <button
          onClick={handleSave}
          className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold py-2 px-6 rounded transition-colors shadow-sm"
        >
          {saved ? '✓ Saved!' : 'Save Attendance'}
        </button>
      </div>

      <div className="flex gap-4 mb-6 bg-slate-50 p-4 rounded border border-gray-100">
        <select
          value={selectedClass}
          onChange={(e) => { setSelectedClass(e.target.value); setSaved(false); }}
          className="border border-gray-200 rounded p-2 text-sm text-slate-700 bg-white focus:outline-none w-1/3"
        >
          {classNames.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => { setDate(e.target.value); setSaved(false); }}
          className="border border-gray-200 rounded p-2 text-sm text-slate-700 bg-white focus:outline-none"
        />
      </div>

      {/* Class info tag */}
      <div className="flex gap-3 mb-4">
        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-blue-50 text-blue-600 border border-blue-200">
          {classInfo.department}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-purple-50 text-purple-600 border border-purple-200">
          {classInfo.year} Year
        </span>
        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-gray-50 text-gray-600 border border-gray-200">
          {classInfo.students.length} Students
        </span>
      </div>

      <div className="border border-gray-200 rounded overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-gray-200 text-xs uppercase tracking-wider text-slate-500">
              <th className="p-4 font-semibold w-24">S.No</th>
              <th className="p-4 font-semibold w-48">Roll Number</th>
              <th className="p-4 font-semibold">Student Name</th>
              <th className="p-4 font-semibold text-center w-48">Action</th>
            </tr>
          </thead>
          <tbody>
            {classInfo.students.map((student, idx) => (
              <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4 text-sm text-slate-600 font-medium">{idx + 1}</td>
                <td className="p-4 text-sm text-slate-800 font-bold">{student.id}</td>
                <td className="p-4 text-sm text-slate-700">{student.name}</td>
                <td className="p-4 flex justify-center">
                  <button 
                    onClick={() => toggleStatus(student.id)}
                    className={`flex items-center w-28 rounded overflow-hidden text-xs font-bold transition-all border ${
                      currentAttendance[student.id] === 'present' 
                        ? 'bg-green-50 border-green-200 text-green-700' 
                        : 'bg-red-50 border-red-200 text-red-700'
                    }`}
                  >
                    <span className={`flex-1 py-1.5 text-center ${currentAttendance[student.id] === 'present' ? 'bg-green-500 text-white' : ''}`}>
                      P
                    </span>
                    <span className={`flex-1 py-1.5 text-center ${currentAttendance[student.id] === 'absent' ? 'bg-red-500 text-white' : ''}`}>
                      A
                    </span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-sm text-slate-500 flex gap-4">
        <span>Total Present: <strong className="text-green-600">{presentCount}</strong></span>
        <span>Total Absent: <strong className="text-red-600">{absentCount}</strong></span>
      </div>
    </div>
  );
}
