
import '../styles/globals.css';
import { ReactNode } from 'react';
import ClientProvider from '../components/ClientProvider';
import NavBar from '../components/NavBar';
import AISettingsManager from '../components/AISettingsManager';
import ThemeManager from '../components/ThemeManager';

export const metadata = {
  title: 'Transformation Math App',
  description: 'Interactive learning platform for mathematical transformations',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <title>Transformation Math App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Interactive learning platform for mathematical transformations" />
      </head>
      <body>
        <ClientProvider>
          <AISettingsManager />
          <ThemeManager />
          <NavBar />
          <main className="min-h-screen">
            {children}
          </main>
        </ClientProvider>
      </body>
    </html>
  );
}