export default function TestersDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-purple-800 mb-2">
              Testers Portal
            </h1>
            <p className="text-purple-600 text-lg">
              Testing & Quality Assurance Dashboard
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card rounded-lg shadow-md p-6 border-l-4 border-purple-500">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Test Suites
              </h3>
              <p className="text-muted-foreground">
                Manage automated test suites
              </p>
            </div>

            <div className="bg-card rounded-lg shadow-md p-6 border-l-4 border-purple-500">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Test Results
              </h3>
              <p className="text-muted-foreground">
                Review test execution results
              </p>
            </div>

            <div className="bg-card rounded-lg shadow-md p-6 border-l-4 border-purple-500">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Bug Reports
              </h3>
              <p className="text-muted-foreground">
                Track and manage bug reports
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
