"use client";

import { useAuth } from "@clerk/nextjs";

export default function ClerkSubsctiptionsCheck() {
  const { has } = useAuth();

  const hasPlanEnterpriseAccess = has?.({ plan: "enterprise" });
  const hasPlanFreeAccess = has?.({ plan: "free-user" });

  const hasFeatureBase = has?.({ feature: "base" });
  const hasFeatureFunctionalityOne = has?.({ feature: "functionality_one" });

  return (
    <>
      <div>Enterprise access: {hasPlanEnterpriseAccess?.toString()}</div>
      <div>Free access: {hasPlanFreeAccess?.toString()}</div>
      <div>Base feature access: {hasFeatureBase?.toString()}</div>
      <div>Functionality one access: {hasFeatureFunctionalityOne?.toString()}</div>
    </>
  );
}
