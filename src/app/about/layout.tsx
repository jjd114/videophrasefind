export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex w-full items-center justify-center px-3 py-7 sm:px-7">
      <div className="flex w-full max-w-[800px] flex-col gap-7">{children}</div>
    </section>
  );
}
