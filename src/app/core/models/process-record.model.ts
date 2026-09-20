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
  fieldValues: { [key: string]: string };
}
