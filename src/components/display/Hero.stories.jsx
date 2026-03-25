import Hero from './Hero';

export default {
  title: 'Display/Hero',
  component: Hero,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export const Default = {
  args: {
    title: 'Build faster on the modern data platform',
    subtitle: 'Unified analytics, AI, and data in motion — in the cloud or hybrid.',
    alignment: 'center',
    height: 'medium',
    overlay: true,
    primaryButton: {
      text: 'Get started',
      variant: 'primary',
      type: 'link',
      url: '#',
    },
    secondaryButton: {
      text: 'Watch demo',
      variant: 'outline',
      type: 'link',
      url: '#',
    },
  },
};

export const TitleOnly = {
  args: {
    title: 'Simple headline',
    alignment: 'left',
    height: 'small',
    overlay: false,
  },
};
