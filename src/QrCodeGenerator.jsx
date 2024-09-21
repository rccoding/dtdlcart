import React, { useRef, useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

function ShareableLink() {
  const [url, setUrl] = useState('');
  const linkInputRef = useRef(null);

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const copyLinkToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Fallback for browsers that don't support Clipboard API
      linkInputRef.current.select();
      document.execCommand('copy');
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="shareable-link">
      <h3>Share this cart:</h3>
      <input 
        ref={linkInputRef}
        type="text" 
        value={url} 
        readOnly 
        style={{width: '100%', maxWidth: '500px'}}
      />
      <button onClick={copyLinkToClipboard}>Copy Link</button>
      
      <h3>Or scan this QR code:</h3>
      {url && <QRCodeSVG value={url} size={256} />}
    </div>
  );
}

export default ShareableLink;