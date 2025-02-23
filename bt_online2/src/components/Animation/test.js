import React, { useEffect, useRef } from "react";

const CanvasAnimation = () => {
  const canvasRef = useRef(null);
  const progressRef = useRef(0);
  const colorIndexRef = useRef(0); 

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const colors = ["red", "blue", "#FF1493"]; 
    const duration = 10000; // 10s mỗi màu

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let startTime = null;

    const draw = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      progressRef.current = Math.min(elapsed / duration, 1);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Lấy màu hiện tại từ danh sách
      const currentColor = colors[colorIndexRef.current];

      // Gradient từ màu hiện tại sang trong suốt
      const gradient = ctx.createLinearGradient(
        100, 200,
        100 + progressRef.current * 1000, 400 + progressRef.current * 100
      );
      gradient.addColorStop(0, currentColor);
      gradient.addColorStop(1, "rgba(255, 255, 255, 0.2)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(100, 200);
      ctx.lineTo(100 + progressRef.current * 1000, 150 + progressRef.current * 100);
      ctx.lineTo(100 + progressRef.current * 1000, 250 + progressRef.current * 100);
      ctx.lineTo(100, 300);
      ctx.closePath();
      ctx.fill();

      if (progressRef.current < 1) {
        requestAnimationFrame(draw);
      } else {
        // Khi hết 10s, reset và đổi màu
        startTime = null;
        progressRef.current = 0;
        colorIndexRef.current = (colorIndexRef.current + 1) % colors.length; // Chuyển sang màu tiếp theo
        requestAnimationFrame(draw);
      }
    };

    requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ background: "black", width: "100vw", height: "100vh" }} />;
};

export default CanvasAnimation;
