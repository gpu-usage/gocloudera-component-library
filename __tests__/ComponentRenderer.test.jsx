import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  ComponentRenderer,
  registerComponent,
  getRegisteredComponents,
} from '../src/renderer/ComponentRenderer';

const StubSection = ({ headline }) => (
  <div data-testid="stub">{headline}</div>
);

describe('ComponentRenderer', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns null when component is missing', () => {
    const { container } = render(<ComponentRenderer component={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders fallback for unknown __component', () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <ComponentRenderer
        component={{ __component: 'sections.unknown-type', id: 1 }}
      />
    );
    expect(screen.getByText(/Unknown component:/)).toBeInTheDocument();
    expect(console.warn).toHaveBeenCalled();
  });

  it('renders registered Strapi section with data attributes', () => {
    render(
      <ComponentRenderer
        component={{
          __component: 'sections.hero',
          id: 42,
          title: 'Welcome',
        }}
      />
    );
    const wrapper = document.querySelector('[data-component-id="42"]');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveAttribute('data-component-type', 'sections.hero');
    expect(screen.getByText('Welcome')).toBeInTheDocument();
  });

  it('uses componentOverrides before registry', () => {
    render(
      <ComponentRenderer
        component={{
          __component: 'sections.hero',
          id: 1,
          headline: 'Override wins',
        }}
        componentOverrides={{ 'sections.hero': StubSection }}
      />
    );
    expect(screen.getByTestId('stub')).toHaveTextContent('Override wins');
  });

  it('registerComponent adds to registry for subsequent renders', () => {
    registerComponent('__jest.widget', StubSection);
    const registry = getRegisteredComponents();
    expect(registry['__jest.widget']).toBe(StubSection);

    render(
      <ComponentRenderer
        component={{
          __component: '__jest.widget',
          id: 99,
          headline: 'Registered',
        }}
      />
    );
    expect(screen.getByTestId('stub')).toHaveTextContent('Registered');
  });
});
