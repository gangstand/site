interface CloseButtonProps {
  label: string;
  onClick: () => void;
  autoFocus?: boolean;
  className?: string;
}

export function CloseButton({ label, onClick, autoFocus, className = "" }: CloseButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      autoFocus={autoFocus}
      onClick={onClick}
      className={`grid h-7 w-7 shrink-0 cursor-pointer place-items-center rounded-full bg-primary/5 text-primary/80 transition-colors hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 ${className}`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m6 6 12 12M6 18 18 6" />
      </svg>
    </button>
  );
}
