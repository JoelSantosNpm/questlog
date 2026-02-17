import { Portal } from "./components/Portal";

export default function Home() {
  return (
    <main className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-zinc-950">
      <Portal className="h-80 w-56 scale-90 md:h-96 md:w-64" />
    </main>
  );
}
