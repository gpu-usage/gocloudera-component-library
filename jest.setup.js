require('@testing-library/jest-dom');

jest.mock('react-markdown', () => {
  const React = require('react');
  function ReactMarkdown({ children }) {
    return React.createElement(
      'div',
      { 'data-testid': 'react-markdown-stub' },
      children
    );
  }
  return ReactMarkdown;
});

jest.mock('rehype-raw', () => () => {});
