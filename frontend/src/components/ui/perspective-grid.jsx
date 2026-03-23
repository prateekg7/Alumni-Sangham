"use client";;
import React, { useEffect, useState, useMemo } from "react";
import { cn } from "@/lib/utils";


export function PerspectiveGrid({
    className,
    gridSize = 40,
    showOverlay = true,
    fadeRadius = 80
}) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Memoize tiles array to prevent unnecessary re-renders of the structure
    const tiles = useMemo(() => Array.from({ length: gridSize * gridSize }), [gridSize]);

    // Handle hover natively to bypass any CSS JIT / specificity conflicts
    const handleMouseEnter = (e) => {
        const colors = [
            "#ef4444", // red
            "#f97316", // orange
            "#eab308", // yellow
            "#22c55e", // green
            "#0ea5e9", // sky
            "#3b82f6", // blue
            "#8b5cf6", // violet
            "#d946ef", // fuchsia
            "#ec4899", // pink
        ];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        e.target.style.transitionDuration = '0s';
        e.target.style.backgroundColor = randomColor;
    };

    const handleMouseLeave = (e) => {
        e.target.style.transitionDuration = '1.5s';
        e.target.style.backgroundColor = 'transparent';
    };

    return (
        <div
            className={cn(
                "relative w-full h-full overflow-hidden bg-white dark:bg-black",
                "[--fade-stop:#ffffff] dark:[--fade-stop:#000000]",
                className
            )}
            style={{
                perspective: "2000px",
                transformStyle: "preserve-3d",
            }}>
            <div
                className="absolute w-[80rem] aspect-square grid origin-center"
                style={{
                    left: "50%",
                    top: "50%",
                    transform:
                        "translate(-50%, -50%) rotateX(30deg) rotateY(-5deg) rotateZ(20deg) scale(2)",
                    transformStyle: "preserve-3d",
                    gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                    gridTemplateRows: `repeat(${gridSize}, 1fr)`,
                    pointerEvents: 'auto'
                }}>
                {/* Tiles */}
                {mounted &&
                    tiles.map((_, i) => (
                        <div
                            key={i}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            className="tile min-h-[1px] min-w-[1px] border border-gray-300 dark:border-gray-800 transition-colors pointer-events-auto"
                            style={{ backgroundColor: 'transparent' }}
                        />
                    ))}
            </div>
            {/* Radial Gradient Mask (Overlay) */}
            {showOverlay && (
                <div
                    className="absolute inset-0 pointer-events-none z-10"
                    style={{
                        background: `radial-gradient(circle, transparent 25%, var(--fade-stop) ${fadeRadius}%)`,
                    }} />
            )}
        </div>
    );
}

export default PerspectiveGrid;
