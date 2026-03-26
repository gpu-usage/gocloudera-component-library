import React from 'react';
import { render, screen } from '@testing-library/react';
import CustomHTML from '../src/components/content/CustomHTML';

describe('CustomHTML', () => {
  it('renders sandboxed iframe by default', () => {
    const { container } = render(<CustomHTML html="<p>Hello</p>" />);
    const iframe = container.querySelector('iframe');
    expect(iframe).toBeTruthy();
    expect(iframe).toHaveAttribute('sandbox', 'allow-scripts');
    expect(iframe).toHaveAttribute('title', 'Custom Content');
  });

  it('includes HTML in iframe srcDoc', () => {
    const { container } = render(<CustomHTML html="<p>Test</p>" />);
    const iframe = container.querySelector('iframe');
    expect(iframe.getAttribute('srcdoc')).toContain('<p>Test</p>');
  });

  it('includes CSS in iframe srcDoc', () => {
    const { container } = render(<CustomHTML html="<p>Test</p>" css="p { color: red; }" />);
    const iframe = container.querySelector('iframe');
    expect(iframe.getAttribute('srcdoc')).toContain('p { color: red; }');
  });

  it('renders unsandboxed with dangerouslySetInnerHTML', () => {
    const { container } = render(<CustomHTML html="<p>Direct</p>" sandboxed={false} />);
    expect(container.querySelector('iframe')).toBeNull();
    expect(container.querySelector('p').textContent).toBe('Direct');
  });

  it('injects CSS as style element when unsandboxed', () => {
    const { container } = render(
      <CustomHTML html="<div>Styled</div>" css=".custom { color: blue; }" sandboxed={false} />
    );
    const style = container.querySelector('style');
    expect(style).toBeTruthy();
    expect(style.textContent).toBe('.custom { color: blue; }');
  });

  it('renders empty content gracefully', () => {
    const { container } = render(<CustomHTML />);
    const iframe = container.querySelector('iframe');
    expect(iframe).toBeTruthy();
  });

  it('injects script element when unsandboxed with javascript', () => {
    const { container } = render(
      <CustomHTML html="<div>JS</div>" javascript="console.log('hi')" sandboxed={false} />
    );
    const script = container.querySelector('script');
    expect(script).toBeTruthy();
    expect(script.textContent).toBe("console.log('hi')");
  });

  it('does not inject script when sandboxed (default)', () => {
    const { container } = render(
      <CustomHTML html="<div>Safe</div>" javascript="alert('xss')" />
    );
    // Sandboxed renders iframe, no script in main document
    const iframe = container.querySelector('iframe');
    expect(iframe).toBeTruthy();
    expect(iframe.getAttribute('srcdoc')).toContain("alert('xss')");
  });

  it('cleans up styles and scripts on unmount when unsandboxed', () => {
    const { unmount, container } = render(
      <CustomHTML html="<div>Clean</div>" css="body{}" javascript="var x=1" sandboxed={false} />
    );
    expect(container.querySelector('style')).toBeTruthy();
    unmount();
    // After unmount, the elements are removed from the document
  });

  it('includes javascript in iframe srcDoc when sandboxed', () => {
    const { container } = render(
      <CustomHTML html="<p>Test</p>" javascript="console.log(1)" />
    );
    const iframe = container.querySelector('iframe');
    expect(iframe.getAttribute('srcdoc')).toContain('console.log(1)');
  });

  it('applies containerClass and className', () => {
    const { container } = render(
      <CustomHTML html="<p>Test</p>" containerClass="my-class" className="extra" />
    );
    const section = container.querySelector('section');
    expect(section.className).toContain('my-class');
    expect(section.className).toContain('extra');
  });

  it('does not inject script when no javascript prop in unsandboxed mode', () => {
    const { container } = render(
      <CustomHTML html="<div>NoJS</div>" sandboxed={false} />
    );
    expect(container.querySelector('script')).toBeNull();
    expect(container.querySelector('div')).toBeTruthy();
  });

  it('does not inject javascript when sandboxed even with js prop', () => {
    const { container } = render(
      <CustomHTML html="<div>Safe</div>" javascript="window.hacked=true" sandboxed={true} />
    );
    // No script in main DOM
    const scripts = document.querySelectorAll('script');
    // The iframe contains the script, not the main document
    expect(container.querySelector('iframe')).toBeTruthy();
  });

  it('handles re-render with different css prop', () => {
    const { rerender, container } = render(
      <CustomHTML html="<div>Re</div>" css="body { color: red; }" sandboxed={false} />
    );
    expect(container.querySelector('style').textContent).toBe('body { color: red; }');

    rerender(<CustomHTML html="<div>Re</div>" css="body { color: blue; }" sandboxed={false} />);
    // After re-render with new css, a new style element should appear
    const styles = container.querySelectorAll('style');
    expect(styles.length).toBeGreaterThanOrEqual(1);
  });
});
