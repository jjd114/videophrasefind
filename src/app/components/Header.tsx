import Link from "next/link";

const Header = () => {
  return (
    <header>
      <nav className="flex min-h-[70px] items-center bg-[#101824] px-10 py-4">
        <div className="container flex items-center">
          <Link href="/" className="text-2xl font-semibold text-white">
            Video PhraseFind
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
