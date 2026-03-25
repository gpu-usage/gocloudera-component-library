import React, { useState } from 'react';
import clsx from 'clsx';
import { Play } from 'lucide-react';

/**
 * Video Embed Section Component
 */
const VideoEmbed = ({
  title,
  description,
  videoUrl,
  videoType = 'youtube',
  autoplay = false,
  loop = false,
  muted = false,
  posterImage,
  aspectRatio = '16:9',
  className = '',
}) => {
  const [showVideo, setShowVideo] = useState(autoplay);

  const aspectRatioMap = {
    '16:9': '56.25%',
    '4:3': '75%',
    '1:1': '100%',
    '21:9': '42.86%',
  };

  const posterUrl = posterImage?.data?.attributes?.url || posterImage?.url;

  /**
   * Get embed URL based on video type
   */
  const getEmbedUrl = () => {
    if (!videoUrl) return null;

    const params = new URLSearchParams();
    if (autoplay || showVideo) params.append('autoplay', '1');
    if (loop) params.append('loop', '1');
    if (muted) params.append('mute', '1');

    switch (videoType) {
      case 'youtube': {
        // Extract video ID from various YouTube URL formats
        const match = videoUrl.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/]+)/);
        const videoId = match ? match[1] : videoUrl;
        return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
      }
      case 'vimeo': {
        const match = videoUrl.match(/vimeo\.com\/(\d+)/);
        const videoId = match ? match[1] : videoUrl;
        return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
      }
      case 'embed':
        return videoUrl;
      default:
        return videoUrl;
    }
  };

  const handlePlayClick = () => {
    setShowVideo(true);
  };

  return (
    <section className={clsx('video-embed-section', className)} style={{ padding: '4rem 2rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {(title || description) && (
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            {title && <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{title}</h2>}
            {description && <p style={{ fontSize: '1.1rem', opacity: 0.8 }}>{description}</p>}
          </div>
        )}

        <div
          style={{
            position: 'relative',
            paddingBottom: aspectRatioMap[aspectRatio],
            height: 0,
            overflow: 'hidden',
            borderRadius: '12px',
            background: '#000',
          }}
        >
          {videoType === 'mp4' ? (
            <video
              src={videoUrl}
              autoPlay={autoplay}
              loop={loop}
              muted={muted}
              controls
              poster={posterUrl}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
            />
          ) : showVideo ? (
            <iframe
              src={getEmbedUrl()}
              title={title || 'Video'}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
            />
          ) : (
            <div
              onClick={handlePlayClick}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: posterUrl ? `url(${posterUrl})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.2s',
                }}
              >
                <Play size={36} fill="#4f46e5" color="#4f46e5" style={{ marginLeft: '4px' }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default VideoEmbed;

