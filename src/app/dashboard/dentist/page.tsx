"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  Heart, 
  Calendar, 
  Users, 
  FileText, 
  BarChart3, 
  Settings,
  Bell,
  Search,
  Plus,
  TrendingUp,
  Clock,
  DollarSign
} from 'lucide-react';

export default function DentistDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // Sample data
  const todayStats = {
    appointments: 12,
    patients: 8,
    revenue: 3250,
    procedures: 15
  };

  const upcomingAppointments = [
    { id: 1, patient: "Sarah Johnson", time: "9:00 AM", procedure: "Cleaning", status: "confirmed" },
    { id: 2, patient: "Michael Chen", time: "10:30 AM", procedure: "Root Canal", status: "confirmed" },
    { id: 3, patient: "Emily Davis", time: "2:00 PM", procedure: "Crown Prep", status: "pending" },
    { id: 4, patient: "Robert Wilson", time: "3:30 PM", procedure: "Consultation", status: "confirmed" },
  ];

  const recentPatients = [
    { id: 1, name: "Alice Brown", lastVisit: "2024-01-15", nextAppointment: "2024-02-15", status: "active" },
    { id: 2, name: "David Lee", lastVisit: "2024-01-14", nextAppointment: "2024-03-14", status: "active" },
    { id: 3, name: "Maria Garcia", lastVisit: "2024-01-13", nextAppointment: "Pending", status: "follow-up" },
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
              <span className="ml-4 text-gray-400">Dentist Dashboard</span>
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
              <button className="p-2 text-gray-400 hover:text-white">
                <Settings className="h-5 w-5" />
              </button>
              <div className="text-sm text-gray-400">
                Dr. Smith | {currentTime}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Good morning, Dr. Smith</h1>
          <p className="text-gray-400">Here's what's happening in your practice today.</p>
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
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
              <span className="text-green-400">+12%</span>
              <span className="text-gray-400 ml-1">from yesterday</span>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Patients Seen</p>
                <p className="text-2xl font-bold text-white">{todayStats.patients}</p>
              </div>
              <Users className="h-8 w-8 text-green-400" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
              <span className="text-green-400">+8%</span>
              <span className="text-gray-400 ml-1">from yesterday</span>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Today's Revenue</p>
                <p className="text-2xl font-bold text-white">${todayStats.revenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-400" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
              <span className="text-green-400">+15%</span>
              <span className="text-gray-400 ml-1">from yesterday</span>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Procedures</p>
                <p className="text-2xl font-bold text-white">{todayStats.procedures}</p>
              </div>
              <FileText className="h-8 w-8 text-purple-400" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
              <span className="text-green-400">+5%</span>
              <span className="text-gray-400 ml-1">from yesterday</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Today's Appointments */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Today's Appointments</h2>
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                New Appointment
              </button>
            </div>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{appointment.patient}</p>
                      <p className="text-sm text-gray-400">{appointment.procedure}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{appointment.time}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      appointment.status === 'confirmed' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-yellow-600 text-white'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Patients */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Recent Patients</h2>
              <Link href="/patients" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {recentPatients.map((patient) => (
                <div key={patient.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-600 rounded-full">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-sm text-gray-400">Last visit: {patient.lastVisit}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-300">Next: {patient.nextAppointment}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      patient.status === 'active' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-orange-600 text-white'
                    }`}>
                      {patient.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              <Calendar className="h-8 w-8 text-blue-400 mb-2" />
              <span className="text-sm font-medium">Schedule Appointment</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              <Users className="h-8 w-8 text-green-400 mb-2" />
              <span className="text-sm font-medium">Add Patient</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              <FileText className="h-8 w-8 text-purple-400 mb-2" />
              <span className="text-sm font-medium">Create Treatment Plan</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              <BarChart3 className="h-8 w-8 text-yellow-400 mb-2" />
              <span className="text-sm font-medium">View Reports</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
