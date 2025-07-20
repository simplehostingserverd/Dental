"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  Heart, 
  Calendar, 
  FileText, 
  CreditCard, 
  Bell,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Phone
} from 'lucide-react';

export default function PatientDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // Sample patient data
  const patientInfo = {
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "(555) 123-4567",
    dateOfBirth: "1985-06-15",
    lastVisit: "2024-01-15"
  };

  const upcomingAppointments = [
    { id: 1, date: "2024-02-15", time: "10:00 AM", procedure: "Regular Cleaning", doctor: "Dr. Smith", status: "confirmed" },
    { id: 2, date: "2024-03-20", time: "2:00 PM", procedure: "Crown Placement", doctor: "Dr. Smith", status: "pending" },
  ];

  const recentTreatments = [
    { id: 1, date: "2024-01-15", procedure: "Dental Cleaning", doctor: "Dr. Smith", status: "completed" },
    { id: 2, date: "2023-12-10", procedure: "Cavity Filling", doctor: "Dr. Smith", status: "completed" },
    { id: 3, date: "2023-11-05", procedure: "X-Ray", doctor: "Dr. Smith", status: "completed" },
  ];

  const bills = [
    { id: 1, date: "2024-01-15", amount: 150, description: "Dental Cleaning", status: "paid" },
    { id: 2, date: "2024-01-15", amount: 75, description: "X-Ray", status: "paid" },
    { id: 3, date: "2023-12-10", amount: 200, description: "Cavity Filling", status: "pending" },
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
              <span className="ml-4 text-gray-400">Patient Portal</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-white">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-400">{patientInfo.name}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {patientInfo.name}</h1>
          <p className="text-gray-400">Manage your dental health and appointments.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Next Appointment</p>
                <p className="text-xl font-bold text-white">Feb 15, 2024</p>
                <p className="text-sm text-gray-400">10:00 AM - Cleaning</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Last Visit</p>
                <p className="text-xl font-bold text-white">Jan 15, 2024</p>
                <p className="text-sm text-gray-400">Cleaning completed</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Outstanding Balance</p>
                <p className="text-xl font-bold text-white">$200.00</p>
                <p className="text-sm text-gray-400">1 pending payment</p>
              </div>
              <CreditCard className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upcoming Appointments */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Book Appointment
              </button>
            </div>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{appointment.procedure}</p>
                      <p className="text-sm text-gray-400">{appointment.doctor}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{appointment.date}</p>
                    <p className="text-sm text-gray-400">{appointment.time}</p>
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

          {/* Recent Treatments */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Treatment History</h2>
              <Link href="/treatments" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {recentTreatments.map((treatment) => (
                <div key={treatment.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-green-600 rounded-full">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{treatment.procedure}</p>
                      <p className="text-sm text-gray-400">{treatment.doctor}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-300">{treatment.date}</p>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-600 text-white">
                      {treatment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Billing Section */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Billing & Payments</h2>
            <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">
              Make Payment
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400 text-sm font-medium">Date</th>
                  <th className="text-left py-3 px-4 text-gray-400 text-sm font-medium">Description</th>
                  <th className="text-left py-3 px-4 text-gray-400 text-sm font-medium">Amount</th>
                  <th className="text-left py-3 px-4 text-gray-400 text-sm font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill) => (
                  <tr key={bill.id} className="border-b border-gray-700">
                    <td className="py-3 px-4 text-sm">{bill.date}</td>
                    <td className="py-3 px-4 text-sm">{bill.description}</td>
                    <td className="py-3 px-4 text-sm font-medium">${bill.amount}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        bill.status === 'paid' 
                          ? 'bg-green-600 text-white' 
                          : 'bg-yellow-600 text-white'
                      }`}>
                        {bill.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              <Calendar className="h-8 w-8 text-blue-400 mb-2" />
              <span className="text-sm font-medium">Book Appointment</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              <FileText className="h-8 w-8 text-green-400 mb-2" />
              <span className="text-sm font-medium">View Records</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              <CreditCard className="h-8 w-8 text-yellow-400 mb-2" />
              <span className="text-sm font-medium">Pay Bill</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              <Phone className="h-8 w-8 text-purple-400 mb-2" />
              <span className="text-sm font-medium">Contact Office</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
