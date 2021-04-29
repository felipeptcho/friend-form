import React, { useState, useCallback } from 'react';
import { FriendFormContext } from './FriendFormContext';
import Text from './fields/Text';
import {
  FriendFormValues,
  FriendFormContextType,
  FriendFormConfig,
  FieldType,
  FriendFormErrors,
  FriendFormTouched,
  FieldConfig,
  FieldInputProps,
  FieldMetaProps,
  FieldHelperProps,
  Field,
} from './types';

const availableFields: { [field: string]: Field } = {
  [FieldType.TEXT]: Text,
};

export const useFriendForm = (
  { initialValues = {}, fields, onSubmit }: FriendFormConfig,
): FriendFormContextType => {
  const [values, setValues] = useState<FriendFormValues>(initialValues);
  const [isDirty, setDirty] = useState<boolean>(false);
  const [errors, setErrors] = useState<FriendFormErrors>({});
  const [touched, setTouched] = useState<FriendFormTouched>({});
  const [isSubmitting, setSubmitting] = useState<boolean>(false);

  const isFieldVisible = useCallback(
    (field: FieldConfig, receivedValues: FriendFormValues) => {
      if (!field.visible) {
        return true;
      }

      return field.visible(receivedValues);
    },
    [],
  );

  const validateField = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (field: FieldConfig, value: any, receivedValues: FriendFormValues) => {
      if (!isFieldVisible(field, receivedValues)) {
        return;
      }

      if (field.required && (
        typeof value === 'undefined' || (
          typeof value === 'string' && !value
        )
      )) {
        return 'Required';
      }

      return field.validate?.(value);
    },
    [isFieldVisible],
  );

  const validateFields = useCallback(async (receivedValues: FriendFormValues) => {
    const promises = fields.map(
      (field) => validateField(field, receivedValues[field.name], receivedValues),
    );
    const results = await Promise.all(promises);

    const newErrors: FriendFormErrors = {};

    return results.reduce((acc, result, index) => {
      if (result) {
        acc[fields[index].name] = result;
      }

      return acc;
    }, newErrors);
  }, [fields, validateField]);

  const validate = useCallback(async (receivedValues: FriendFormValues) => {
    const [fieldErrors/* , formErrors */] = await Promise.all([
      validateFields(receivedValues),
      // validateForm(receivedValues)
    ]);

    setErrors(fieldErrors);

    return fieldErrors;
  }, [validateFields]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setFieldValue = useCallback((fieldName: string, value: any) => {
    setDirty(true);
    const newValues = {
      ...values,
      [fieldName]: value,
    };
    setValues(newValues);
    validate(newValues);
  }, [values, validate]);

  const setFieldError = useCallback((fieldName: string, error: string) => {
    setErrors({
      ...errors,
      [fieldName]: error,
    });
  }, [errors]);

  const setFieldTouched = useCallback((fieldName: string, t: boolean) => {
    setTouched({
      ...touched,
      [fieldName]: t,
    });
  }, [touched]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFieldValue(name, value);
  }, [setFieldValue]);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;

    setFieldTouched(name, true);
  }, [setFieldTouched]);

  const getFieldConfig = useCallback((fieldName: string) => {
    const fieldConfig = fields.find((f) => f.name === fieldName);

    if (!fieldConfig) {
      throw new Error(`Field config for name "${fieldName}" not found.`);
    }

    return fieldConfig;
  }, [fields]);

  const getFieldInputProps = useCallback((fieldName: string): FieldInputProps => {
    const fieldConfig = getFieldConfig(fieldName);

    return {
      name: fieldConfig.name,
      label: fieldConfig.label,
      placeholder: fieldConfig.placeholder,
      value: values[fieldConfig.name],
      readOnly: !!fieldConfig.readOnly,
      onChange: handleChange,
      onBlur: handleBlur,
    };
  }, [getFieldConfig, values, handleChange, handleBlur]);

  const getFieldMetaProps = useCallback((fieldName: string): FieldMetaProps => ({
    error: errors[fieldName],
    touched: touched[fieldName],
  }), [errors, touched]);

  const getFieldHelperProps = useCallback((fieldName: string): FieldHelperProps => ({
    setValue: (value) => setFieldValue(fieldName, value),
    setError: (error) => setFieldError(fieldName, error),
    setTouched: (t) => setFieldTouched(fieldName, t),
  }), [setFieldValue, setFieldError, setFieldTouched]);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setTouched(fields.reduce((acc, field) => {
      acc[field.name] = true;
      return acc;
    }, { ...touched }));

    try {
      const fieldErrors = await validate(values);
      const isValid = Object.keys(fieldErrors).length === 0;

      if (!isValid) {
        return;
      }

      await onSubmit(values);
    } finally {
      setSubmitting(false);
    }
  }, [fields, values, touched, onSubmit, validate]);

  return {
    fields,
    isSubmitting,
    setSubmitting,
    values,
    errors,
    touched,
    isDirty,
    setValues,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    isFieldVisible,
    handleChange,
    handleBlur,
    handleSubmit,
    getFieldConfig,
    getFieldInputProps,
    getFieldMetaProps,
    getFieldHelperProps,
  };
};

interface Props extends FriendFormConfig {
  submitButtonText?: string
  customFields?: { [name: string]: Field }
}

export const FriendForm: React.FC<Props> = ({
  initialValues = {},
  fields,
  customFields = {},
  submitButtonText = 'Submit',
  onSubmit,
}) => {
  const friendForm = useFriendForm({ initialValues, fields, onSubmit });
  const {
    handleSubmit, isSubmitting, values, isFieldVisible, isDirty,
  } = friendForm;

  const renderFields = () => fields.map((field) => {
    if (!isFieldVisible(field, values)) {
      return;
    }

    const FieldComponent = customFields[field.type] || availableFields[field.type];

    return <FieldComponent key={field.name} name={field.name} />;
  }).filter((c) => !!c);

  return (
    <FriendFormContext.Provider value={friendForm}>
      <form onSubmit={handleSubmit}>
        {renderFields()}
        <button type="submit" disabled={isSubmitting || !isDirty}>{submitButtonText}</button>
      </form>
    </FriendFormContext.Provider>
  );
};
