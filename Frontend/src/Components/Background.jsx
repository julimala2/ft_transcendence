import React from 'react';
import styles from '../Styling/BackgroundSlider.module.css';

import img1 from '../Assets/background-blue.png';
// import img2 from './src/assets/bg2.jpg';
// import img3 from './src/assets/bg3.jpg';

const images = [img1];

export default function BackgroundSlider() {
  // Double the array to create a seamless infinite loop
  const duplicatedImages = [...images, ...images];

  return (
    <div className={styles.container}>
      <div className={styles.track}>
        {duplicatedImages.map((src, index) => (
          <div
            key={index}
            className={styles.slide}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
      </div>
    </div>
  );
}
