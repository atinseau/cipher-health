

export const API_PREFIX = '/api/v1'


export const ENV_SCHEMA = {
  type: 'object',
  required: [
    'PORT'
  ],
  properties: {
    PORT: {
      type: 'string',
      default: '8080'
    }
  }
}