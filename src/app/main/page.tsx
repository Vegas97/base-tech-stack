"use client";

import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, UserButton } from "@clerk/nextjs";
import ClerkSubsctiptionsCheck from "@/components/clerkSubscriptions/ClerkSubsctiptionsCheck";

export default function Home() {
  return (
    <>
      <Authenticated>
        <UserButton />
        <Content />
      </Authenticated>
      <Unauthenticated>
        <AnonimousContent />
      </Unauthenticated>
    </>
  );
}

function Content() {
  return (
    <>
      <div>Authenticated content</div>
      <ClerkSubsctiptionsCheck />
    </>
  );
}

function AnonimousContent() {
  return (
    <>
      <SignInButton />
      <div>Anonymous content</div>
    </>
  );
}
