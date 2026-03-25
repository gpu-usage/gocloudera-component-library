import ContentBlock from './ContentBlock';

export default {
  title: 'Content/ContentBlock',
  component: ContentBlock,
  tags: ['autodocs'],
};

export const WithMarkdown = {
  args: {
    title: 'Why it matters',
    content:
      'Ship insights faster with **streaming data** and open standards.\n\n- Point one\n- Point two',
    alignment: 'left',
    maxWidth: 'medium',
    padding: 'medium',
  },
};

export const NoTitle = {
  args: {
    content: 'Body copy only, no heading.',
    backgroundColor: '#f3f4f6',
  },
};
