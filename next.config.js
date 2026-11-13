module.exports = {
  images: {
    // Static export: images are served from their original hosts without the Next.js optimizer.
    loader: 'custom',
    domains: ['raw.githubusercontent.com', 'cdn2.bulbagarden.net'],
  },
};
