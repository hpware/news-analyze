import { S3Client } from "bun";

const s3config = new S3Client({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  bucket: process.env.S3_BUCKETNAME,
  acl: "public-read",
  endpoint: process.env.S3_ENDPOINT,
});

export default s3config;