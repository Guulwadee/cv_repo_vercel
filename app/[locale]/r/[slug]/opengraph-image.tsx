/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from '@vercel/og';
import { prisma } from '@/lib/prisma';

export const runtime = 'edge';

export default async function handler({ params }: any) {
  const slug = params.slug;
  const resume = await prisma.resume.findUnique({ where: { slug } });
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#1d4ed8'
        }}
      >
        {((resume?.title as any)?.en as string) || 'Resume'}
      </div>
    ),
    {
      width: 1200,
      height: 630
    }
  );
}
