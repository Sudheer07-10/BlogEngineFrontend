import React from 'react';

const ReachPie = ({ views = 0, clicks = 0, size = 32 }) => {
  const total = Math.max(views, 1);
  const percentage = Math.min((clicks / total) * 100, 100);
  
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${(percentage * circumference) / 100} ${circumference}`;

  return (
    <div className="reach-pie" style={{ position: 'relative', width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        style={{ transform: 'rotate(-90deg)', borderRadius: '50%' }}
      >
        {/* Total Views (Background Circle) - Now Dark Purple/Grey */}
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="transparent"
          stroke="#2D2D2D" 
          strokeWidth="6"
        />
        {/* Clicks (Foreground Slice) - Now Vibrant Orange */}
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="transparent"
          stroke="#FF6B3F" 
          strokeWidth="6"
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.5s ease' }}
        />
      </svg>
      {/* Title tooltip */}
      <div 
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        title={`Engagement: ${percentage.toFixed(1)}% (${clicks} clicks / ${views} views)`}
      />
    </div>
  );
};

export default ReachPie;
