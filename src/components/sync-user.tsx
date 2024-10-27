"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { api } from "~/trpc/react";

export const SyncUser = () => {
  const user = useUser();
  const mutate = api.user.upsert.useMutation();

  useEffect(() => {
    if (!user.isLoaded || !user.isSignedIn) return;

    const { user: userData } = user;
    mutate.mutate({
      clerkId: userData.id,
      username: userData.username ?? `${userData.firstName} ${userData.lastName}`,
      email: userData.primaryEmailAddress?.emailAddress ?? userData.emailAddresses?.[0]?.emailAddress ?? "",
    })
  }, [user]);

  return null;
};
