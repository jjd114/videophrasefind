import Sidebar from "./components/Sidebar";
import Content from "./components/Content";

export default async function Home() {
  return (
    <main className="bg-[#161E2A] h-[951px] flex justify-between">
      <Sidebar />
      <Content />
    </main>
  );
}
