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
