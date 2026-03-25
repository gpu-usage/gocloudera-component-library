import Button from './Button';

export default {
  title: 'Forms/Button',
  component: Button,
  tags: ['autodocs'],
};

export const Primary = {
  args: {
    text: 'Primary',
    variant: 'primary',
  },
};

export const Secondary = {
  args: {
    text: 'Secondary',
    variant: 'secondary',
  },
};

export const AsLink = {
  args: {
    text: 'Documentation',
    type: 'link',
    url: 'https://example.com',
    variant: 'primary',
  },
};

export const WithIcon = {
  args: {
    text: 'Next',
    icon: 'ArrowRight',
    iconPosition: 'right',
    variant: 'primary',
  },
};

export const Disabled = {
  args: {
    text: 'Disabled',
    disabled: true,
  },
};
