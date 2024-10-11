// components/Attendance/AttendanceList.js

"use client";

import { useEffect, useState } from 'react';

const AttendanceList = ({ groupId }) => {
  const [attendanceLists, setAttendanceLists] = useState([]);
  const [students, setStudents] = useState([]);
  
  useEffect(() => {
    const fetchAttendanceLists = async () => {
      try {
        const response = await fetch(`/api/attendance?groupId=${groupId}`);
        const data = await response.json();
        console.log('data:', data);
        setAttendanceLists(data);
      } catch (error) {
        console.error("Error fetching attendance lists:", error);
      }
    };

    const fetchStudents = async () => {
      try {
        const response = await fetch(`/api/students?groupId=${groupId}`);
        const data = await response.json();
        console.log('data:', data);
        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    if (groupId) {
      fetchAttendanceLists();
      fetchStudents();
      console.log('groupId:', groupId);
    }
  }, [groupId]);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}/${month}/${day}`;
  }
  
  // Ejemplo de uso
  const formattedDate = formatDate('2024-10-07T00:00:00.000Z');
  console.log(formattedDate); // Salida: 24/10/07

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">Lista de Asistencia</h2>
      {attendanceLists.length > 0 ? (
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-200 p-2">Alumno</th>
              {attendanceLists.map(attendanceList => (
                <th key={attendanceList.id} className="border border-gray-200 p-2">{formatDate(attendanceList.fecha)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id}>
                <td className="border border-gray-200 p-2">{student.name}</td>
                {attendanceLists.map(attendanceList => {
                  const attendance = attendanceList.attendances.find(a => a.student_id === student.id);
                  return (
                    <td key={attendanceList.id} className="border border-gray-200 p-2">
                      {attendance ? (attendance.present ? '✔️' : '❌') : 'N/A'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay listas de asistencia disponibles para este grupo.</p>
      )}
    </div>
  );
};

export default AttendanceList;