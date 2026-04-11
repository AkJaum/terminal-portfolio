import { Suspense } from "react";
import TerminalClient from "./TerminalClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <TerminalClient />
    </Suspense>
  );
}
