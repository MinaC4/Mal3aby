const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Pitch = require('./models/Pitch');
const Booking = require('./models/Booking');
const Notification = require('./models/Notification');

dotenv.config();

// Connect to database
connectDB();

// Sample pitches data
const pitches = [
  {
    name: 'ملعب النجوم',
    description: 'ملعب عشب صناعي عالي الجودة مع إضاءة ليد مسائية، مناسب لمباريات 5 ضد 5 أو 7 ضد 7. يحتوي على مدرجات للجماهير وموقف سيارات.',
    images: [
      'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800',
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
      'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800'
    ],
    pricePerHour: 300,
    location: 'مدينة نصر، القاهرة',
    amenities: ['عشب صناعي', 'إضاءة ليد', 'مدرجات', 'موقف سيارات', 'ماء بارد'],
    rating: 4.8,
    availability: [
      {
        day: 'Saturday',
        slots: [
          { time: '08:00 AM', available: true },
          { time: '09:00 AM', available: true },
          { time: '10:00 AM', available: true },
          { time: '11:00 AM', available: true },
          { time: '12:00 PM', available: true },
          { time: '01:00 PM', available: true },
          { time: '02:00 PM', available: true },
          { time: '03:00 PM', available: true },
          { time: '04:00 PM', available: true },
          { time: '05:00 PM', available: true },
          { time: '06:00 PM', available: true },
          { time: '07:00 PM', available: true },
          { time: '08:00 PM', available: true },
          { time: '09:00 PM', available: true },
          { time: '10:00 PM', available: true }
        ]
      },
      {
        day: 'Sunday',
        slots: [
          { time: '08:00 AM', available: true },
          { time: '09:00 AM', available: true },
          { time: '10:00 AM', available: true },
          { time: '11:00 AM', available: true },
          { time: '12:00 PM', available: true },
          { time: '01:00 PM', available: true },
          { time: '02:00 PM', available: true },
          { time: '03:00 PM', available: true },
          { time: '04:00 PM', available: true },
          { time: '05:00 PM', available: true },
          { time: '06:00 PM', available: true },
          { time: '07:00 PM', available: true },
          { time: '08:00 PM', available: true },
          { time: '09:00 PM', available: true },
          { time: '10:00 PM', available: true }
        ]
      },
      {
        day: 'Monday',
        slots: [
          { time: '08:00 AM', available: true },
          { time: '09:00 AM', available: true },
          { time: '10:00 AM', available: true },
          { time: '11:00 AM', available: true },
          { time: '12:00 PM', available: true },
          { time: '01:00 PM', available: true },
          { time: '02:00 PM', available: true },
          { time: '03:00 PM', available: true },
          { time: '04:00 PM', available: true },
          { time: '05:00 PM', available: true },
          { time: '06:00 PM', available: true },
          { time: '07:00 PM', available: true },
          { time: '08:00 PM', available: true },
          { time: '09:00 PM', available: true },
          { time: '10:00 PM', available: true }
        ]
      },
      {
        day: 'Tuesday',
        slots: [
          { time: '08:00 AM', available: true },
          { time: '09:00 AM', available: true },
          { time: '10:00 AM', available: true },
          { time: '11:00 AM', available: true },
          { time: '12:00 PM', available: true },
          { time: '01:00 PM', available: true },
          { time: '02:00 PM', available: true },
          { time: '03:00 PM', available: true },
          { time: '04:00 PM', available: true },
          { time: '05:00 PM', available: true },
          { time: '06:00 PM', available: true },
          { time: '07:00 PM', available: true },
          { time: '08:00 PM', available: true },
          { time: '09:00 PM', available: true },
          { time: '10:00 PM', available: true }
        ]
      },
      {
        day: 'Wednesday',
        slots: [
          { time: '08:00 AM', available: true },
          { time: '09:00 AM', available: true },
          { time: '10:00 AM', available: true },
          { time: '11:00 AM', available: true },
          { time: '12:00 PM', available: true },
          { time: '01:00 PM', available: true },
          { time: '02:00 PM', available: true },
          { time: '03:00 PM', available: true },
          { time: '04:00 PM', available: true },
          { time: '05:00 PM', available: true },
          { time: '06:00 PM', available: true },
          { time: '07:00 PM', available: true },
          { time: '08:00 PM', available: true },
          { time: '09:00 PM', available: true },
          { time: '10:00 PM', available: true }
        ]
      },
      {
        day: 'Thursday',
        slots: [
          { time: '08:00 AM', available: true },
          { time: '09:00 AM', available: true },
          { time: '10:00 AM', available: true },
          { time: '11:00 AM', available: true },
          { time: '12:00 PM', available: true },
          { time: '01:00 PM', available: true },
          { time: '02:00 PM', available: true },
          { time: '03:00 PM', available: true },
          { time: '04:00 PM', available: true },
          { time: '05:00 PM', available: true },
          { time: '06:00 PM', available: true },
          { time: '07:00 PM', available: true },
          { time: '08:00 PM', available: true },
          { time: '09:00 PM', available: true },
          { time: '10:00 PM', available: true }
        ]
      },
      {
        day: 'Friday',
        slots: [
          { time: '08:00 AM', available: true },
          { time: '09:00 AM', available: true },
          { time: '10:00 AM', available: true },
          { time: '11:00 AM', available: true },
          { time: '12:00 PM', available: true },
          { time: '01:00 PM', available: true },
          { time: '02:00 PM', available: true },
          { time: '03:00 PM', available: true },
          { time: '04:00 PM', available: true },
          { time: '05:00 PM', available: true },
          { time: '06:00 PM', available: true },
          { time: '07:00 PM', available: true },
          { time: '08:00 PM', available: true },
          { time: '09:00 PM', available: true },
          { time: '10:00 PM', available: true }
        ]
      }
    ]
  },
  {
    name: 'ملعب القمة',
    description: 'ملعب عشب طبيعي ممتاز مع تجهيزات احترافية، مناسب للمباريات الكبيرة والتدريبات الجماعية.',
    images: [
      'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=800',
      'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800',
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800'
    ],
    pricePerHour: 250,
    location: 'المعادي، القاهرة',
    amenities: ['عشب طبيعي', 'إضاءة', 'غرف تغيير', 'حمامات', 'كافتيريا'],
    rating: 4.5,
    availability: [
      {
        day: 'Saturday',
        slots: [
          { time: '09:00 AM', available: true },
          { time: '10:00 AM', available: true },
          { time: '11:00 AM', available: true },
          { time: '12:00 PM', available: true },
          { time: '01:00 PM', available: true },
          { time: '02:00 PM', available: true },
          { time: '03:00 PM', available: true },
          { time: '04:00 PM', available: true },
          { time: '05:00 PM', available: true },
          { time: '06:00 PM', available: true },
          { time: '07:00 PM', available: true },
          { time: '08:00 PM', available: true }
        ]
      },
      {
        day: 'Sunday',
        slots: [
          { time: '09:00 AM', available: true },
          { time: '10:00 AM', available: true },
          { time: '11:00 AM', available: true },
          { time: '12:00 PM', available: true },
          { time: '01:00 PM', available: true },
          { time: '02:00 PM', available: true },
          { time: '03:00 PM', available: true },
          { time: '04:00 PM', available: true },
          { time: '05:00 PM', available: true },
          { time: '06:00 PM', available: true },
          { time: '07:00 PM', available: true },
          { time: '08:00 PM', available: true }
        ]
      },
      {
        day: 'Monday',
        slots: [
          { time: '09:00 AM', available: true },
          { time: '10:00 AM', available: true },
          { time: '11:00 AM', available: true },
          { time: '12:00 PM', available: true },
          { time: '01:00 PM', available: true },
          { time: '02:00 PM', available: true },
          { time: '03:00 PM', available: true },
          { time: '04:00 PM', available: true },
          { time: '05:00 PM', available: true },
          { time: '06:00 PM', available: true },
          { time: '07:00 PM', available: true },
          { time: '08:00 PM', available: true }
        ]
      },
      {
        day: 'Tuesday',
        slots: [
          { time: '09:00 AM', available: true },
          { time: '10:00 AM', available: true },
          { time: '11:00 AM', available: true },
          { time: '12:00 PM', available: true },
          { time: '01:00 PM', available: true },
          { time: '02:00 PM', available: true },
          { time: '03:00 PM', available: true },
          { time: '04:00 PM', available: true },
          { time: '05:00 PM', available: true },
          { time: '06:00 PM', available: true },
          { time: '07:00 PM', available: true },
          { time: '08:00 PM', available: true }
        ]
      },
      {
        day: 'Wednesday',
        slots: [
          { time: '09:00 AM', available: true },
          { time: '10:00 AM', available: true },
          { time: '11:00 AM', available: true },
          { time: '12:00 PM', available: true },
          { time: '01:00 PM', available: true },
          { time: '02:00 PM', available: true },
          { time: '03:00 PM', available: true },
          { time: '04:00 PM', available: true },
          { time: '05:00 PM', available: true },
          { time: '06:00 PM', available: true },
          { time: '07:00 PM', available: true },
          { time: '08:00 PM', available: true }
        ]
      },
      {
        day: 'Thursday',
        slots: [
          { time: '09:00 AM', available: true },
          { time: '10:00 AM', available: true },
          { time: '11:00 AM', available: true },
          { time: '12:00 PM', available: true },
          { time: '01:00 PM', available: true },
          { time: '02:00 PM', available: true },
          { time: '03:00 PM', available: true },
          { time: '04:00 PM', available: true },
          { time: '05:00 PM', available: true },
          { time: '06:00 PM', available: true },
          { time: '07:00 PM', available: true },
          { time: '08:00 PM', available: true }
        ]
      },
      {
        day: 'Friday',
        slots: [
          { time: '09:00 AM', available: true },
          { time: '10:00 AM', available: true },
          { time: '11:00 AM', available: true },
          { time: '12:00 PM', available: true },
          { time: '01:00 PM', available: true },
          { time: '02:00 PM', available: true },
          { time: '03:00 PM', available: true },
          { time: '04:00 PM', available: true },
          { time: '05:00 PM', available: true },
          { time: '06:00 PM', available: true },
          { time: '07:00 PM', available: true },
          { time: '08:00 PM', available: true }
        ]
      }
    ]
  },
  {
    name: 'ملعب البطل',
    description: 'ملعب 5x5 مكشوف مع أرضية مطاطية عالية الجودة، مثالي للتدريبات والمباريات السريعة.',
    images: [
      'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800',
      'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800',
      'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=800'
    ],
    pricePerHour: 180,
    location: '6 أكتوبر، الجيزة',
    amenities: ['أرضية مطاطية', 'إضاءة', 'مظلة', 'مياه معدنية'],
    rating: 4.3,
    availability: [
      {
        day: 'Saturday',
        slots: [
          { time: '10:00 AM', available: true },
          { time: '11:00 AM', available: true },
          { time: '12:00 PM', available: true },
          { time: '01:00 PM', available: true },
          { time: '02:00 PM', available: true },
          { time: '03:00 PM', available: true },
          { time: '04:00 PM', available: true },
          { time: '05:00 PM', available: true },
          { time: '06:00 PM', available: true },
          { time: '07:00 PM', available: true },
          { time: '08:00 PM', available: true },
          { time: '09:00 PM', available: true }
        ]
      },
      {
        day: 'Sunday',
        slots: [
          { time: '10:00 AM', available: true },
          { time: '11:00 AM', available: true },
          { time: '12:00 PM', available: true },
          { time: '01:00 PM', available: true },
          { time: '02:00 PM', available: true },
          { time: '03:00 PM', available: true },
          { time: '04:00 PM', available: true },
          { time: '05:00 PM', available: true },
          { time: '06:00 PM', available: true },
          { time: '07:00 PM', available: true },
          { time: '08:00 PM', available: true },
          { time: '09:00 PM', available: true }
        ]
      },
      {
        day: 'Monday',
        slots: [
          { time: '10:00 AM', available: true },
          { time: '11:00 AM', available: true },
          { time: '12:00 PM', available: true },
          { time: '01:00 PM', available: true },
          { time: '02:00 PM', available: true },
          { time: '03:00 PM', available: true },
          { time: '04:00 PM', available: true },
          { time: '05:00 PM', available: true },
          { time: '06:00 PM', available: true },
          { time: '07:00 PM', available: true },
          { time: '08:00 PM', available: true },
          { time: '09:00 PM', available: true }
        ]
      },
      {
        day: 'Tuesday',
        slots: [
          { time: '10:00 AM', available: true },
          { time: '11:00 AM', available: true },
          { time: '12:00 PM', available: true },
          { time: '01:00 PM', available: true },
          { time: '02:00 PM', available: true },
          { time: '03:00 PM', available: true },
          { time: '04:00 PM', available: true },
          { time: '05:00 PM', available: true },
          { time: '06:00 PM', available: true },
          { time: '07:00 PM', available: true },
          { time: '08:00 PM', available: true },
          { time: '09:00 PM', available: true }
        ]
      },
      {
        day: 'Wednesday',
        slots: [
          { time: '10:00 AM', available: true },
          { time: '11:00 AM', available: true },
          { time: '12:00 PM', available: true },
          { time: '01:00 PM', available: true },
          { time: '02:00 PM', available: true },
          { time: '03:00 PM', available: true },
          { time: '04:00 PM', available: true },
          { time: '05:00 PM', available: true },
          { time: '06:00 PM', available: true },
          { time: '07:00 PM', available: true },
          { time: '08:00 PM', available: true },
          { time: '09:00 PM', available: true }
        ]
      },
      {
        day: 'Thursday',
        slots: [
          { time: '10:00 AM', available: true },
          { time: '11:00 AM', available: true },
          { time: '12:00 PM', available: true },
          { time: '01:00 PM', available: true },
          { time: '02:00 PM', available: true },
          { time: '03:00 PM', available: true },
          { time: '04:00 PM', available: true },
          { time: '05:00 PM', available: true },
          { time: '06:00 PM', available: true },
          { time: '07:00 PM', available: true },
          { time: '08:00 PM', available: true },
          { time: '09:00 PM', available: true }
        ]
      },
      {
        day: 'Friday',
        slots: [
          { time: '10:00 AM', available: true },
          { time: '11:00 AM', available: true },
          { time: '12:00 PM', available: true },
          { time: '01:00 PM', available: true },
          { time: '02:00 PM', available: true },
          { time: '03:00 PM', available: true },
          { time: '04:00 PM', available: true },
          { time: '05:00 PM', available: true },
          { time: '06:00 PM', available: true },
          { time: '07:00 PM', available: true },
          { time: '08:00 PM', available: true },
          { time: '09:00 PM', available: true }
        ]
      }
    ]
  },
  {
    name: 'ملعب الذهبية',
    description: 'ملعب عشب صناعي فاخر مع تجهيزات احترافية كاملة، مناسب للبطولات والمباريات الرسمية.',
    images: [
      'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800',
      'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800',
      'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800'
    ],
    pricePerHour: 400,
    location: 'التجمع الخامس، القاهرة الجديدة',
    amenities: ['عشب صناعي فاخر', 'إضاءة LED', 'كاميرات', 'غرف تغيير فاخرة', 'مقهى', 'موقف مخصص'],
    rating: 4.9,
    availability: [
      {
        day: 'Saturday',
        slots: [
          { time: '07:00 AM', available: true },
          { time: '08:00 AM', available: true },
          { time: '09:00 AM', available: true },
          { time: '10:00 AM', available: true },
          { time: '11:00 AM', available: true },
          { time: '12:00 PM', available: true },
          { time: '01:00 PM', available: true },
          { time: '02:00 PM', available: true },
          { time: '03:00 PM', available: true },
          { time: '04:00 PM', available: true },
          { time: '05:00 PM', available: true },
          { time: '06:00 PM', available: true },
          { time: '07:00 PM', available: true },
          { time: '08:00 PM', available: true },
          { time: '09:00 PM', available: true },
          { time: '10:00 PM', available: true },
          { time: '11:00 PM', available: true }
        ]
      },
      {
        day: 'Sunday',
        slots: [
          { time: '07:00 AM', available: true },
          { time: '08:00 AM', available: true },
          { time: '09:00 AM', available: true },
          { time: '10:00 AM', available: true },
          { time: '11:00 AM', available: true },
          { time: '12:00 PM', available: true },
          { time: '01:00 PM', available: true },
          { time: '02:00 PM', available: true },
          { time: '03:00 PM', available: true },
          { time: '04:00 PM', available: true },
          { time: '05:00 PM', available: true },
          { time: '06:00 PM', available: true },
          { time: '07:00 PM', available: true },
          { time: '08:00 PM', available: true },
          { time: '09:00 PM', available: true },
          { time: '10:00 PM', available: true },
          { time: '11:00 PM', available: true }
        ]
      },
      {
        day: 'Monday',
        slots: [
          { time: '07:00 AM', available: true },
          { time: '08:00 AM', available: true },
          { time: '09:00 AM', available: true },
          { time: '10:00 AM', available: true },
          { time: '11:00 AM', available: true },
          { time: '12:00 PM', available: true },
          { time: '01:00 PM', available: true },
          { time: '02:00 PM', available: true },
          { time: '03:00 PM', available: true },
          { time: '04:00 PM', available: true },
          { time: '05:00 PM', available: true },
          { time: '06:00 PM', available: true },
          { time: '07:00 PM', available: true },
          { time: '08:00 PM', available: true },
          { time: '09:00 PM', available: true },
          { time: '10:00 PM', available: true },
          { time: '11:00 PM', available: true }
        ]
      },
      {
        day: 'Tuesday',
        slots: [
          { time: '07:00 AM', available: true },
          { time: '08:00 AM', available: true },
          { time: '09:00 AM', available: true },
          { time: '10:00 AM', available: true },
          { time: '11:00 AM', available: true },
          { time: '12:00 PM', available: true },
          { time: '01:00 PM', available: true },
          { time: '02:00 PM', available: true },
          { time: '03:00 PM', available: true },
          { time: '04:00 PM', available: true },
          { time: '05:00 PM', available: true },
          { time: '06:00 PM', available: true },
          { time: '07:00 PM', available: true },
          { time: '08:00 PM', available: true },
          { time: '09:00 PM', available: true },
          { time: '10:00 PM', available: true },
          { time: '11:00 PM', available: true }
        ]
      },
      {
        day: 'Wednesday',
        slots: [
          { time: '07:00 AM', available: true },
          { time: '08:00 AM', available: true },
          { time: '09:00 AM', available: true },
          { time: '10:00 AM', available: true },
          { time: '11:00 AM', available: true },
          { time: '12:00 PM', available: true },
          { time: '01:00 PM', available: true },
          { time: '02:00 PM', available: true },
          { time: '03:00 PM', available: true },
          { time: '04:00 PM', available: true },
          { time: '05:00 PM', available: true },
          { time: '06:00 PM', available: true },
          { time: '07:00 PM', available: true },
          { time: '08:00 PM', available: true },
          { time: '09:00 PM', available: true },
          { time: '10:00 PM', available: true },
          { time: '11:00 PM', available: true }
        ]
      },
      {
        day: 'Thursday',
        slots: [
          { time: '07:00 AM', available: true },
          { time: '08:00 AM', available: true },
          { time: '09:00 AM', available: true },
          { time: '10:00 AM', available: true },
          { time: '11:00 AM', available: true },
          { time: '12:00 PM', available: true },
          { time: '01:00 PM', available: true },
          { time: '02:00 PM', available: true },
          { time: '03:00 PM', available: true },
          { time: '04:00 PM', available: true },
          { time: '05:00 PM', available: true },
          { time: '06:00 PM', available: true },
          { time: '07:00 PM', available: true },
          { time: '08:00 PM', available: true },
          { time: '09:00 PM', available: true },
          { time: '10:00 PM', available: true },
          { time: '11:00 PM', available: true }
        ]
      },
      {
        day: 'Friday',
        slots: [
          { time: '07:00 AM', available: true },
          { time: '08:00 AM', available: true },
          { time: '09:00 AM', available: true },
          { time: '10:00 AM', available: true },
          { time: '11:00 AM', available: true },
          { time: '12:00 PM', available: true },
          { time: '01:00 PM', available: true },
          { time: '02:00 PM', available: true },
          { time: '03:00 PM', available: true },
          { time: '04:00 PM', available: true },
          { time: '05:00 PM', available: true },
          { time: '06:00 PM', available: true },
          { time: '07:00 PM', available: true },
          { time: '08:00 PM', available: true },
          { time: '09:00 PM', available: true },
          { time: '10:00 PM', available: true },
          { time: '11:00 PM', available: true }
        ]
      }
    ]
  }
];

