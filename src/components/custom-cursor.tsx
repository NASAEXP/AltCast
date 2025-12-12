"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "motion/react";

export function CustomCursor() {
    const [isHovered, setIsHovered] = useState(false);
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
    const outlineX = useSpring(cursorX, springConfig);
    const outlineY = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (
                target.tagName === "BUTTON" ||
                target.tagName === "A" ||
                target.tagName === "INPUT" ||
                target.closest(".interactive-el")
            ) {
                setIsHovered(true);
            } else {
                setIsHovered(false);
            }
        };

        window.addEventListener("mousemove", moveCursor);
        document.addEventListener("mouseover", handleMouseOver);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            document.removeEventListener("mouseover", handleMouseOver);
        };
    }, [cursorX, cursorY]);

    return (
        <>
            <motion.div
                className="fixed top-0 left-0 w-2 h-2 bg-acid rounded-full pointer-events-none z-[9999] mix-blend-exclusion"
                style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
            />
            <motion.div
                className="fixed top-0 left-0 border-2 border-acid rounded-full pointer-events-none z-[9999] mix-blend-exclusion"
                style={{ x: outlineX, y: outlineY, translateX: "-50%", translateY: "-50%" }}
                animate={{
                    width: isHovered ? 60 : 40,
                    height: isHovered ? 60 : 40,
                    backgroundColor: isHovered ? "rgba(204, 255, 0, 0.1)" : "transparent",
                    borderColor: isHovered ? "#FF003C" : "#CCFF00"
                }}
            />
        </>
    );
}
