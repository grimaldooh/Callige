import React from 'react';

const CameraFeed = () => {
  return (
    <div>
      <h2>Camera Feed</h2>
      {/* Utilizamos un elemento <img> para cargar el video en vivo */}
      <img
        src="http://127.0.0.1:8080/video_feed"
        alt="Camera Feed"
        style={{ width: '100%', height: 'auto' }}
      />
    </div>
  );
};

export default CameraFeed;