export const legalInfo = {
  orgName: 'AutoFix MCHJ',
  legalForm: 'MCHJ',
  inn: '309876543',
  regDate: '2024-03-15',
  taxRegime: 'Simplified',
  legalAddress: 'Tashkent, Yunusabad district, 12-block, 45',
  actualAddress: 'Tashkent, Yunusabad district, 12-block, 45',
  sameAsLegal: true,
  bankName: 'Ipoteka Bank',
  accountNumber: '20208000456789012345',
  mfo: '01234',
  okonkh: '95120',
  documents: [
    { name: 'registration_cert.pdf', size: '2.4 MB' },
    { name: 'tax_cert.pdf', size: '1.1 MB' },
  ],
};

export const operatingHours = {
  monday: { open: '09:00', close: '18:00', closed: false },
  tuesday: { open: '09:00', close: '18:00', closed: false },
  wednesday: { open: '09:00', close: '18:00', closed: false },
  thursday: { open: '09:00', close: '18:00', closed: false },
  friday: { open: '09:00', close: '18:00', closed: false },
  saturday: { open: '10:00', close: '15:00', closed: false },
  sunday: { open: '00:00', close: '00:00', closed: true },
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
