export default function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-2xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">DentalCloud Authentication Test</h1>
        
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Environment Check</h2>
            <p className="text-gray-600 mb-4">Check if all environment variables are properly configured:</p>
            <button 
              onClick={() => fetch('/api/check-env').then(r => r.json()).then(console.log)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Check Environment
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Create Sample Users</h2>
            <p className="text-gray-600 mb-4">Create sample practice and patient users for testing:</p>
            <button 
              onClick={() => fetch('/api/create-sample-users', {method: 'POST'}).then(r => r.json()).then(console.log)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Create Sample Users
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Login Pages</h2>
            <div className="space-y-2">
              <div>
                <a 
                  href="/auth/signin" 
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Practice Staff Login →
                </a>
                <p className="text-sm text-gray-500">For dentists, hygienists, staff, and administrators</p>
              </div>
              <div>
                <a 
                  href="/patient/auth/signin" 
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Patient Portal Login →
                </a>
                <p className="text-sm text-gray-500">For patients to access their health records</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Sample Login Credentials</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Practice Staff</h3>
                <div className="text-sm space-y-1">
                  <div><strong>Admin:</strong> admin@dentalcloud.com / Admin123!</div>
                  <div><strong>Doctor:</strong> doctor@dentalcloud.com / Doctor123!</div>
                  <div><strong>Hygienist:</strong> hygienist@dentalcloud.com / Hygienist123!</div>
                  <div><strong>Staff:</strong> staff@dentalcloud.com / Staff123!</div>
                  <div><strong>Receptionist:</strong> receptionist@dentalcloud.com / Reception123!</div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Patients</h3>
                <div className="text-sm space-y-1">
                  <div><strong>Patient 1:</strong> patient1@example.com / Patient123!</div>
                  <div><strong>Patient 2:</strong> patient2@example.com / Patient123!</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
