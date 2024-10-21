// components/Attendance/AttendanceList.js

"use client";

import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faFileAlt } from '@fortawesome/free-solid-svg-icons';

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
        const response = await fetch(`/api/groups?groupId=${groupId}`);
        const data = await response.json();
        console.log('data:', data);
        setStudents(data.students);
        
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

  const formattedDate = (fecha) => {
    const date = new Date(fecha);
    const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    const formattedDate = adjustedDate.toLocaleDateString();
    return formattedDate;
  };
  
  

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">Lista de Asistencia</h2>
      {attendanceLists.length > 0 ? (
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-200 p-2">Alumno</th>
              {attendanceLists.map(attendanceList => (
                <th key={attendanceList.id} className="border border-gray-200 p-2">{formattedDate(attendanceList.fecha)}</th>
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
                      {attendance ? (
                        attendance.present === 1 ? (
                          <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                        ) : attendance.present === 2 ? (
                          <FontAwesomeIcon icon={faFileAlt} className="text-blue-500" />
                        ) : attendance.present === 3 ? (
                          <FontAwesomeIcon icon={faTimes} className="text-red-500" />
                        ) : attendance.present === 0 ? (
                          <FontAwesomeIcon icon={faTimes} className="text-red-500" />
                        ) : (
                          "N/A"
                        )
                      ) : (
                        "N/A"
                      )}
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