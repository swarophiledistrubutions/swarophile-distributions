import './globals.css';

export const metadata = {
  title: 'Swarophile Distributions — Global Music Distribution',
  description:
    'More Than Distribution. We Build Artists. Distribute your music to 150+ streaming platforms with 100% royalty ownership.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
