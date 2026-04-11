import { Suspense } from "react";
import SetupClientPage from "./SetupClientPage";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SetupClientPage />
    </Suspense>
  );
}
