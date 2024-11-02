'use client'
import { useParams } from 'next/navigation';
import AttendanceList from '../../../../components/Teachers/AttendanceList';

const GroupPage = () => {
  const { groupId } = useParams();

  return (
    <div>
      <h1 className="ml-52 text-2xl font-extrabold text-gray-800 dark:text-gray-200 mt-8 mb-2">
        Asistencia para el Grupo {groupId}
      </h1>
      <div className="mt-2 p-8">
        <AttendanceList groupId={groupId} />
      </div>
    </div>
  );
};

export default GroupPage;