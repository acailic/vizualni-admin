const bugReportSrLatn = `
Prijava greške

Opišite grešku 
Jasan i sažet opis greške. Ako se čini da je povezana sa problemom sa podacima (nedostajuće vrednosti, pogrešno parsiranje), prvo proverite skup podataka na Portalu otvorenih podataka (https://data.gov.rs) da biste videli da li je tamo sve u redu.
Molimo opišite...

----------------------------------------------
Kako reprodukovati
Koraci za reprodukovanje ponašanja:
1. Idite na '...'
2. Kliknite na '...'
3. Skrolujte do '...'
4. Vidite grešku

----------------------------------------------
Očekivano ponašanje
Jasan i sažet opis onoga što ste očekivali da se dogodi.
Molimo opišite...

----------------------------------------------
Snimci ekrana ili video
Ako je moguće, dodajte snimke ekrana ili kratak video da pomognete u stavljanju problema u kontekst.

----------------------------------------------
Okruženje
Molimo dopunite sledeće informacije.
- Vizualni Admin okruženje i verzija: [npr., v1.0.0]
- Pretraživač i verzija [npr., Chrome 107]

----------------------------------------------
Dodatni kontekst
Dodajte bilo koji dodatni kontekst o problemu ovde.
Molimo opišite...

----------------------------------------------
Kontakt informacije
Titula: 
Prezime:
Ime:
Pozicija:
Organizacija:
Email:
Broj telefona (za eventualna pitanja):
`;

const bugReportEn = `
Bug Report

Describe the bug 
A clear and concise description of what the bug is. If it seems connected to some data problem (missing values, wrong parsing), please first check the dataset on the Open Data Portal (https://data.gov.rs) to see if everything is fine there.
Please describe...

----------------------------------------------
To Reproduce
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

----------------------------------------------
Expected behavior
A clear and concise description of what you expected to happen.
Please describe...

----------------------------------------------
Screenshots or video
If applicable, add screenshots or a short video to help put your problem into context.

----------------------------------------------
Environment
Please complete the following information.
- Vizualni Admin environment and version: [e.g., v1.0.0]
- Browser and version [e.g., Chrome 107]

----------------------------------------------
Additional context
Add any other context about the problem here.
Please describe...

----------------------------------------------
Contact Information
Title: 
Last Name:
First Name:
Position:
Organization:
Email:
Phone Number (for any questions):
`;

export const bugReportTemplates = {
  "sr-Latn": bugReportSrLatn,
  "sr-Cyrl": bugReportSrLatn,
  en: bugReportEn,
};
