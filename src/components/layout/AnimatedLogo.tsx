import { signaturePaths } from "./signature-paths";

export default function AnimatedLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="60 430 1370 750"
      width="1370"
      height="750"
      role="img"
      aria-label="Anuja Jayasinghe signature"
    >
      <g fill="#d9d9d9" transform="translate(88 349)">
        {signaturePaths.map((path, index) => (
          <path className="signature-glyph" d={path} key={index} pathLength="1" />
        ))}
      </g>
    </svg>
  );
}