// Seed function
const seedData = async () => {
  try {
    // Clear existing data
    await Pitch.deleteMany();
    await Booking.deleteMany();
    await Notification.deleteMany();

    console.log('Previous data cleared');

    // Insert pitches
    const createdPitches = await Pitch.insertMany(pitches);
    console.log(`${createdPitches.length} pitches created`);

    // Create sample bookings
    const sampleBookings = [
      {
        pitch: createdPitches[0]._id,
        customerName: 'محمد أحمد',
        customerEmail: 'mohamed@example.com',
        customerPhone: '01234567890',
        bookingDate: new Date(Date.now() + 86400000), // Tomorrow
        timeSlot: '06:00 PM',
        duration: 2,
        totalPrice: 600,
        status: 'pending'
      },
      {
        pitch: createdPitches[1]._id,
        customerName: 'أحمد علي',
        customerEmail: 'ahmed@example.com',
        customerPhone: '01112223344',
        bookingDate: new Date(Date.now() + 172800000), // Day after tomorrow
        timeSlot: '08:00 PM',
        duration: 1,
        totalPrice: 250,
        status: 'confirmed'
      },
      {
        pitch: createdPitches[2]._id,
        customerName: 'خالد محمود',
        customerEmail: 'khaled@example.com',
        customerPhone: '01555566677',
        bookingDate: new Date(Date.now() + 259200000), // 3 days later
        timeSlot: '07:00 PM',
        duration: 2,
        totalPrice: 360,
        status: 'pending'
      }
    ];

    const createdBookings = await Booking.insertMany(sampleBookings);
    console.log(`${createdBookings.length} sample bookings created`);

    // Create notifications for bookings
    const sampleNotifications = createdBookings.map(booking => ({
      booking: booking._id,
      title: 'New Booking Received',
      message: `${booking.customerName} booked a pitch on ${booking.bookingDate.toLocaleDateString('en-GB')} at ${booking.timeSlot}`,
      type: 'new_booking',
      read: false
    }));

    await Notification.insertMany(sampleNotifications);
    console.log(`${sampleNotifications.length} notifications created`);

    console.log('\\n✅ Seed data completed successfully!');
    console.log('\\n📋 Summary:');
    console.log(`   - Pitches: ${createdPitches.length}`);
    console.log(`   - Sample Bookings: ${createdBookings.length}`);
    console.log(`   - Notifications: ${sampleNotifications.length}`);

    process.exit(0);
  } catch (error) {
    console.error(`❌ Error seeding data: ${error.message}`);
    process.exit(1);
  }
};

// Run seed
seedData();
