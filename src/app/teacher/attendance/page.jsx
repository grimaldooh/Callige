// app/teacher/attendance/page.jsx
'use client';
import AttendanceCamera from '../../../components/Teachers/AttendanceCamera';

const AttendancePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Control de Asistencia</h1>
      <AttendanceCamera />
    </div>
  );
};

export default AttendancePage;