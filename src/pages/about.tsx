// src/pages/about.tsx

import React from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

const About: React.FC = () => {
  return (
    <div>
      <Head>
        <title>About - Inverse Functions App</title>
        <meta name="description" content="Learn more about the Inverse Functions App" />
      </Head>

      <Header />

      <main style={{ padding: '20px' }}>
        <h1>About This App</h1>
        <p>
          The Inverse Functions App is designed to help students and professionals calculate inverse functions of linear equations easily.
          Simply enter a linear function in the form <code>y = mx + b</code>, and the app will provide its inverse.
        </p>
        <p>
          This tool is part of our mission to make mathematics more accessible and to provide valuable resources for learning and problem-solving.
        </p>
      </main>

      <Footer />
    </div>
  );
};

export default About;
