export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex w-full items-center justify-center px-3 py-7 sm:px-7">
      {children}
    </section>
  );
}
