import Sidebar from "./components/Sidebar";
import Content from "./components/Content";

export default async function Home() {
  return (
    <main className="bg-[#161E2A] flex-1 flex justify-between pt-[10px] overflow-hidden">
      <Sidebar />
      <Content />
    </main>
  );
}
