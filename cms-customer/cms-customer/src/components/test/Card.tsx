"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./Card.module.css";

const Card = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    const $card = cardRef.current;
    if (!$card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const leftX = mouseX - bounds.x;
      const topY = mouseY - bounds.y;
      const center = {
        x: leftX - bounds.width / 2,
        y: topY - bounds.height / 2,
      };
      const distance = Math.sqrt(center.x ** 2 + center.y ** 2);

      // Check if the .glow element exists
      const glowElement = $card.querySelector<HTMLDivElement>(".glow");
      if (glowElement) {
        glowElement.style.backgroundImage = `
          radial-gradient(
            circle at
            ${center.x * 2 + bounds.width / 2}px
            ${center.y * 2 + bounds.height / 2}px,
            #ffffff55,
            #0000000f
          )
        `;
      }

      $card.style.transform = `
        scale3d(1.07, 1.07, 1.07)
        rotate3d(
          ${center.y / 100},
          ${-center.x / 100},
          0,
          ${Math.log(distance) * 2}deg
        )
      `;
    };

    const handleMouseEnter = () => {
      setBounds($card.getBoundingClientRect());
      document.addEventListener("mousemove", handleMouseMove);
    };

    const handleMouseLeave = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      $card.style.transform = "";
      const glowElement = $card.querySelector<HTMLDivElement>(".glow");
      if (glowElement) {
        glowElement.style.backgroundImage = "";
      }
    };

    $card.addEventListener("mouseenter", handleMouseEnter);
    $card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      $card.removeEventListener("mouseenter", handleMouseEnter);
      $card.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [bounds]);

  return (
    <div ref={cardRef} className={styles.card}>
      <div className="text-right text-bold p-4 text-[#181a1a]">3D Card</div>
      <div className={styles.glow}></div>
    </div>
  );
};

export default Card;
