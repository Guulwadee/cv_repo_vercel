import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export function getS3() {
  if (!process.env.S3_ENDPOINT || !process.env.S3_ACCESS_KEY_ID || !process.env.S3_SECRET_ACCESS_KEY || !process.env.S3_BUCKET) {
    return null;
  }
  return new S3Client({
    region: process.env.S3_REGION || 'auto',
    endpoint: process.env.S3_ENDPOINT,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!
    },
    forcePathStyle: true
  });
}

export async function uploadAsset(key: string, data: Buffer, contentType: string) {
  const s3 = getS3();
  if (!s3) return null;
  await s3.send(new PutObjectCommand({
    Bucket: process.env.S3_BUCKET!,
    Key: key,
    Body: data,
    ContentType: contentType,
    ACL: 'public-read'
  }));
  const url = `${process.env.S3_ENDPOINT!.replace(/\/+$/, '')}/${process.env.S3_BUCKET}/${key}`;
  return url;
}
