require('@testing-library/jest-dom');

global.IntersectionObserver = class {
  constructor(cb) { this._cb = cb; }
  observe() {}
  unobserve() {}
  disconnect() {}
};

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
