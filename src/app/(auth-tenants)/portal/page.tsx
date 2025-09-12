export default function PortalDashboard() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6">
          Portal Dashboard
        </h1>
        <div className="bg-card rounded-lg shadow p-6">
          <p className="text-muted-foreground">Welcome to a portal.</p>
          <div className="mt-4 p-4 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Middleware Test:</strong> If you can see this page at
              scubadiving.dellavega.local:3000, the subdomain routing is working
              correctly!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
