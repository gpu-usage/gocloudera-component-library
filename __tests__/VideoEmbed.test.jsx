import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VideoEmbed from '../src/components/display/VideoEmbed';

describe('VideoEmbed', () => {
  it('renders title and description', () => {
    render(<VideoEmbed title="Demo Video" description="Watch how it works" videoUrl="https://youtube.com/watch?v=abc123" />);
    expect(screen.getByText('Demo Video')).toBeInTheDocument();
    expect(screen.getByText('Watch how it works')).toBeInTheDocument();
  });

  it('shows play button before clicking (non-autoplay)', () => {
    const { container } = render(
      <VideoEmbed videoUrl="https://youtube.com/watch?v=abc123" />
    );
    // Play button overlay should be visible
    const playOverlay = container.querySelector('[style*="cursor: pointer"]');
    expect(playOverlay).toBeTruthy();
  });

  it('shows iframe after clicking play', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <VideoEmbed videoUrl="https://youtube.com/watch?v=abc123" />
    );
    const playOverlay = container.querySelector('[style*="cursor: pointer"]');
    await user.click(playOverlay);
    const iframe = container.querySelector('iframe');
    expect(iframe).toBeTruthy();
    expect(iframe.src).toContain('youtube.com/embed/abc123');
  });

  it('parses YouTube watch URL correctly', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <VideoEmbed videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />
    );
    const playOverlay = container.querySelector('[style*="cursor: pointer"]');
    await user.click(playOverlay);
    expect(container.querySelector('iframe').src).toContain('embed/dQw4w9WgXcQ');
  });

  it('parses Vimeo URL correctly', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <VideoEmbed videoUrl="https://vimeo.com/123456789" videoType="vimeo" />
    );
    const playOverlay = container.querySelector('[style*="cursor: pointer"]');
    await user.click(playOverlay);
    expect(container.querySelector('iframe').src).toContain('player.vimeo.com/video/123456789');
  });

  it('renders video element for mp4 type', () => {
    const { container } = render(
      <VideoEmbed videoUrl="/video.mp4" videoType="mp4" />
    );
    const video = container.querySelector('video');
    expect(video).toBeTruthy();
    expect(video).toHaveAttribute('src', '/video.mp4');
    expect(video).toHaveAttribute('controls');
  });

  it('auto-shows iframe when autoplay is true', () => {
    const { container } = render(
      <VideoEmbed videoUrl="https://youtube.com/watch?v=abc123" autoplay />
    );
    const iframe = container.querySelector('iframe');
    expect(iframe).toBeTruthy();
    expect(iframe.src).toContain('autoplay=1');
  });

  it('handles embed type by using the URL directly', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <VideoEmbed videoUrl="https://custom-player.com/embed/123" videoType="embed" />
    );
    const playOverlay = container.querySelector('[style*="cursor: pointer"]');
    await user.click(playOverlay);
    expect(container.querySelector('iframe').src).toBe('https://custom-player.com/embed/123');
  });

  it('returns null embed URL when no videoUrl', () => {
    const { container } = render(<VideoEmbed />);
    // Should render play button placeholder (no iframe)
    expect(container.querySelector('iframe')).toBeNull();
  });

  it('includes loop and mute params when enabled', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <VideoEmbed videoUrl="https://youtube.com/watch?v=abc" loop muted />
    );
    const playOverlay = container.querySelector('[style*="cursor: pointer"]');
    await user.click(playOverlay);
    const iframe = container.querySelector('iframe');
    expect(iframe.src).toContain('loop=1');
    expect(iframe.src).toContain('mute=1');
  });

  it('renders poster image for mp4 video', () => {
    const { container } = render(
      <VideoEmbed videoUrl="/video.mp4" videoType="mp4" posterImage={{ url: '/poster.jpg' }} />
    );
    const video = container.querySelector('video');
    expect(video).toHaveAttribute('poster', '/poster.jpg');
  });

  it('renders youtu.be short URL format', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <VideoEmbed videoUrl="https://youtu.be/shortid123" />
    );
    const playOverlay = container.querySelector('[style*="cursor: pointer"]');
    await user.click(playOverlay);
    expect(container.querySelector('iframe').src).toContain('embed/shortid123');
  });

  it('does not render title section when no title or description', () => {
    const { container } = render(<VideoEmbed videoUrl="/test.mp4" videoType="mp4" />);
    expect(container.querySelector('h2')).toBeNull();
  });

  it('handles mp4 with autoplay, loop, muted', () => {
    const { container } = render(
      <VideoEmbed videoUrl="/video.mp4" videoType="mp4" autoplay loop muted />
    );
    const video = container.querySelector('video');
    expect(video).toHaveAttribute('loop');
  });

  it('handles default/unknown video type', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <VideoEmbed videoUrl="https://other.com/video" videoType="other" />
    );
    const playOverlay = container.querySelector('[style*="cursor: pointer"]');
    await user.click(playOverlay);
    expect(container.querySelector('iframe').src).toBe('https://other.com/video');
  });

  it('uses different aspect ratios', () => {
    const { container } = render(
      <VideoEmbed videoUrl="/v.mp4" videoType="mp4" aspectRatio="4:3" />
    );
    const wrapper = container.querySelector('[style*="padding-bottom"]');
    expect(wrapper.style.paddingBottom).toBe('75%');
  });

  it('applies poster image from Strapi format', () => {
    const { container } = render(
      <VideoEmbed
        videoUrl="/v.mp4"
        videoType="mp4"
        posterImage={{ data: { attributes: { url: '/strapi-poster.jpg' } } }}
      />
    );
    const video = container.querySelector('video');
    expect(video).toHaveAttribute('poster', '/strapi-poster.jpg');
  });
});
