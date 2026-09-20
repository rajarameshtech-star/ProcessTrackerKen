export interface ProcessDefinition {
  id: number;
  code: string;
  name: string;
  description: string;
  isActive: boolean;
  createdDate: string;
  modifiedDate: string;
  fieldCount: number;
  recordCount: number;
}
