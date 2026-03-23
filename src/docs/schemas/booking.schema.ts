export const bookingSchemas = {
  Booking: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      guestId: { type: 'integer', example: 1 },
      roomId: { type: 'integer', example: 1 },
      checkIn: { type: 'string', format: 'date-time' },
      checkOut: { type: 'string', format: 'date-time' },
      actualCheckIn: { type: 'string', format: 'date-time', nullable: true },
      actualCheckOut: { type: 'string', format: 'date-time', nullable: true },
      adults: { type: 'integer', example: 2 },
      children: { type: 'integer', example: 0 },
      totalAmount: { type: 'string', example: '2000000' },
      status: {
        type: 'string',
        enum: ['PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED'],
      },
      notes: { type: 'string', example: 'Khách yêu cầu phòng yên tĩnh' },
    },
  },
  CreateBookingRequest: {
    type: 'object',
    required: ['guestId', 'roomId', 'checkIn', 'checkOut'],
    properties: {
      guestId: { type: 'integer', example: 1 },
      roomId: { type: 'integer', example: 1 },
      checkIn: { type: 'string', format: 'date-time', example: '2026-03-21T14:00:00.000Z' },
      checkOut: { type: 'string', format: 'date-time', example: '2026-03-25T12:00:00.000Z' },
      adults: { type: 'integer', example: 2, default: 1 },
      children: { type: 'integer', example: 0, default: 0 },
      notes: { type: 'string', example: 'Khách yêu cầu phòng yên tĩnh' },
    },
  },
};