export const legalInfo = {
  orgType: 'mchj',
  legalEntityName: 'AutoFix MCHJ',
  stateRegNumber: '1304561789',
  taxId: '302 456 789',
  vatStatus: 'VAT registered (12%)',
  foundingDate: '12 March 2019',
  country: 'Uzbekistan',
  region: 'Tashkent city',
  city: 'Tashkent',
  postalCode: '100084',
  street: "Yunusobod district, Amir Temur ko'chasi 108, office 24",
  documents: [
    {
      id: 'doc1',
      name: 'State registration certificate',
      fileName: 'registration_certificate.pdf',
      size: '2.4 MB',
      uploadedAt: '12 Mar 2019',
      verified: true,
    },
    {
      id: 'doc2',
      name: 'Tax registration certificate (INN)',
      fileName: 'tax_registration_inn.pdf',
      size: '1.1 MB',
      uploadedAt: '12 Mar 2019',
      verified: true,
    },
    {
      id: 'doc3',
      name: 'VAT registration certificate',
      fileName: 'vat_certificate.pdf',
      size: '0.8 MB',
      uploadedAt: '15 Jun 2019',
      verified: false,
    },
    {
      id: 'doc4',
      name: 'Company charter',
      fileName: 'company_charter.pdf',
      size: '3.2 MB',
      uploadedAt: '12 Mar 2019',
      verified: true,
    },
  ],
};

export const operatingHours = {
  monday: { open: '09:00', close: '18:00', closed: false },
  tuesday: { open: '09:00', close: '18:00', closed: false },
  wednesday: { open: '09:00', close: '18:00', closed: false },
  thursday: { open: '09:00', close: '18:00', closed: false },
  friday: { open: '09:00', close: '18:00', closed: false },
  saturday: { open: '10:00', close: '15:00', closed: false },
  sunday: { open: '09:00', close: '18:00', closed: true },
};

export const photos = [
  { id: 'p1', url: '', name: 'Workshop entrance', uploadedAt: '2 months ago' },
  { id: 'p2', url: '', name: 'Reception area', uploadedAt: '2 months ago' },
  { id: 'p3', url: '', name: 'Service bay 1', uploadedAt: '1 month ago' },
  { id: 'p4', url: '', name: 'Service bay 2', uploadedAt: '1 month ago' },
  { id: 'p5', url: '', name: 'Waiting room', uploadedAt: '3 weeks ago' },
];

export const bankInfo = {
  accountHolder: '"AutoFix" Mas\'uliyati Cheklangan Jamiyati',
  bank: 'Hamkorbank — Tashkent City (Yunusobod)',
  mfo: '00832',
  inn: '307284921',
  accountNumber: '20208 000 9001 2347 8965',
  currency: 'UZS',
};

export const paymentProviders = [
  { id: 'payme', name: 'PayMe', enabled: true, fee: '2.5%', type: 'online' },
  { id: 'click', name: 'Click', enabled: true, fee: '2.0%', type: 'online' },
  { id: 'paynet', name: 'Paynet', enabled: false, fee: '3.0%', type: 'online' },
  { id: 'uzum', name: 'Uzum', enabled: false, fee: '2.0%', type: 'online' },
  { id: 'cash', name: 'Cash', enabled: true, fee: '0%', type: 'offline' },
];

export const notificationPreferences = {
  bookings: { push: true, email: true, sms: false },
  reviews: { push: true, email: true, sms: false },
  payments: { push: true, email: true, sms: true },
  reminders: { push: true, email: false, sms: true },
  marketing: { push: false, email: false, sms: false },
};

export const appearanceSettings = {
  theme: 'light',
  language: 'EN',
  fontSize: 'medium',
};

export const dangerZoneData = {
  orgName: 'AutoFix MCHJ',
  warningDays: 30,
};
