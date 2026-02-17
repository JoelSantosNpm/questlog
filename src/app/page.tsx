import { Portal } from "./components/Portal";

export default function Home() {
  return (
    <main className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-zinc-950">
      <Portal mode="existing" campaignName="Mi Campaña" />
    </main>
  );
}
