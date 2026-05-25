// next.config.mjs
const nextConfig = {
    reactStrictMode: true,
    turbopack: {
      root: process.cwd(),
    },
    webpack(config) {
      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      });
  
      return config;
    },
  };
  
  export default nextConfig;