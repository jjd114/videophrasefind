export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex size-full justify-center p-3 sm:p-7">
      {children}
    </section>
  );
}
