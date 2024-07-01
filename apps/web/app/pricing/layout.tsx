export default function SubscriptionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex w-full items-center justify-center">
      {children}
    </section>
  );
}
