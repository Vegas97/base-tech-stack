"use client";

import { useState } from "react";
import { TENANT_CONFIG, TenantType } from "@/../convex/lib/constants";

export default function TenantNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Group tenants by type
  const standalones = Object.entries(TENANT_CONFIG).filter(
    ([_, config]) => config.type === TenantType.STANDALONE
  );
  
  const portals = Object.entries(TENANT_CONFIG).filter(
    ([_, config]) => config.type === TenantType.PORTAL
  );
  
  const publicTenants = Object.entries(TENANT_CONFIG).filter(
    ([_, config]) => config.type === TenantType.PUBLIC_STANDALONE
  );

  const createUrl = (subdomain: string) => {
    if (subdomain === "main") {
      return "https://dellavega.local:3000/";
    }
    return `https://${subdomain}.dellavega.local:3000/`;
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded-md hover:bg-gray-700 transition-colors"
        aria-label="Toggle navigation"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg border-r border-gray-200 z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } w-80`}
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Tenant Navigation</h2>
          <p className="text-sm text-gray-600 mt-1">
            Navigate between all tenant domains
          </p>
        </div>

        <div className="overflow-y-auto h-full pb-20">
          {/* Standalones */}
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Standalones
            </h3>
            <div className="space-y-2">
              {standalones.map(([tenantId, config]) => (
                <a
                  key={tenantId}
                  href={createUrl(config.subdomain)}
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div
                    className="w-3 h-3 rounded-full mr-3"
                    style={{ backgroundColor: config.primaryColor }}
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {config.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {config.subdomain}.dellavega.local
                    </div>
                  </div>
                  <svg
                    className="w-4 h-4 text-gray-400 group-hover:text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Portals */}
          <div className="p-4 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Portals
            </h3>
            <div className="space-y-2">
              {portals.map(([tenantId, config]) => (
                <a
                  key={tenantId}
                  href={createUrl(config.subdomain)}
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div
                    className="w-3 h-3 rounded-full mr-3"
                    style={{ backgroundColor: config.primaryColor }}
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {config.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {config.subdomain}.dellavega.local
                    </div>
                  </div>
                  <svg
                    className="w-4 h-4 text-gray-400 group-hover:text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Public */}
          <div className="p-4 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Public
            </h3>
            <div className="space-y-2">
              {publicTenants.map(([tenantId, config]) => (
                <a
                  key={tenantId}
                  href={createUrl(config.subdomain)}
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div
                    className="w-3 h-3 rounded-full mr-3"
                    style={{ backgroundColor: config.primaryColor }}
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {config.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {config.subdomain === "main" 
                        ? "dellavega.local" 
                        : `${config.subdomain}.dellavega.local`}
                    </div>
                  </div>
                  <svg
                    className="w-4 h-4 text-gray-400 group-hover:text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
