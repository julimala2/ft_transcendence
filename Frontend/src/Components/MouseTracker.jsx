import React, { useState, useEffect } from "react";

const MouseTracker = ({mouseChange}) => {
  useEffect(() => {
    const updatePosition = (event) => {
      mouseChange({
        x: event.clientX / window.innerWidth,
        y: event.clientY / window.innerHeight,});
    };
    window.addEventListener("mousemove", updatePosition);
    return () => {
      window.removeEventListener("mousemove", updatePosition);
    };
  }, []);
};
export default MouseTracker;