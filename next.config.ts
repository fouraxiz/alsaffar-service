import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'flagcdn.com' },
      // ERP-hosted worker photos/videos arrive as signed URLs. Add your real
      // ERP host(s) here; localhost covers XAMPP dev.
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: 'alsaffar.4axizerp.com' },
      { protocol: 'https', hostname: '**.alsaffar-service.com' },
    ],
  },
};

export default withNextIntl(nextConfig);
