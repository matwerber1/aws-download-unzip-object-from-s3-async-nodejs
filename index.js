var AWS = require('aws-sdk');
var s3 = new AWS.S3();
var fstream = require('fstream');
var unzip = require('unzip');

async function main() {

  await downloadObject(
    'YOUR_BUCKET',
    'YOUR_ZIPPED_OBJECT'
  );
}

function downloadAndUnzipObjectFromS3(bucket, key) {
  // Based on guidance from https://github.com/aws/aws-sdk-js/issues/1436#issuecomment-290445593
  // Adapted to include an unzip step
  return new Promise((resolve, reject) => {
    const destPath = './output';
    const params = { Bucket: bucket, Key: key };
    const s3Stream = s3.getObject(params).createReadStream();
    const writeStream = fstream.Writer(destPath);
    s3Stream.on('error', reject);
    writeStream.on('error', reject);
    writeStream.on('close', () => { resolve(destPath);});
    s3Stream
      .pipe(unzip.Parse())
      .pipe(writeStream);
  });
}

(async () => {
  main();
})();
