import { CopyEmail } from "@/features/copy-email";
import { socialLinks } from "@/shared/config/contacts";

const footerLinkClass =
  "shrink-0 cursor-pointer whitespace-nowrap border-b-[0.6px] border-border-strong pb-px text-xs text-secondary transition-colors duration-100 hover:text-primary";

export function Footer() {
  return (
    <footer className="mt-auto flex flex-nowrap items-end justify-end gap-6 pt-10 pb-8 max-lg:pb-0">
      <CopyEmail className={footerLinkClass} />
      {socialLinks.map((link) => (
        <a className={footerLinkClass} key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>
      ))}
    </footer>
  );
}
