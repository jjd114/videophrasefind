export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="grid size-full place-items-center">{children}</section>
  );
}
