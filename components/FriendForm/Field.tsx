import { useFriendFormContext } from './FriendFormContext';
import { FieldInputProps, FieldMetaProps, FieldHelperProps } from './types';

export const useField = (
  { name }: { name: string },
): [FieldInputProps, FieldMetaProps, FieldHelperProps] => {
  const {
    getFieldInputProps,
    getFieldMetaProps,
    getFieldHelperProps,
  } = useFriendFormContext();

  return [
    getFieldInputProps(name),
    getFieldMetaProps(name),
    getFieldHelperProps(name),
  ];
};
