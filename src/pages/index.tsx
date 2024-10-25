// src/pages/index.tsx

import React from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import InverseFunctionCalculator from '../components/InverseFunctionCalculator';

const Home: React.FC = () => {
  return (
    <div>
      <Head>
        <title>Inverse Functions App</title>
        <meta name="description" content="An app to calculate inverse functions" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main style={{ padding: '20px' }}>
      <h1>Welcome to the Inverse Functions App</h1>
        <InverseFunctionCalculator />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
