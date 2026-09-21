export const API_BASE_URL = 'https://localhost:7100/api';

export const API_ENDPOINTS = {
  applications: {
    getAll: '/applications',
    getActive: '/applications/active',
    getById: '/applications/{id}',
    create: '/applications',
    update: '/applications/{id}',
    delete: '/applications/{id}',
    toggleStatus: '/applications/{id}/toggle-status'
  },
  processDefinitions: {
    getAll: '/processDefinitions',
    getActive: '/processDefinitions/active',
    getById: '/processDefinitions/{id}',
    create: '/processDefinitions',
    update: '/processDefinitions/{id}',
    delete: '/processDefinitions/{id}',
    toggleStatus: '/processDefinitions/{id}/toggle-status'
  },
  processRecords: {
    getByProcess: '/processes/{processId}/records',
    getById: '/processes/{processId}/records/{recordId}',
    create: '/processes/{processId}/records',
    update: '/processes/{processId}/records/{recordId}',
    delete: '/processes/{processId}/records/{recordId}',
    submit: '/processes/{processId}/records/{recordId}/submit',
    search: '/processes/{processId}/records/search',
    getPriorities: '/processes/{processId}/records/priorities'
  },
  processes: {
    getDefinition: '/processes/{processId}'
  },
  processFields: {
    base: '/process-fields',
    getById: '/process-fields/{id}',
    getByProcessDefinition: '/process-fields/process/{processDefinitionId}',
    toggleStatus: '/process-fields/{id}/toggle-status'
  }
};
