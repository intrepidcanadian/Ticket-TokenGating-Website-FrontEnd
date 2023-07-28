import React, { useEffect, useRef } from 'react';
import './ShootingStars.scss';

const ShootingStars = () => {
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

    // Function to create a new night sky element
    const createNightSkyElement = () => {
      // Define the Unicode code point ranges for characters
      const communityCharacters = ['c', 'f', 'x'];
      const circleSize = Math.floor(Math.random() * 5) + 3; // Random circle size from 3 to 7

      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 1 + Math.random() * 2, // Slower speed for falling letters
        character: communityCharacters[circleSize % 3], // Group the characters to form circles
      };
    };

    // Define the array for night sky elements
    let nightSkyElements = [];

    // Initialize some night sky elements
    for (let i = 0; i < 1000; i++) {
      nightSkyElements.push(createNightSkyElement());
    }

    const renderFrame = () => {
      ctx.fillStyle = '#000000'; // Black background
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#FFFF00'; // Yellow color for letters
      ctx.font = '30px monospace';

      nightSkyElements.forEach((element) => {
        ctx.fillText(element.character, element.x, element.y);
        element.y += element.speed; // Move the element downwards

        // If the element goes below the canvas, reset its position
        if (element.y > canvas.height) {
          element.y = Math.random() * -100; // Start from above the canvas
          element.x = Math.random() * canvas.width;
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
    <div className="stars-container">
      <canvas ref={canvasRef} className="stars-canvas" />
    </div>
  );
};

export default ShootingStars;
