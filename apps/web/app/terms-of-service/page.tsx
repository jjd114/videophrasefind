import { type Metadata } from "next";
import Link from "next/link";

const Header = ({ children }: { children: React.ReactNode }) => (
  <h4 className="mb-7 text-xl">{children}</h4>
);

const Spacer = () => (
  <span aria-hidden className="my-6 min-h-[1px] min-w-[1px]" />
);

const TextBlock = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col justify-start rounded-xl border border-[#212A36] bg-[#0D131C] p-6">
    {children}
  </div>
);

const SmallText = <D extends "r" | "l" | "t" | "b" | "", S extends number>({
  margins,
  children,
}: {
  margins?:
    | `m${D}-${S}`
    | `m${D}-${S} m${D}-${S}`
    | `m${D}-${S} m${D}-${S} m${D}-${S}`
    | `m${D}-${S} m${D}-${S} m${D}-${S} m${D}-${S}`;
  children: React.ReactNode;
}) => <span className={`${margins} text-lg text-white/70`}>{children}</span>;

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "See our terms of service and how they relate to you",
};

export default function TermsOfService() {
  return (
    <div className="flex w-full max-w-[800px] flex-col rounded-[32px] bg-[#0B111A] p-8 md:p-10">
      <h1 className="mb-7 text-[26px] font-medium leading-[30px]">
        Terms of Service Agreement
      </h1>
      <SmallText margins="mb-7">
        Welcome to{" "}
        <Link className="underline" href="/">
          siftvid.io
        </Link>
        , a platform where users can upload and view videos. This Terms of
        Service Agreement governs your use of siftvid.io and any
        related services provided by siftvid.io.
      </SmallText>
      <SmallText>
        By accessing or using the siftvid.io website, you agree to be bound
        by this Agreement and our Privacy Policy. If you do not agree to abide
        by this Agreement or the Privacy Policy, please do not access or use
        siftvid.io
      </SmallText>
      <Spacer />
      <Header>1. User Content</Header>
      <TextBlock>
        <SmallText margins="mb-6">
          1.1. By uploading videos to siftvid.io, you agree that you
          have the necessary rights and permissions to do so. You retain all
          ownership rights to your videos, but you grant siftvid.io a
          non-exclusive, worldwide, royalty-free license to use and display your
          videos on the siftvid.io website.
        </SmallText>
        <SmallText>
          1.2. You understand and acknowledge that siftvid.io does not
          guarantee the accuracy, integrity, or quality of user-uploaded
          content, and you agree to use the siftvid.io at your own
          risk.
        </SmallText>
      </TextBlock>
      <Spacer />
      <Header>2. Prohibited Content</Header>
      <TextBlock>
        <SmallText margins="mb-6">
          2.1. You agree not to upload any videos that are unlawful, defamatory,
          obscene, pornographic, or otherwise objectionable.
        </SmallText>
        <SmallText margins="mb-6">
          2.2. You agree not to upload any videos that infringe upon the
          intellectual property rights of others.
        </SmallText>
        <SmallText>
          2.3. You agree not to upload any videos that contain viruses, malware,
          or other harmful content.
        </SmallText>
      </TextBlock>
      <Spacer />
      <Header>3. User Conduct</Header>
      <TextBlock>
        <SmallText margins="mb-6">
          3.1. You agree to use siftvid.io in accordance with all
          applicable laws and regulations.
        </SmallText>
        <SmallText>
          3.2. You agree not to engage in any conduct that could damage,
          disable, or impair siftvid.io or interfere with any other
          party&apos;s use of the website.
        </SmallText>
      </TextBlock>
      <Spacer />
      <Header>4. Intellectual Property</Header>
      <TextBlock>
        <SmallText>
          4.1. The siftvid.io website and all content and materials
          available on siftvid.io are protected by copyright and other
          intellectual property laws. You agree not to copy, reproduce, modify,
          or distribute any content or materials from siftvid.io
          without the prior written consent of siftvid.io.
        </SmallText>
      </TextBlock>
      <Spacer />
      <Header>5. Termination</Header>
      <TextBlock>
        <SmallText>
          5.1. siftvid.io may terminate or suspend your access to
          siftvid.io at any time, without prior notice or liability,
          for any reason whatsoever, including without limitation if you breach
          this Agreement.
        </SmallText>
      </TextBlock>
      <Spacer />
      <Header>6. Disclaimer of Warranties</Header>
      <TextBlock>
        <SmallText>
          6.1. The siftvid.io is provided &quot;as is&quot; and
          &quot;as available&quot; without any representations or warranties,
          express or implied. siftvid.io makes no representations or
          warranties in relation to siftvid.io or the information and
          materials provided on the siftvid.io website.
        </SmallText>
      </TextBlock>
      <Spacer />
      <Header>7. Limitation of Liability</Header>
      <TextBlock>
        <SmallText>
          7.1. siftvid.io will not be liable to you (whether under the
          law of contract, the law of torts, or otherwise) in relation to the
          contents of, or use of, or otherwise in connection with, the
          siftvid.io website for any indirect, special, or
          consequential loss; or for any business losses, loss of revenue,
          income, profits, or anticipated savings, loss of contracts or business
          relationships, loss of reputation or goodwill, or loss or corruption
          of information or data.
        </SmallText>
      </TextBlock>
      <Spacer />
      <Header>8. Governing Law</Header>
      <TextBlock>
        <SmallText>
          8.1. This Agreement shall be governed by and construed in accordance
          with the laws of California. You agree to submit to the exclusive
          jurisdiction of the courts located in California for the resolution of
          any disputes arising out of or relating to this Agreement.
        </SmallText>
      </TextBlock>
      <Spacer />
      <Header>9. Changes to this Agreement</Header>
      <TextBlock>
        <SmallText>
          9.1. siftvid.io reserves the right to modify or replace this
          Agreement at any time. It is your responsibility to review this
          Agreement periodically for changes. Your continued use of the
          siftvid.io website following the posting of any changes to
          this Agreement constitutes acceptance of those changes.
        </SmallText>
      </TextBlock>
      <Spacer />
      <Header>10. Contact Us</Header>
      <TextBlock>
        <SmallText>
          10.1. If you have any questions about this Agreement, please contact
          us on the contact form.
        </SmallText>
      </TextBlock>
      <Spacer />
      <SmallText>
        By accessing or using the siftvid.io, you acknowledge that you
        have read, understood, and agree to be bound by this Agreement.
      </SmallText>
    </div>
  );
}
