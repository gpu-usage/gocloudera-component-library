import { useState } from 'react';
import Checkbox from './Checkbox';

export default {
  title: 'Forms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
};

function StatefulCheckbox(args) {
  const [value, setValue] = useState(args.value ?? false);
  return (
    <Checkbox
      {...args}
      value={value}
      onChange={(v) => {
        setValue(v);
        args.onChange?.(v);
      }}
    />
  );
}

export const Default = {
  render: (args) => <StatefulCheckbox {...args} />,
  args: {
    name: 'terms',
    label: 'I agree to the terms',
    helpText: 'You must accept to continue.',
  },
};

export const WithError = {
  render: (args) => <StatefulCheckbox {...args} />,
  args: {
    name: 'marketing',
    label: 'Subscribe to updates',
    value: false,
    error: 'This field is required',
  },
};
