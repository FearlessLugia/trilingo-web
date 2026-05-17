import { ColumnStack } from "@/components/ColumnStack";
import { Sidebar } from "@/components/Sidebar";

export default function Home() {
  return (
    <main className="flex h-screen w-screen overflow-hidden bg-background">
      <Sidebar />
      <ColumnStack />
    </main>
  );
}
