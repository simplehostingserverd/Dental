"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  Heart, 
  Calendar, 
  Users, 
  Phone, 
  Clock,
  Bell,
  Search,
  Plus,
  CheckCircle,
  AlertCircle,
  User
} from 'lucide-react';

export default function EmployeeDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // Sample data
  const todayStats = {
    appointments: 18,
    checkedIn: 12,
    waitingRoom: 3,
    calls: 25
  };

  const todaySchedule = [
    { id: 1, time: "9:00 AM", patient: "Sarah Johnson", procedure: "Cleaning", doctor: "Dr. Smith", status: "checked-in" },
    { id: 2, time: "9:30 AM", patient: "Michael Chen", procedure: "Consultation", doctor: "Dr. Smith", status: "waiting" },
    { id: 3, time: "10:00 AM", patient: "Emily Davis", procedure: "Root Canal", doctor: "Dr. Smith", status: "confirmed" },
    { id: 4, time: "10:30 AM", patient: "Robert Wilson", procedure: "Crown Prep", doctor: "Dr. Smith", status: "confirmed" },
    { id: 5, time: "11:00 AM", patient: "Lisa Brown", procedure: "Cleaning", doctor: "Dr. Smith", status: "confirmed" },
  ];

  const waitingPatients = [
    { id: 1, name: "Michael Chen", appointmentTime: "9:30 AM", waitTime: "15 min", status: "waiting" },
    { id: 2, name: "David Lee", appointmentTime: "10:15 AM", waitTime: "5 min", status: "ready" },
    { id: 3, name: "Maria Garcia", appointmentTime: "11:00 AM", waitTime: "Just arrived", status: "checked-in" },
  ];

  const recentCalls = [
    { id: 1, caller: "Alice Brown", time: "10:45 AM", purpose: "Appointment booking", status: "completed" },
    { id: 2, caller: "John Smith", time: "10:30 AM", purpose: "Insurance inquiry", status: "completed" },
    { id: 3, caller: "Emma Wilson", time: "10:15 AM", purpose: "Rescheduling", status: "completed" },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-blue-400 mr-3" />
              <span className="font-bold text-xl">Cognident</span>
              <span className="ml-4 text-gray-400">Employee Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="relative p-2 text-gray-400 hover:text-white">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-400">Jane Receptionist | {currentTime}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Good morning, Jane</h1>
          <p className="text-gray-400">Here's your front desk overview for today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Today's Appointments</p>
                <p className="text-2xl font-bold text-white">{todayStats.appointments}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-400" />
            </div>
            <div className="mt-2 text-sm text-gray-400">
              Scheduled for today
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Checked In</p>
                <p className="text-2xl font-bold text-white">{todayStats.checkedIn}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
            <div className="mt-2 text-sm text-gray-400">
              Patients processed
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Waiting Room</p>
                <p className="text-2xl font-bold text-white">{todayStats.waitingRoom}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
            <div className="mt-2 text-sm text-gray-400">
              Currently waiting
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Phone Calls</p>
                <p className="text-2xl font-bold text-white">{todayStats.calls}</p>
              </div>
              <Phone className="h-8 w-8 text-purple-400" />
            </div>
            <div className="mt-2 text-sm text-gray-400">
              Handled today
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Today's Schedule */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Today's Schedule</h2>
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add Appointment
              </button>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {todaySchedule.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-sm font-medium text-blue-400 w-16">
                      {appointment.time}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{appointment.patient}</p>
                      <p className="text-xs text-gray-400">{appointment.procedure} - {appointment.doctor}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      appointment.status === 'checked-in' 
                        ? 'bg-green-600 text-white' 
                        : appointment.status === 'waiting'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-blue-600 text-white'
                    }`}>
                      {appointment.status}
                    </span>
                    <button className="text-gray-400 hover:text-white">
                      <CheckCircle className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Waiting Room */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Waiting Room</h2>
              <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {waitingPatients.length} waiting
              </span>
            </div>
            <div className="space-y-4">
              {waitingPatients.map((patient) => (
                <div key={patient.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-yellow-600 rounded-full">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-sm text-gray-400">Appt: {patient.appointmentTime}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{patient.waitTime}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      patient.status === 'ready' 
                        ? 'bg-green-600 text-white' 
                        : patient.status === 'waiting'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-blue-600 text-white'
                    }`}>
                      {patient.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Recent Phone Calls</h2>
          <div className="space-y-4">
            {recentCalls.map((call) => (
              <div key={call.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-purple-600 rounded-full">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{call.caller}</p>
                    <p className="text-sm text-gray-400">{call.purpose}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-300">{call.time}</p>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-600 text-white">
                    {call.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              <CheckCircle className="h-8 w-8 text-green-400 mb-2" />
              <span className="text-sm font-medium">Check In Patient</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              <Calendar className="h-8 w-8 text-blue-400 mb-2" />
              <span className="text-sm font-medium">Schedule Appointment</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              <Phone className="h-8 w-8 text-purple-400 mb-2" />
              <span className="text-sm font-medium">Log Phone Call</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              <Users className="h-8 w-8 text-yellow-400 mb-2" />
              <span className="text-sm font-medium">Add New Patient</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
