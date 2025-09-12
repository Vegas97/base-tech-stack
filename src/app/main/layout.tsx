export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Main Area Navigation */}
      <nav className="bg-card shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-lg font-semibold text-foreground">
                  Main Area
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Page Content */}
      <main>{children}</main>
    </div>
  );
}
