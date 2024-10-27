"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useSessionStorage } from "usehooks-ts";

import { api } from "~/trpc/react";

const SESSION_STORAGE_IS_USER_SYNCED_KEY = "IS_USER_SYNCED";


export const SyncUser = () => {
  const user = useUser();

  const [hasSynced, setHasSynced] = useSessionStorage<boolean>(
    SESSION_STORAGE_IS_USER_SYNCED_KEY,
    false,
    {},
  );

  const mutate = api.user.upsert.useMutation({
    retry: false,
    onSuccess: () => {
      setHasSynced(true);
    },
  });

  useEffect(() => {
    if (!user.isLoaded || !user.isSignedIn || mutate.isPending || hasSynced)
      return;

    const { user: userData } = user;

    mutate.mutate({
      clerkId: userData.id,
      username:
        userData.username ?? `${userData.firstName} ${userData.lastName}`,
      email:
        userData.primaryEmailAddress?.emailAddress ??
        userData.emailAddresses?.[0]?.emailAddress ??
        "",
    });

    return () => {
      setHasSynced(true);
    };
  }, [user, mutate, hasSynced, setHasSynced]);

  return null;
};
