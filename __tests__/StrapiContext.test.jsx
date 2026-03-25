import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { StrapiProvider, useStrapi } from '../src/context/StrapiContext';

function Probe() {
  const { apiUrl, fetchFromStrapi } = useStrapi();
  const [msg, setMsg] = React.useState('idle');

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchFromStrapi('demo');
        if (!cancelled) setMsg(JSON.stringify(data));
      } catch (e) {
        if (!cancelled) setMsg(`err:${e.message}`);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [fetchFromStrapi]);

  return (
    <div>
      <span data-testid="url">{apiUrl}</span>
      <span data-testid="msg">{msg}</span>
    </div>
  );
}

describe('StrapiContext', () => {
  it('throws when useStrapi is used outside provider', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow(
      /useStrapi must be used within a StrapiProvider/
    );
    console.error.mockRestore();
  });

  it('fetches JSON and exposes apiUrl', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    });

    render(
      <StrapiProvider apiUrl="https://cms.test">
        <Probe />
      </StrapiProvider>
    );

    expect(screen.getByTestId('url')).toHaveTextContent('https://cms.test');

    await waitFor(() => {
      expect(screen.getByTestId('msg')).toHaveTextContent('{"ok":true}');
    });

    expect(global.fetch).toHaveBeenCalledWith(
      'https://cms.test/api/demo',
      expect.objectContaining({
        headers: { 'Content-Type': 'application/json' },
      })
    );
  });

  it('sends Authorization when apiToken is set', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    render(
      <StrapiProvider apiUrl="https://cms.test" apiToken="secret">
        <Probe />
      </StrapiProvider>
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    expect(global.fetch.mock.calls[0][1].headers.Authorization).toBe(
      'Bearer secret'
    );
  });
});
