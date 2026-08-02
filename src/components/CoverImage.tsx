import { webpFor } from "@/lib/covers";

interface CoverImageProps {
  src: string;
  alt: string;
  /** Above the fold covers should not be lazy loaded. */
  eager?: boolean;
  grayscale?: boolean;
}

/**
 * A post cover photo. Serves WebP where the browser supports it and falls back
 * to the JPEG, which is roughly twice the weight. Both are pre-cropped to the
 * 16:10 frame the feed uses, so nothing is letterboxed at render time.
 */
export default function CoverImage({ src, alt, eager, grayscale }: CoverImageProps) {
  const webp = webpFor(src);

  return (
    <picture>
      {webp && <source srcSet={webp} type="image/webp" />}
      <img
        src={src}
        alt={alt}
        className="block transition-all duration-500"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: grayscale ? "grayscale(100%) brightness(0.92)" : "none",
        }}
        loading={eager ? "eager" : "lazy"}
        decoding={eager ? "sync" : "async"}
      />
    </picture>
  );
}
