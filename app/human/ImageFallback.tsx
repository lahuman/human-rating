import React, { useState } from 'react';
import Image from 'next/image';

const ImageFallback = (props:any) => {
  const { src, fallbackSrc, ...others } = props;
  const [imgSrc, setImgSrc] = useState(false);
  const [oldSrc, setOldSrc] = useState(src);
  if (oldSrc !== src) {
    setImgSrc(false);
    setOldSrc(src);
  }
  return (
    <Image
      {...others}
      src={imgSrc ? fallbackSrc : src}
      onError={() => {
        setImgSrc(true);
      }}
    />
  );
};

export default ImageFallback;