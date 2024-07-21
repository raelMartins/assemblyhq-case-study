import { Poppins, Inter } from 'next/font/google';

export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal'],
  display: 'swap',
  variable: '--font_poppins'
});

export const inter = Inter({ subsets: ['latin'], variable: '--font_inter' });
