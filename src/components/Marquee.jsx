import React from 'react';

export default function Marquee() {
  const row1Text = "SOFTWARE ENGINEER * MOBILE APPLICATION DEVELOPER * FULL STACK DEVELOPER * IT SPECIALIST * ";
  const row2Text = "LET'S WORK TOGETHER * I'M OPEN FOR NEW OPPORTUNITIES * ";

  return (
    <section className="marquee-section">
      <div className="marquee-wrapper">
        {/* Row 1 - Moves Left */}
        <div className="marquee-row row-left">
          <div className="marquee-track">
            <span>{row1Text}</span>
            <span>{row1Text}</span>
            <span>{row1Text}</span>
            <span>{row1Text}</span>
          </div>
        </div>

        {/* Row 2 - Moves Right */}
        <div className="marquee-row row-right">
          <div className="marquee-track">
            <span className="text-outline">{row2Text}</span>
            <span className="text-outline">{row2Text}</span>
            <span className="text-outline">{row2Text}</span>
            <span className="text-outline">{row2Text}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
