export const reportPaths = {
  '/api/reports/dashboard': {
    get: {
      tags: ['Reports'],
      summary: 'Tổng quan hệ thống (ADMIN)',
      responses: {
        200: {
          description: 'Thành công',
          content: {
            'application/json': {
              schema: {
                properties: {
                  data: {
                    type: 'object',
                    properties: {
                      rooms: {
                        type: 'object',
                        properties: {
                          total: { type: 'integer', example: 7 },
                          available: { type: 'integer', example: 5 },
                          occupied: { type: 'integer', example: 1 },
                          maintenance: { type: 'integer', example: 1 },
                          occupancyRate: { type: 'integer', example: 14 },
                        },
                      },
                      today: {
                        type: 'object',
                        properties: {
                          newBookings: { type: 'integer', example: 2 },
                          checkIns: { type: 'integer', example: 1 },
                          checkOuts: { type: 'integer', example: 0 },
                          revenue: { type: 'number', example: 1000000 },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  '/api/reports/revenue': {
    get: {
      tags: ['Reports'],
      summary: 'Báo cáo doanh thu (ADMIN)',
      parameters: [
        {
          in: 'query',
          name: 'from',
          required: true,
          schema: { type: 'string', format: 'date-time' },
          example: '2026-03-01T00:00:00.000Z',
        },
        {
          in: 'query',
          name: 'to',
          required: true,
          schema: { type: 'string', format: 'date-time' },
          example: '2026-03-31T23:59:59.000Z',
        },
        {
          in: 'query',
          name: 'groupBy',
          schema: { type: 'string', enum: ['day', 'month'] },
          example: 'day',
        },
      ],
      responses: { 200: { description: 'Thành công' } },
    },
  },
  '/api/reports/occupancy': {
    get: {
      tags: ['Reports'],
      summary: 'Báo cáo công suất phòng (ADMIN)',
      parameters: [
        {
          in: 'query',
          name: 'from',
          required: true,
          schema: { type: 'string', format: 'date-time' },
        },
        {
          in: 'query',
          name: 'to',
          required: true,
          schema: { type: 'string', format: 'date-time' },
        },
      ],
      responses: { 200: { description: 'Thành công' } },
    },
  },
  '/api/reports/bookings': {
    get: {
      tags: ['Reports'],
      summary: 'Báo cáo booking (ADMIN)',
      parameters: [
        {
          in: 'query',
          name: 'from',
          required: true,
          schema: { type: 'string', format: 'date-time' },
        },
        {
          in: 'query',
          name: 'to',
          required: true,
          schema: { type: 'string', format: 'date-time' },
        },
      ],
      responses: { 200: { description: 'Thành công' } },
    },
  },
};