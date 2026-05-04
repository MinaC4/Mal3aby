export interface Pitch {
  _id: string;
  name: string;
  description: string;
  images: string[];
  pricePerHour: number;
  location: string;
  amenities: string[];
  rating: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  _id: string;
  pitch: Pitch | string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  bookingDate: string;
  timeSlot: string;
  duration: number;
  totalPrice: number;
  paymentScreenshot?: string;
  paymentMethod: 'vodafone_cash' | 'instapay' | 'cash';
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  _id: string;
  booking: Booking | string;
  title: string;
  message: string;
  type: 'new_booking' | 'booking_confirmed' | 'booking_cancelled' | 'payment_received';
  read: boolean;
  readAt?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  totalRevenue: number;
  unreadNotifications: number;
  recentBookings: Booking[];
}
