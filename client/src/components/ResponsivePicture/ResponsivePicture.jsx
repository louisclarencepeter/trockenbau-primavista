function ResponsivePicture({
  image,
  sizes,
  alt,
  className = '',
  loading = 'lazy',
  decoding = 'async',
  fetchPriority,
  ...props
}) {
  return (
    <picture>
      {image.webpSrcSet ? (
        <source
          type="image/webp"
          srcSet={image.webpSrcSet}
          sizes={sizes}
        />
      ) : null}
      <img
        src={image.src}
        srcSet={image.srcSet}
        sizes={sizes}
        alt={alt}
        width={image.width}
        height={image.height}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        className={className}
        {...props}
      />
    </picture>
  );
}

export default ResponsivePicture;
