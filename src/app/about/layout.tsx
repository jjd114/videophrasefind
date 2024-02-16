export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex size-full justify-center p-5">{children}</section>
  );
}
