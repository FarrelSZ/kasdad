/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return [
      // Alamat lama (situs versi 1 hanya berisi Bagian 1): /slide/19 sekarang menjadi /ka/slide/19.
      { source: '/slide/:n(\\d+)', destination: '/ka/slide/:n', permanent: true },
    ];
  },
};

export default nextConfig;
