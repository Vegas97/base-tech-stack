export default function ScubaDivingPortal() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-blue-800 mb-2">
              Scuba Diving Portal
            </h1>
            <p className="text-blue-600 text-lg">
              Explore the underwater world
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Diving Equipment
              </h3>
              <p className="text-muted-foreground">
                Browse our premium diving gear
              </p>
            </div>

            <div className="bg-card rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Dive Locations
              </h3>
              <p className="text-muted-foreground">
                Discover amazing dive sites worldwide
              </p>
            </div>

            <div className="bg-card rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Training Courses
              </h3>
              <p className="text-muted-foreground">
                Get certified with professional instructors
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
