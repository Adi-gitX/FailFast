export const Logo = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 100 100"
        className={className}
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
    >
        {/* Abstract "Atomic" shape from reference */}
        <path
            d="M50 10 C 70 10, 85 25, 85 40 C 85 55, 75 60, 65 65 C 55 70, 45 70, 35 65 C 25 60, 15 55, 15 40 C 15 25, 30 10, 50 10 Z"
            fill="white"
            transform="rotate(45 50 50)"
        />
        <circle cx="50" cy="50" r="15" fill="black" />
    </svg>
);
