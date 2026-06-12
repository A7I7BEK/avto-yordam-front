export const kpiStats = {
  todayBookings: 22,
  pending: 7,
  confirmedToday: 13,
  walkIns: 2,
};

export const queueBookings = [
  {
    id: 'BK-1250',
    customerName: 'Alisher Usmanov',
    customerInitials: 'AU',
    service: 'Full diagnostics + oil change',
    vehicle: 'Chevrolet Malibu 2023',
    time: 'Today · 10:30',
    status: 'pending',
  },
  {
    id: 'BK-1249',
    customerName: 'Dilnoza Karimova',
    customerInitials: 'DK',
    service: 'Brake pad replacement',
    vehicle: 'Hyundai Sonata 2021',
    time: 'Today · 09:15',
    status: 'pending',
  },
  {
    id: 'BK-1248',
    customerName: 'Sherzod Toshmatov',
    customerInitials: 'ST',
    service: 'AC repair + filter',
    vehicle: 'Toyota Camry 2020',
    time: 'Today · 08:00',
    status: 'pending',
  },
];

export const masterSchedules = [
  {
    masterName: 'Aziz Karimov',
    masterInitials: 'AK',
    bookingCount: 5,
    bookings: [
      {
        time: '09:00',
        service: 'Oil change',
        vehicle: 'Malibu',
        status: 'confirmed',
      },
      {
        time: '10:30',
        service: 'Brake pads',
        vehicle: 'Sonata',
        status: 'in-progress',
      },
      {
        time: '14:00',
        service: 'Diagnostics',
        vehicle: 'Spark',
        status: 'confirmed',
      },
      {
        time: '15:30',
        service: 'Suspension',
        vehicle: 'Tracker',
        status: 'pending',
      },
      {
        time: '17:00',
        service: 'Tire rotation',
        vehicle: 'Cobalt',
        status: 'confirmed',
      },
    ],
  },
  {
    masterName: 'Bekzod Rakhimov',
    masterInitials: 'BR',
    bookingCount: 3,
    bookings: [
      {
        time: '09:00',
        service: 'AC repair',
        vehicle: 'Camry',
        status: 'confirmed',
      },
      {
        time: '12:00',
        service: 'Engine check',
        vehicle: 'Malibu',
        status: 'pending',
      },
      {
        time: '16:00',
        service: 'Oil change',
        vehicle: 'Nexia',
        status: 'confirmed',
      },
    ],
  },
  {
    masterName: 'Jasur Tursunov',
    masterInitials: 'JT',
    bookingCount: 4,
    bookings: [
      {
        time: '08:00',
        service: 'Diagnostics',
        vehicle: 'Spark',
        status: 'done',
      },
      {
        time: '11:00',
        service: 'Brake pads',
        vehicle: 'Lacetti',
        status: 'in-progress',
      },
      {
        time: '13:00',
        service: 'Filter change',
        vehicle: 'Tracker',
        status: 'confirmed',
      },
      {
        time: '15:00',
        service: 'Suspension',
        vehicle: 'Camry',
        status: 'pending',
      },
    ],
  },
];
