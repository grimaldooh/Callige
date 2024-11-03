'use client'

import React from 'react';
//import AttendanceHistory from '@/components/AttendanceHistory';
//import AverageAttendance from '@/components/AverageAttendance';
//import JustificanteApprovalStats from '@/components/JustificanteApprovalStats';
import JustificantesOverview from '../../../components/Stats/JustificantesOverview';
//import GroupRetentionAnalysis from '@/components/GroupRetentionAnalysis';
import EventAttendanceAverage from '../../../components/Stats/EventAttendanceAverage';
const AdminStatsPage = () => {
  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-4 mt-8 text-left">
        Panel de Estadísticas 
      </h1>{" "}
      <EventAttendanceAverage />
      <JustificantesOverview />
    </div>
  );
};

export default AdminStatsPage;