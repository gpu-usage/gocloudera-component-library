import React from 'react';
import { render, screen } from '@testing-library/react';
import ContentBlock from '../src/components/content/ContentBlock';

describe('ContentBlock', () => {
  it('renders title and passes content to markdown renderer', () => {
    render(
      <ContentBlock
        title="Hello"
        content="Paragraph with **bold** text."
      />
    );
    expect(
      screen.getByRole('heading', { level: 2, name: 'Hello' })
    ).toBeInTheDocument();
    expect(screen.getByTestId('react-markdown-stub')).toHaveTextContent(
      'Paragraph with **bold** text.'
    );
  });

  it('omits heading when title is empty', () => {
    render(<ContentBlock content="Only body" />);
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.getByTestId('react-markdown-stub')).toHaveTextContent(
      'Only body'
    );
  });
});
