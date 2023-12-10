const ffmpegStatic = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath(ffmpegStatic);

const processVideo = async (inputPath, outputPath) => new Promise((resolve, reject) => {
  ffmpeg()
    .input(inputPath)
    .size('50%')
    .videoCodec('libx264')
    .addOption('-x264opts', 'keyint=24:min-keyint=24:no-scenecut')
    .outputOptions('-b:v', ['500k'])
    .format('mp4')
    .output(outputPath)
    .on('end', () => {
      resolve();
    })
    .on('error', (err) => {
      reject(err);
    })
    .run();
});

module.exports = { processVideo };
