import { Button } from "~/components/ui/button";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export function Header() {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-2xl font-bold text-primary">
              Mi-Blog
            </Link>
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <Link
                    href="/write"
                    className="text-foreground transition-colors hover:text-primary"
                  >
                    Write
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <Button variant="ghost" size="icon">
            <SignedOut>
              <SignInButton>
                <button>
                  <LogIn className="h-[1.2rem] w-[1.2rem]" />
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </Button>
        </div>
      </div>
    </header>
  );
}
