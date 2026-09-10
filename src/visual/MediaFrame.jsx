const VIDEO = /\.(mp4|webm|mov)(\?|$)/i;

export function isVideoSrc(src) {
  return typeof src === "string" && VIDEO.test(src);
}

export default function MediaFrame({ src, alt = "", className = "", controls = false }) {
  if (!src) return null;

  if (isVideoSrc(src)) {
    return (
      <video
        className={className}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        controls={controls}
        preload="metadata"
      />
    );
  }

  return <img className={className} src={encodeURI(src)} alt={alt} />;
}
