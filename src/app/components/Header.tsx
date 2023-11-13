import Link from "next/link";

const Header = () => {
  return (
    <header>
      <nav className="px-10 py-4 bg-[#101824] min-h-[70px] flex items-center">
        <div className="container flex items-center">
          <Link href="/" className="text-white text-2xl font-semibold">
            Video PhraseFind
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
