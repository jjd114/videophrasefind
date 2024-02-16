import Link from "next/link";

const tabs = ["/", "/about", "/contact"] as const;

const capitalize = (str: string) => {
  return str[0].toUpperCase() + str.slice(1);
};

const Header = () => {
  return (
    <header className="flex items-center justify-between bg-[#101824] px-10 py-4 max-[580px]:flex-col max-[580px]:gap-4 min-[580px]:min-h-[70px]">
      <Link href="/" className="text-2xl font-bold">
        VideoPhraseFind
      </Link>
      <nav>
        <ul className="flex gap-14">
          {tabs.map((tab) => (
            <Link
              className="font-medium transition-colors hover:text-neutral-300"
              key={tab}
              href={tab}
            >
              <li>{tab === "/" ? "Home" : capitalize(tab.slice(1))}</li>
            </Link>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export { Header };
