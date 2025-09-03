export default function IntegratorDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-green-800 mb-2">
              Integrator Portal
            </h1>
            <p className="text-green-600 text-lg">
              Integration Management Dashboard
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                API Integrations
              </h3>
              <p className="text-gray-600">
                Manage and monitor API connections
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Data Sync
              </h3>
              <p className="text-gray-600">
                Monitor data synchronization status
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Webhooks
              </h3>
              <p className="text-gray-600">
                Configure webhook endpoints
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
