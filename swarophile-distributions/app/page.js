"use client";

import dynamic from 'next/dynamic';

// Dynamically load the main app shell with SSR disabled to prevent 
// client-side localStorage/hydration mismatches across custom dashboards
const SwarophileApp = dynamic(
  () => import('../components/SwarophileApp'),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900 text-slate-100">
      <SwarophileApp />
    </main>
  );
}