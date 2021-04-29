This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm i
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Friend Form API

You need to create a `FormFields` strucutre like this:

```javascript
import { FormFields, FieldType } from '@/components/FriendForm';

const formFields: FormFields = [
  {
    name: 'textField',
    label: 'Text field',
    placeholder: 'My placeholder',
    type: FieldType.TEXT,
    required: true,
    readOnly: false,
    visible: (values) => (values.textField !== 'go away'),
    validate: (value) => {
      if (!value.startsWith('wooga.name')) {
        return 'Not a valid name!';
      }
    },
  },
]
```

After that, you can pass this structure to the `<FriendForm />` component:

```jsx
import { FriendForm, FriendFormValues } from '@/components/FriendForm';

...

const MyPage: React.FC = () => {
  const handleSubmit = (values: FriendFormValues) => new Promise<void>((resolve) => {
    setTimeout(() => {
      alert(JSON.stringify(values, null, 2));
      resolve();
    }, 500);
  });

  return (
    <FriendForm
      fields={formFields}
      initialValues={{ textField: 'Initial value' }}
      onSubmit={handleSubmit}
    />
  );
};
```

## Custom components and Hooks

You can import the hooks available in the project to have more control. For example, if you want to use your own custom fields you can use the `useField` hook and make your component return a `Field` interface (or an interface that extends the `Field` interface):

```jsx
import { useFriendFormContext, Field, useField } from '@/components/FriendForm';

const Checkbox: Field = ({
  name,
}) => {
  const [
    { label: labelString, readOnly, value },
    { error, touched },
    { setValue },
  ] = useField({ name });
  const { handleBlur } = useFriendFormContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.checked);
  };

  return (
    <label>
      {labelString}
      <input
        type="checkbox"
        name={name}
        readOnly={readOnly}
        checked={!!value}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {touched && error && <span className="error">{error}</span>}
    </label>
  );
};
```

Then, you can pass an object containing all the custom fields of your project:

```jsx
import { FriendForm, FriendFormValues } from '@/components/FriendForm';

const formFields: FormFields = [
  {
    name: 'checkboxField',
    label: 'Custom Checkbox',
    type: 'customCheckbox', // Use the custom type that you defined below.
  },
];

const MyPage: React.FC = () => {
  const handleSubmit = (values: FriendFormValues) => {
    // submit code
  };

  return (
    <FriendForm
      fields={formFields}
      customFields={{ customCheckbox: Checkbox }} // You can have this structure in a separate file.
      onSubmit={handleSubmit}
    />
  );
};
```