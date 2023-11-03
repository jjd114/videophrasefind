import Image from 'next/image';
import Sidebar from './components/Sidebar';
import Content from './components/Content';

export default function Home() {
  return (
    <main className="bg-[#161E2A] h-screen flex justify-between">
      <Sidebar />
      <Content />
    </main>
  )
}
