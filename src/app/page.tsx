import Image from 'next/image';
import Sidebar from './components/Sidebar';
import Content from './components/Content';

const request = async () => {
  "use server"
  const res = await fetch('https://videophrasefind.vercel.app/mock-api/transcribe?videoUrl=some_video_url&query=some_query');
  return res.json();
}

export default async function Home() {
  return (
    <main className="bg-[#161E2A] h-[951px] flex justify-between">
      <Sidebar />
      <Content request={request} />
    </main>
  )
}
