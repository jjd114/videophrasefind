export default function HelpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className="flex w-full justify-center">{children}</section>;
}
