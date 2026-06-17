// Minimal type declaration for gifshot
// Full docs: https://github.com/yahoo/gifshot

declare module 'gifshot' {
  interface GifShotOptions {
    images?: string[];
    video?: string[];
    gifWidth?: number;
    gifHeight?: number;
    interval?: number;
    numFrames?: number;
    frameDuration?: number;
    sampleInterval?: number;
    numWorkers?: number;
    progressCallback?: (progress: number) => void;
  }

  interface GifShotResult {
    error: boolean;
    errorCode?: string;
    errorMsg?: string;
    image: string;  // base64 GIF data URL
  }

  function createGIF(options: GifShotOptions, callback: (result: GifShotResult) => void): void;
  function isWebCamGIFSupported(): boolean;
  function isExistingVideoGIFSupported(): boolean;
  function isExistingImagesGIFSupported(): boolean;

  const gifshot: {
    createGIF: typeof createGIF;
    isWebCamGIFSupported: typeof isWebCamGIFSupported;
    isExistingVideoGIFSupported: typeof isExistingVideoGIFSupported;
    isExistingImagesGIFSupported: typeof isExistingImagesGIFSupported;
  };

  export default gifshot;
  export { createGIF };
}
