export const envSchema = {
  type: 'object',
  required: ['NODE_ENV', 'LOG_LEVEL'],
  properties: {
    NODE_ENV: { type: 'string', default: 'development' },
    LOG_LEVEL: { type: 'string', default: 'info' },
  },
};
