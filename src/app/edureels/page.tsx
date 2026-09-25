import { Suspense } from "react";
import EduReelsClient from "./EduReelsClient";

export const dynamic = "force-dynamic";

export default function EduReelsPage() {
  return <Suspense fallback={<div className="grid min-h-dvh place-items-center bg-[#08080C] text-white">Opening EduReels...</div>}>
    <EduReelsClient />
  </Suspense>;
}
