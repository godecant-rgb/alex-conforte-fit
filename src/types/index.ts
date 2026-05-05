export type Activity = {
  id: string;
  name: string;
  description: string | null;
};

export type Schedule = {
  id: string;
  activity_id: string;
  day_of_week: number;
  start_time: string;
  activities?: {
    name: string;
  } | null;
};

export type BookingFormData = {
  full_name: string;
  phone: string;
  activity_id: string;
  booking_date: string;
  start_time: string;
};