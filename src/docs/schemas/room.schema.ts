export const roomSchemas = {
  RoomType: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      name: { type: 'string', example: 'Deluxe' },
      description: { type: 'string', example: 'Phòng cao cấp view đẹp' },
      capacity: { type: 'integer', example: 2 },
      amenities: { type: 'string', example: '["WiFi","TV","AC"]' },
    },
  },
  Room: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      roomNumber: { type: 'string', example: '101' },
      price: { type: 'string', example: '500000' },
      status: {
        type: 'string',
        enum: ['AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'CLEANING'],
      },
      floor: { type: 'integer', example: 1 },
      roomType: { $ref: '#/components/schemas/RoomType' },
    },
  },
  CreateRoomRequest: {
    type: 'object',
    required: ['roomNumber', 'roomTypeId', 'price'],
    properties: {
      roomNumber: { type: 'string', example: '101' },
      roomTypeId: { type: 'integer', example: 1 },
      price: { type: 'number', example: 500000 },
      floor: { type: 'integer', example: 1 },
      description: { type: 'string', example: 'Phòng view sân vườn' },
    },
  },
  UpdateRoomStatusRequest: {
    type: 'object',
    required: ['status'],
    properties: {
      status: {
        type: 'string',
        enum: ['AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'CLEANING'],
      },
    },
  },
};