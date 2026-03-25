import { ComponentRenderer } from './ComponentRenderer';

export default {
  title: 'Renderer/ComponentRenderer',
  component: ComponentRenderer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export const HeroSection = {
  args: {
    component: {
      id: 1,
      __component: 'sections.hero',
      title: 'Rendered via registry',
      subtitle: 'Strapi-shaped props passed through.',
      alignment: 'center',
      height: 'small',
      overlay: true,
    },
  },
};

export const UnknownSection = {
  args: {
    component: {
      id: 99,
      __component: 'sections.non-existent',
    },
  },
};
