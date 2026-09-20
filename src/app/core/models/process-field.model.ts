export interface ProcessField {
  id: number;
  fieldName: string;
  label: string;
  fieldType: FieldType;
  isRequired: boolean;
  sortOrder: number;
  placeholder: string;
  defaultValue: string;
  optionsJson: string;
  minLength: number;
  maxLength: number;
  min: number;
  max: number;
  pattern: string;
  isActive: boolean;
}

export enum FieldType {
  Text = 0,
  Number = 1,
  Date = 2,
  DateTime = 3,
  Dropdown = 4,
  TextArea = 5,
  Checkbox = 6,
  Email = 7,
  Url = 8,
  Phone = 9
}


// export enum FieldType {
//   Text = 'Text',
//   Number = 'Number',
//   Date = 'Date',
//   DateTime = 'DateTime',
//   Dropdown = 'Dropdown',
//   TextArea = 'TextArea',
//   Checkbox = 'Checkbox',
//   Email = 'Email',
//   Url = 'Url',
//   Phone = 'Phone'
// }