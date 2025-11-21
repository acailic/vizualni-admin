type EmailRecipients = {
  to: string;
  bcc?: string;
};

export const createMailtoLink = <T extends Record<string, string>>(
  lang: keyof T,
  {
    recipients,
    template: _template,
    subject,
  }: {
    recipients: EmailRecipients;
    template: T;
    subject: string;
  }
) => {
  const template = _template[lang];

  return `mailto:${recipients.to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    template
  )}${recipients.bcc ? `&bcc=${recipients.bcc}` : ""}`;
};
