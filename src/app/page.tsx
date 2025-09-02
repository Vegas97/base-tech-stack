"use client";

import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
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
  const messages = useQuery(api.messages.getForCurrentUser);

  return (
    <>
      <div>Authenticated content: {messages?.length}</div>
      <ClerkSubsctiptionsCheck />
    </>
  );
}

function AnonimousContent() {
  return (
    <>
      <SignInButton />
      <ClerkSubsctiptionsCheck />
    </>
  );
}
