const { bundle } = require("@remotion/bundler");
const { renderMedia, selectComposition } = require("@remotion/renderer");
const path = require("path");
const fs = require("fs");

async function main() {
  const args = process.argv.slice(2);
  const inputPropsPath = args[0];
  const outputMp4Path = args[1];

  if (!inputPropsPath || !outputMp4Path) {
    console.error("Usage: node render-remotion.js <inputPropsPath> <outputMp4Path>");
    process.exit(1);
  }

  const rawProps = fs.readFileSync(inputPropsPath, "utf-8");
  const inputProps = JSON.parse(rawProps);

  const entryPoint = path.resolve(__dirname, "../remotion/index.ts");
  console.log("Bundling Remotion entrypoint:", entryPoint);

  const bundleLocation = await bundle({
    entryPoint,
    webpackOverride: (config) => config,
  });

  const durationInSeconds = Math.max(10, inputProps.durationInSeconds || 40);
  const durationInFrames = Math.ceil(durationInSeconds * (inputProps.fps || 30));

  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: "FacelessVideoReel",
    inputProps,
  });

  console.log("Selected composition:", composition.id, "rendering to:", outputMp4Path);

  await renderMedia({
    composition: {
      ...composition,
      durationInFrames,
    },
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation: path.resolve(outputMp4Path),
    inputProps,
    concurrency: null, // Utilize optimal CPU cores
  });

  console.log("RENDER_COMPLETED_SUCCESSFULLY");
}

main().catch((err) => {
  console.error("RENDER_FAILED:", err);
  process.exit(1);
});
