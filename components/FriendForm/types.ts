export interface FriendFormValues {
  [field: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface FriendFormErrors {
  [field: string]: string
}

export interface FriendFormTouched {
  [field: string]: boolean
}

export enum FieldType {
  TEXT = 'text',
}

export interface FieldProps {
  name: string
  label: string
  placeholder?: string
  required?: boolean
  readOnly?: boolean
  visible?: (values: FriendFormValues) => boolean
  validate?: (value: string) => string | void
}

export interface FieldInputProps {
  name: string
  label: string
  placeholder?: string
  readOnly: boolean
  value: any // eslint-disable-line @typescript-eslint/no-explicit-any
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void
}

export interface FieldMetaProps {
  error: string
  touched: boolean
}

export interface FieldHelperProps {
  setValue: (value: any) => void // eslint-disable-line @typescript-eslint/no-explicit-any
  setError: (error: string) => void
  setTouched: (touched: boolean) => void
}

export type FieldConfig = {
  type: FieldType | string
} & FieldProps;

export type FormFields = FieldConfig[];

export type Field = React.FC<{ name: string }>;

export interface FriendFormContextType {
  fields: FormFields
  isSubmitting: boolean
  setSubmitting: React.Dispatch<React.SetStateAction<boolean>>
  values: FriendFormValues
  errors: FriendFormErrors
  touched: FriendFormTouched
  isDirty: boolean
  setValues: React.Dispatch<React.SetStateAction<FriendFormValues>>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setFieldValue: (field: string, value: any) => void
  setFieldError: (field: string, error: string) => void
  setFieldTouched: (field: string, touched: boolean) => void
  isFieldVisible: (field: FieldConfig, values: FriendFormValues) => boolean
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
  getFieldConfig: (fieldName: string) => FieldConfig
  getFieldInputProps: (fieldName: string) => FieldInputProps
  getFieldMetaProps: (fieldName: string) => FieldMetaProps
  getFieldHelperProps: (fieldName: string) => FieldHelperProps
}

export interface FriendFormConfig {
  initialValues?: FriendFormValues
  fields: FormFields
  onSubmit: (values: FriendFormValues) => Promise<void>
}
