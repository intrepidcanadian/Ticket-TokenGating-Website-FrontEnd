import React, { useEffect, useRef } from 'react';
import './MatrixRainRender.scss';

const MatrixRain = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let requestId;

    // Set the canvas size to match the window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Function to create a new raindrop
    const createRaindrop = () => {
      return {
        x: Math.random() * canvas.width,
        y: canvas.height,
        speed: 1 + Math.random() * 3,
        character: String.fromCharCode(0x30A0 + Math.random() * 96), // Random Katakana character
        type: 'raindrop',
      };
    };

    // Function to create a new letter (including Hanzi characters)
    const createLetter = () => {
      // Define the Unicode code point ranges for characters
      const hanziStart = 0x4E00; // First Hanzi character
      const hanziEnd = 0x9FFF; // Last Hanzi character
      const englishAlphabetStart = 65; // 'A' (uppercase)
      const englishAlphabetEnd = 90; // 'Z' (uppercase)
      const numbersStart = 48; // '0'
      const numbersEnd = 57; // '9'

      // Generate a random number to determine character set (Hanzi, English, or number)
      const randomSet = Math.random();

      let randomCharCode;
      if (randomSet < 0.33) {
        // Hanzi character
        randomCharCode = Math.floor(Math.random() * (hanziEnd - hanziStart + 1)) + hanziStart;
      } else if (randomSet < 0.67) {
        // English alphabet (uppercase)
        randomCharCode = Math.floor(Math.random() * (englishAlphabetEnd - englishAlphabetStart + 1)) + englishAlphabetStart;
      } else {
        // Number
        randomCharCode = Math.floor(Math.random() * (numbersEnd - numbersStart + 1)) + numbersStart;
      }

      return {
        x: Math.random() * canvas.width,
        y: canvas.height,
        speed: 1 + Math.random() * 3,
        character: String.fromCharCode(randomCharCode),
        type: 'letter',
        lifetime: Math.floor(Math.random() * 300) + 100,
      };
    };

    // Define the arrays for raindrops and letters
    let raindrops = [];
    let letters = [];

    // Initialize some raindrops and letters
    for (let i = 0; i < 1000; i++) {
      raindrops.push(createRaindrop());
      letters.push(createLetter());
    }

    const renderFrame = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0000AA';
      ctx.font = '30px monospace';

      raindrops.forEach((drop) => {
        ctx.fillText(drop.character, drop.x, drop.y);
        drop.y -= drop.speed; // Change to negative to move upwards

        // If the raindrop goes above the canvas, reset its position below the canvas
        if (drop.y < -20) {
          drop.y = canvas.height;
          drop.x = Math.random() * canvas.width;
        }
      });

      ctx.fillStyle = '#FFFFFF'; // Change to white for letters
      ctx.font = '30px monospace';

      letters.forEach((letter) => {
        ctx.fillText(letter.character, letter.x, letter.y);
        letter.y -= letter.speed; // Change to negative to move upwards
        letter.lifetime--;

        if (letter.lifetime === 0) {
          letter.y = canvas.height;
          letter.x = Math.random() * canvas.width;
          letter.lifetime = Math.floor(Math.random() * 300) + 100;
        }
      });

      requestId = requestAnimationFrame(renderFrame);
    };

    resizeCanvas();
    renderFrame();

    // Cleanup function to cancel the animation frame on unmount
    return () => {
      cancelAnimationFrame(requestId);
    };
  }, []);

  return (
    <div className="matrix-rain-container">
      <canvas ref={canvasRef} className="matrix-rain-canvas" />
    </div>
  );
};

function MatrixRainRender() {
  return (
    <div className="MatrixRain">
      <MatrixRain />
    </div>
  );
}

export default MatrixRainRender;
