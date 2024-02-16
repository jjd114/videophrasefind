export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex w-full items-start justify-center p-5">
      {children}
    </section>
  );
}
