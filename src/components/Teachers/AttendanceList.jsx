import { use, useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faFileAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const AttendanceList = ({ groupId }) => {
  const { schoolId : globalSchoolId} = useAuth();

  const [attendanceLists, setAttendanceLists] = useState([]);
  const [students, setStudents] = useState([]);
  const [maxAbsences, setMaxAbsences] = useState(20); // Inicializa con un valor predeterminado
  const [newMaxAbsences, setNewMaxAbsences] = useState(""); // Para el input de max_absences
  const [group, setGroup] = useState(null);
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);

  const [monthlyAttendanceRate, setMonthlyAttendanceRate] = useState({});
  const [perfectAttendanceStudents, setPerfectAttendanceStudents] = useState([]);
  const [lowAttendanceStudents, setLowAttendanceStudents] = useState([]);

  const MAX_ABSENCES = 20; // Máximo de inasistencias permitidas

  useEffect(() => {

    const fetchStudents = async () => {
      try {
        const response = await fetch(`/api/groups?groupId=${groupId}`);
        const data = await response.json();
        setStudents(data.students);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    const fetchGroup = async () => {
      try {
        const response = await fetch(`/api/admin/findGroup?id=${groupId}`);
        const data = await response.json();
        console.log('Group data:', data);
        setGroup(data); // Establece los datos del grupo
      } catch (error) {
        console.error('Error fetching group:', error);
      }
    };

    if (groupId) {
      fetchGroup();
      fetchStudents();
    }
  }, [groupId]);

  useEffect(() => {
    if(!globalSchoolId) return;
    const fetchSchoolPeriod = async () => {
      try {
        // Obtener los datos actuales de la escuela
        const response = await fetch(`/api/schools?schoolId=${globalSchoolId}`);
        if (response.ok) {
          const { startDate, endDate } = await response.json();
          setStartDate(startDate ? startDate.split('T')[0] : ''); // Convertir a formato YYYY-MM-DD
          setEndDate(endDate ? endDate.split('T')[0] : '');
          console.log(startDate,endDate)
        } else {
          console.error('Error al obtener los datos de la escuela');
        }
      } catch (error) {
        console.error('Error al abrir el modal:', error);
      }
    }
    fetchSchoolPeriod();
  }, [globalSchoolId])

  useEffect(() => {
    const fetchAttendanceLists = async () => {
      try {
        const response = await fetch(`/api/attendance?groupId=${groupId}`);
        const data = await response.json();

        console.log('Attendance lists:', data);

        const generateAttendanceDates = () => {
          const dates = [];
          //const currentDate = data[0] ? new Date(data[0].fecha) : new Date();
          //const endDate1 = new Date(currentDate.getFullYear(), 11, 15); // 15 de diciembre
          //console.log('working start date' , currentDate, 'working end date : ' , endDate1)
          const currentDate = new Date(startDate);
          const finalDate = new Date(endDate);
  
          console.log('global start date : ', startDate, 'global end date : ' ,endDate)
          while (currentDate <= finalDate) {
            const day = currentDate.getDay();
            // Solo lunes (1), miércoles (3) y viernes (5)
            console.log('group:', group);
            if (group.classDays.includes(day)) {
              const formattedDate = currentDate.toISOString().split("T")[0];
              dates.push(formattedDate);
            }
            currentDate.setDate(currentDate.getDate() + 1);
          }
          return dates;
        };

        const requiredDates = generateAttendanceDates();
      // Completa `attendanceLists` con fechas faltantes
      const updatedAttendanceLists = requiredDates.map(date => {
        return data.find(list => list.fecha.startsWith(date)) || {
          fecha: date,
          attendances: students.map(student => ({
            student_id: student.id,
            present: null, // Inicializa como no presente
          })),
        };
      });

      setAttendanceLists(updatedAttendanceLists);
       // setAttendanceLists(data);
      } catch (error) {
        console.error("Error fetching attendance lists:", error);
      }
    };

    fetchAttendanceLists();

  }, [startDate, endDate, group, students]);

  useEffect(() => { 
    console.log('attendanceLists:', attendanceLists);
    console.log('students:', students);
  }, [attendanceLists, students]);

  useEffect(() => {
    if (attendanceLists.length > 0) {
      calculateMonthlyAttendanceRate();
      generateStudentAttendanceRanking();
    }
  }, [attendanceLists]);

  useEffect(() => {
    if (group) {
      setMaxAbsences(group.max_absences);
      //setNewMaxAbsences(group.max_absences);
    }
  }, [group]);

  const handleMaxAbsencesChange = (event) => {
    setNewMaxAbsences(event.target.value);
  };

  const updateMaxAbsences = async () => {
    try {
      const response = await fetch('/api/teacher/maxAbsences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ max_absences: newMaxAbsences , groupId }),
      });

      if (response.ok) {
        setMaxAbsences(newMaxAbsences);
        alert('Límite de faltas actualizado correctamente.');
      } else {
        alert('Error al actualizar el límite de faltas.');
      }
    } catch (error) {
      console.error("Error updating max absences:", error);
      alert('Hubo un error al actualizar el límite de faltas.');
    }
  };

  // Función para formatear fechas
  const formattedDate = (fecha) => {
    const date = new Date(fecha);
    const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    const formattedDate = adjustedDate.toLocaleDateString();
    return formattedDate;
  };

  // Función para calcular inasistencias
  function calculateAbsences(studentId) {
    let absences = 0;
    attendanceLists.forEach((attendanceList) => {
      const attendance = attendanceList.attendances.find(
        (a) => a.student_id === studentId
      );
      if (attendance && attendance.present === 0) {
        absences++;
      }
    });
    return absences;
  }

  // Función para determinar el color del cuadrado según las inasistencias
  function getAbsenceColor(absences) {
    const percentage = (absences / maxAbsences) * 100;
    if (percentage <= 25) {
      return "bg-green-500"; // Verde
    } else if (percentage <= 75) {
      return "bg-orange-500"; // Naranja
    } else {
      return "bg-red-500"; // Rojo
    }
  }

  const handleConfirmChange = async () => {
    if (!selectedAttendance) return;

    try {
      const response = await fetch('/api/teacher/updateAttendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attendanceId: selectedAttendance.id }),
      });

      if (response.ok) {
        const updatedAttendance = await response.json();
        setAttendanceData((prevData) =>
          prevData.map((att) =>
            att.id === updatedAttendance.id ? { ...att, present: updatedAttendance.present } : att
          )
        );
        setShowConfirmModal(false);
        selectedAttendance.present = updatedAttendance.present;
        setSelectedAttendance(null);
      } else {
        console.error('Error al actualizar la asistencia');
      }
    } catch (error) {
      
      console.error('Error al conectar con la API', error);
    }
  };

  const handleAttendanceClick = (attendance, student) => {
    if (!attendance) {
      console.error('No se encontró la asistencia.');
      return;
    }
    console.log('Selected attendance:', attendance);
    setSelectedAttendance(attendance);
    setSelectedStudent(student);
    setShowConfirmModal(true);
  };

  // Calcula el porcentaje de asistencia por grupo
  const calculateGroupAttendancePercentage = () => {
    let totalAttendances = 0;
    let totalPresent = 0;

    attendanceLists.forEach(list => {
      totalAttendances += list.attendances.length;
      totalPresent += list.attendances.filter(a => a.present === 1).length;
    });

    return totalAttendances > 0 ? ((totalPresent / totalAttendances) * 100).toFixed(2) : "0.00";
  };

  // Calcula la tasa de asistencia mensual
  const calculateMonthlyAttendanceRate = () => {
    const monthlyData = {};

    attendanceLists.forEach(list => {
      const month = new Date(list.fecha).getMonth();
      if (!monthlyData[month]) monthlyData[month] = { total: 0, present: 0 };
      monthlyData[month].total += list.attendances.length;
      monthlyData[month].present += list.attendances.filter(a => a.present === 1).length;
    });

    const rate = {};
    Object.keys(monthlyData).forEach(month => {
      rate[month] = ((monthlyData[month].present / monthlyData[month].total) * 100).toFixed(2);
    });

    setMonthlyAttendanceRate(rate);
  };

  // Genera el ranking de estudiantes con asistencia perfecta o baja
  const generateStudentAttendanceRanking = () => {
    const perfectAttendance = [];
    const lowAttendance = [];

    students.forEach(student => {
      const totalAttendances = attendanceLists.reduce((count, list) => 
        count + list.attendances.filter(a => a.student_id === student.id).length, 0
      );
      const presentAttendances = attendanceLists.reduce((count, list) => 
        count + list.attendances.filter(a => a.student_id === student.id && a.present === 1).length, 0
      );

      if (totalAttendances === presentAttendances && totalAttendances > 0) {
        perfectAttendance.push(student);
      } else if (totalAttendances > 0 && presentAttendances / totalAttendances <= 0.5) {
        lowAttendance.push(student);
      }
    });

    setPerfectAttendanceStudents(perfectAttendance);
    setLowAttendanceStudents(lowAttendance);
  };



  return (
    <div
      className=" ml-52 mt-2 overflow-x-auto scrollbar-hide"
      style={{
        msOverflowStyle: "none", // Para IE y Edge
        scrollbarWidth: "none", // Para Firefox
      }}
    >
      <h2 className="text-2xl font-bold mb-4 sticky">Lista de Asistencia</h2>
      {/* Input para cambiar el límite de faltas */}
      <div className="mb-4">
        <label className="block font-semibold mb-2">
          Establecer límite máximo de faltas:
        </label>
        <input
          type="number"
          value={newMaxAbsences}
          onChange={handleMaxAbsencesChange}
          placeholder={`Actual: ${group?.max_absences}`}
          className="border p-2 mb-2"
        />
        <button
          onClick={updateMaxAbsences}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 ml-6"
        >
          Actualizar límite de faltas
        </button>
      </div>
      {attendanceLists.length > 0 ? (
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-200 p-2 sticky left-0 bg-white z-10">
                Alumno
              </th>
              {attendanceLists.map((attendanceList) => (
                <th
                  key={attendanceList.id}
                  className="border border-gray-200 p-2 min-w-[150px]"
                >
                  {formattedDate(attendanceList.fecha)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((student) => {
              const absences = calculateAbsences(student.id);
              return (
                <tr key={student.id}>
                  <td className="border border-gray-200 p-2 flex items-center w-80 sticky left-0 bg-white z-10">
                    {/* Icono de correo */}
                    <a
                      href={`mailto:${student.email}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mr-2"
                    >
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        className="text-blue-500 hover:text-blue-700"
                      />
                    </a>
                    {/* Cuadrado de color */}
                    <span
                      className={`inline-block w-4 h-4 mr-2 ${getAbsenceColor(
                        absences
                      )}`}
                      style={{ borderRadius: "4px" }}
                    ></span>
                    {/* Nombre del estudiante con inasistencias */}
                    {student.name} - {absences}/{maxAbsences}
                  </td>
                  {attendanceLists.map((attendanceList) => {
                    const attendance = attendanceList.attendances.find(
                      (a) => a.student_id === student.id
                    );
                    return (
                      <td
                        key={attendanceList.id}
                        className="border border-gray-200 p-2"
                        onClick={() =>
                          handleAttendanceClick(attendance, student)
                        }
                      >
                        {attendance ? (
                          attendance.present === 1 ? (
                            <FontAwesomeIcon
                              icon={faCheck}
                              className="text-green-500"
                            />
                          ) : attendance.present === 2 ? (
                            <FontAwesomeIcon
                              icon={faFileAlt}
                              className="text-blue-500"
                            />
                          ) : attendance.present === 0 ? (
                            <FontAwesomeIcon
                              icon={faTimes}
                              className="text-red-500"
                            />
                          ) : attendance.present === 3 ? (
                            <FontAwesomeIcon
                              icon={faTimes}
                              className="text-red-500"
                            />
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
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>Cargando listas de asistencia...</p>
      )}

      {/* Porcentaje de Asistencia por Grupo */}
      <div className="mb-8 mt-8 p-4 bg-gray-50 shadow rounded-lg">
        <h3 className="text-lg font-semibold mb-2">
          Porcentaje de Asistencia del Grupo
        </h3>
        <p className="text-2xl text-blue-600 font-bold">
          {calculateGroupAttendancePercentage()}%
        </p>
      </div>

      {/* Tasa de Asistencia Mensual */}
      <div className="mb-8 p-4 bg-ray-100 shadow rounded-lg">
        <h3 className="text-lg font-semibold mb-4">
          Tasa de Asistencia Mensual
        </h3>
        <ul className="space-y-2">
          {Object.keys(monthlyAttendanceRate).map((month) => (
            <li key={month} className="flex justify-between items-center">
              <span className="font-medium">Mes {Number(month) + 1}: {monthlyAttendanceRate[month]}%</span>
              
            </li>
          ))}
        </ul>
      </div>

      {/* Ranking de Estudiantes */}
      <div className="mb-8 p-4 bg-gray-200 shadow rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Ranking de Estudiantes</h3>
        <div className="mb-4">
          <h4 className="font-semibold text-green-600 mb-2">
            Asistencia Perfecta
          </h4>
          <ul className="list-disc list-inside space-y-1">
            {perfectAttendanceStudents.map((student) => (
              <li key={student.id}>{student.name}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-red-600 mb-2">Asistencia Baja</h4>
          <ul className="list-disc list-inside space-y-1">
            {lowAttendanceStudents.map((student) => (
              <li key={student.id}>{student.name}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Modal de Confirmación */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-10">
          <div className="bg-white p-4 rounded shadow-md w-1/3">
            <h3 className="text-xl font-semibold mb-4">
              ¿Confirmar cambio de asistencia?
            </h3>
            <p className="mb-4">
              {`¿Quieres marcar a ${selectedStudent.name} como ${
                selectedAttendance.present ? "Ausente" : "Presente"
              }?`}
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded mr-2"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmChange}
                className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceList;