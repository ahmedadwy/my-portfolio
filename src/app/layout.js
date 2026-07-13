import "./globals.css";

export const metadata = {
  title: 'ADWY | Video Editor & Motion Designer', // اسمك أو اسم البراند
  description: 'Portfolio of a creative video editor and motion graphics designer.',
  openGraph: {
    title: 'ADWY | Creative Portfolio',
    description: 'Check out my latest video editing and motion graphics projects.',
    url: 'رابط-موقعك-هنا.vercel.app', // حط اللينك بتاعك اللي طلعته من Vercel
    siteName: 'ADWY Portfolio',
    images: [
      {
        url: 'https://drive.google.com/file/d/1OFjbFoFLACNj1B-RCiEYOzOZD5uspeIk/view?usp=sharing', // حط رابط صورة كويسة من شغلك هنا
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

