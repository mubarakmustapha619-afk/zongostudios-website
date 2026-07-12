import { representation } from "@/types/site-content";

export function ContactSection() {
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
            {rep.emails.map((email, i) => (
              <span key={email.href}>
                {i > 0 && " "}
                <a
                  href={email.href}
                  className="text-sm tracking-[2px] uppercase text-accent-gold transition-opacity hover:opacity-75"
                >
                  {email.label}
                </a>
              </span>
            ))}
          </p>
        ))}
      </div>
    </section>
  );
}
