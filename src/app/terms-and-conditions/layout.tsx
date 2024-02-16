export default function TermsAndConditionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex w-full flex-col">
      <div className="flex min-h-[430px] items-center justify-center bg-[#101824]">
        <h1 className="text-3xl font-extrabold sm:text-5xl">
          Terms and conditions
        </h1>
      </div>
      <div className="flex justify-center px-6">{children}</div>
    </section>
  );
}
