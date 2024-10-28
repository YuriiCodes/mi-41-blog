import { EditorWYSIWYF } from "~/components/editor";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

export default async function Write() {
  const user = await currentUser()
  return (
    <>
      <h1 className="mb-8 text-3xl font-bold">Write</h1>
      {user?.id && <SignedIn>
          <EditorWYSIWYF userId={user?.id} />
        </SignedIn>
      }
      <SignedOut>
        <p>You have to be signed in to write.</p>
        <SignInButton />
      </SignedOut>
    </>
  );
}
