export const createMailtoLink = (lang, { recipients, template: _template, subject, }) => {
    const template = _template[lang];
    return `mailto:${recipients.to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(template)}${recipients.bcc ? `&bcc=${recipients.bcc}` : ""}`;
};
