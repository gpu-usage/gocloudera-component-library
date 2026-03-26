import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ImageGallery from '../src/components/display/ImageGallery';

const images = [
  { url: '/img1.jpg', alt: 'Image 1' },
  { url: '/img2.jpg', alt: 'Image 2' },
  { url: '/img3.jpg', alt: 'Image 3' },
];

describe('ImageGallery', () => {
  it('renders title', () => {
    render(<ImageGallery title="Gallery" images={images} />);
    expect(screen.getByText('Gallery')).toBeInTheDocument();
  });

  it('renders all images', () => {
    render(<ImageGallery images={images} />);
    expect(screen.getByAltText('Image 1')).toBeInTheDocument();
    expect(screen.getByAltText('Image 2')).toBeInTheDocument();
    expect(screen.getByAltText('Image 3')).toBeInTheDocument();
  });

  it('opens lightbox on image click', async () => {
    const user = userEvent.setup();
    render(<ImageGallery images={images} />);
    await user.click(screen.getByAltText('Image 1'));
    // Lightbox should show the image plus close/nav buttons
    const allImg1 = screen.getAllByAltText('Image 1');
    expect(allImg1.length).toBeGreaterThanOrEqual(2); // grid + lightbox
  });

  it('closes lightbox on close button click', async () => {
    const user = userEvent.setup();
    render(<ImageGallery images={images} />);
    await user.click(screen.getByAltText('Image 1'));
    // Find close button (X) - there are navigation buttons too
    const buttons = screen.getAllByRole('button');
    // Close button is the first one in the lightbox overlay
    await user.click(buttons[0]);
    // Should only have grid images now
    const allImg1 = screen.getAllByAltText('Image 1');
    expect(allImg1).toHaveLength(1);
  });

  it('navigates to next image in lightbox', async () => {
    const user = userEvent.setup();
    render(<ImageGallery images={images} />);
    await user.click(screen.getByAltText('Image 1'));
    // Find nav buttons - next is the last button
    const buttons = screen.getAllByRole('button');
    const nextButton = buttons[buttons.length - 1];
    await user.click(nextButton);
    // Should now show Image 2 in lightbox
    expect(screen.getAllByAltText('Image 2').length).toBeGreaterThanOrEqual(2);
  });

  it('navigates to previous image in lightbox', async () => {
    const user = userEvent.setup();
    render(<ImageGallery images={images} />);
    await user.click(screen.getByAltText('Image 2'));
    const buttons = screen.getAllByRole('button');
    // Prev button is the second button (after close)
    const prevButton = buttons[1];
    await user.click(prevButton);
    expect(screen.getAllByAltText('Image 1').length).toBeGreaterThanOrEqual(2);
  });

  it('does not open lightbox when enableLightbox is false', async () => {
    const user = userEvent.setup();
    render(<ImageGallery images={images} enableLightbox={false} />);
    await user.click(screen.getByAltText('Image 1'));
    // Still should only have 1 of each image (no lightbox)
    expect(screen.getAllByAltText('Image 1')).toHaveLength(1);
  });

  it('handles Strapi format images', () => {
    const strapiImages = {
      data: [
        { attributes: { url: '/strapi1.jpg', alternativeText: 'Strapi 1' } },
        { attributes: { url: '/strapi2.jpg', alternativeText: 'Strapi 2' } },
      ],
    };
    render(<ImageGallery images={strapiImages} />);
    expect(screen.getByAltText('Strapi 1')).toHaveAttribute('src', '/strapi1.jpg');
    expect(screen.getByAltText('Strapi 2')).toHaveAttribute('src', '/strapi2.jpg');
  });

  it('wraps around when navigating past the last image', async () => {
    const user = userEvent.setup();
    render(<ImageGallery images={images} />);
    // Click last image
    await user.click(screen.getByAltText('Image 3'));
    const buttons = screen.getAllByRole('button');
    const nextButton = buttons[buttons.length - 1];
    await user.click(nextButton);
    // Should wrap to Image 1
    expect(screen.getAllByAltText('Image 1').length).toBeGreaterThanOrEqual(2);
  });

  it('does not show nav buttons when single image in lightbox', async () => {
    const user = userEvent.setup();
    const singleImage = [{ url: '/single.jpg', alt: 'Solo' }];
    render(<ImageGallery images={singleImage} />);
    await user.click(screen.getByAltText('Solo'));
    // Should have close button but no prev/next
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(1); // Only close button
  });

  it('renders without title', () => {
    const { container } = render(<ImageGallery images={images} />);
    expect(container.querySelector('h2')).toBeNull();
  });

  it('handles images as string URLs', () => {
    const stringImages = ['/a.jpg', '/b.jpg'];
    const { container } = render(<ImageGallery images={stringImages} />);
    const imgs = container.querySelectorAll('img');
    expect(imgs).toHaveLength(2);
  });
});
