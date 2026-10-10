import VerifyEmailContent from "@/components/register/VerifyEmailContent";
import { Suspense } from "react";


export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Loading verification page...
          </p>
        </main>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}