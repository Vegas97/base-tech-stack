export default function SkydivingPortal() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-orange-800 mb-2">
              Skydiving Portal
            </h1>
            <p className="text-orange-600 text-lg">
              Experience the thrill of freefall
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card rounded-lg shadow-md p-6 border-l-4 border-orange-500">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Skydiving Gear
              </h3>
              <p className="text-muted-foreground">
                Professional parachutes and safety equipment
              </p>
            </div>

            <div className="bg-card rounded-lg shadow-md p-6 border-l-4 border-orange-500">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Jump Locations
              </h3>
              <p className="text-muted-foreground">
                Find the best drop zones near you
              </p>
            </div>

            <div className="bg-card rounded-lg shadow-md p-6 border-l-4 border-orange-500">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Training Programs
              </h3>
              <p className="text-muted-foreground">
                Learn from certified skydiving instructors
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
