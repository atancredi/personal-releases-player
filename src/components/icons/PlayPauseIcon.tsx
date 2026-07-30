import type { SVGProps } from "react";

type IconProps = {
    size?: number | string;
    color?: string;
    strokeWidth?: number;
    className?: string;
} & Omit<SVGProps<SVGSVGElement>, "color">;

export function PlayIcon({
    size = 72,
    color = "currentColor",
    strokeWidth = 32,
    className,
    ...props
}: IconProps) {
    return (
        <svg
            viewBox="0 0 512 512"
            width={size}
            height={size}
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <circle
                cx="256"
                cy="256"
                r="192"
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
            />
            <path
                d="M216.32 334.44L330.77 265.3a10.89 10.89 0 000-18.6L216.32 177.56A10.78 10.78 0 00200 186.87v138.26a10.78 10.78 0 0016.32 9.31z"
                fill={color}
            />
        </svg>
    );
}

export function PauseIcon({
    size = 72,
    color = "currentColor",
    strokeWidth = 32,
    className,
    ...props
}: IconProps) {
    return (
        <svg
            viewBox="0 0 512 512"
            width={size}
            height={size}
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <circle
                cx="256"
                cy="256"
                r="192"
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
            />

            <rect
                x="176"
                y="184"
                width="48"
                height="144"
                rx="8"
                fill={color}
            />

            <rect
                x="288"
                y="184"
                width="48"
                height="144"
                rx="8"
                fill={color}
            />
        </svg>
    );
}