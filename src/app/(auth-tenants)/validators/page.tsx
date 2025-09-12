export default function ValidatorsDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-orange-800 mb-2">
              Validators Portal
            </h1>
            <p className="text-orange-600 text-lg">
              Data Validation & Quality Control
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card rounded-lg shadow-md p-6 border-l-4 border-orange-500">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Validation Rules
              </h3>
              <p className="text-muted-foreground">
                Configure data validation rules
              </p>
            </div>

            <div className="bg-card rounded-lg shadow-md p-6 border-l-4 border-orange-500">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Quality Reports
              </h3>
              <p className="text-muted-foreground">
                Review data quality metrics
              </p>
            </div>

            <div className="bg-card rounded-lg shadow-md p-6 border-l-4 border-orange-500">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Error Logs
              </h3>
              <p className="text-muted-foreground">
                Monitor validation errors
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
