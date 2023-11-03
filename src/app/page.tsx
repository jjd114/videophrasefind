import Image from 'next/image';
import Sidebar from './components/Sidebar';
import Content from './components/Content';

export default function Home() {
  return (
    <main className="bg-[#161E2A] h-238 flex justify-between">
      <Sidebar />
      <Content />
    </main>
  )
}
