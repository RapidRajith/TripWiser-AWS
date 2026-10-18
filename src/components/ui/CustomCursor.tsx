
import { useEffect, useState } from 'react';

export const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    // Skip custom cursor on touch devices.
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const handleMouseMove = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
      setVisible(true);

      const target = event.target as HTMLElement | null;
      setHovering(
        !!target?.closest(
          'a, button, input, textarea, select, [role="button"]'
        )
      );
    };

    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="custom-cursor"
      style={{
        left: position.x,
        top: position.y,
        opacity: visible ? 1 : 0,
        transform: `translate(-50%, -50%) scale(${hovering ? 1.7 : 1})`,
      }}
    />
  );
};
