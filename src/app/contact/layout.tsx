export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex w-full items-center justify-center p-3 sm:p-7">
      {children}
    </section>
  );
}
