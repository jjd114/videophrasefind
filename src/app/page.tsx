import Sidebar from "./components/Sidebar";
import Content from "./components/Content";

export default async function Home() {
  return (
    <main className="bg-[#161E2A] h-full flex justify-between pt-[10px]">
      <Sidebar />
      <Content />
    </main>
  );
}
