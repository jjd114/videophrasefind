export default function HelpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex size-full justify-center gap-7 px-3 py-7 sm:px-7">
      <div className="flex w-full max-w-[935px] flex-col gap-7">{children}</div>
    </section>
  );
}
