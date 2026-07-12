import { representation } from "@/types/site-content";

interface ContactSectionProps {
  email?: string;
  phone?: string;
}

export function ContactSection({ email, phone }: ContactSectionProps) {
  return (
    <section
      id="contact"
      className="border-t border-border px-6 py-20 text-center md:py-28"
    >
      <h2 className="text-sm font-bold tracking-[2px] uppercase text-foreground">
        Represented By
      </h2>
      <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-6 md:gap-8">
        {representation.map((rep) => (
          <p
            key={rep.href}
            className="break-words leading-loose text-muted-foreground"
          >
            {rep.flag} •{" "}
            {rep.prefix && <>{rep.prefix} | </>}
            <a
              href={rep.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm tracking-[2px] uppercase text-accent-gold transition-opacity hover:opacity-75"
            >
              {rep.name}
            </a>
            {rep.contactName && <> | {rep.contactName}</>}
            {" | "}
            {rep.emails.map((repEmail, i) => (
              <span key={repEmail.href}>
                {i > 0 && " "}
                <a
                  href={repEmail.href}
                  className="text-sm tracking-[2px] uppercase text-accent-gold transition-opacity hover:opacity-75"
                >
                  {repEmail.label}
                </a>
              </span>
            ))}
          </p>
        ))}
      </div>
      {(email || phone) && (
        <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-2">
          {email && (
            <a
              href={`mailto:${email}`}
              className="text-sm tracking-[2px] uppercase text-accent-gold transition-opacity hover:opacity-75"
            >
              {email}
            </a>
          )}
          {phone && (
            <a
              href={`tel:${phone.replace(/[^+\d]/g, "")}`}
              className="text-sm tracking-[2px] uppercase text-muted-foreground transition-opacity hover:opacity-75"
            >
              {phone}
            </a>
          )}
        </div>
      )}
    </section>
  );
}
