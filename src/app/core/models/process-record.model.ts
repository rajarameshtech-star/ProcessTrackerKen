export interface ProcessRecord {
  id: number;
  applicationId: number;
  processDefinitionId: number;
  recordStatus: string;
  recordNumber: string;
  createdDate: string;
  modifiedDate: string;
  submittedDate: string;
  notes: string;
  applicationName?: string;
  priority?: string;
  expectedDueDate?: string;
  assignedTo?: string;
  fieldValues: { [key: string]: string };
}
