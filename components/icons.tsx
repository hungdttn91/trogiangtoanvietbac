
import React from 'react';

export const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
  </svg>
);

export const PaperclipIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.5 10.5a.75.75 0 001.06 1.06l10.5-10.5a.75.75 0 011.06 0s.001.001.001.002a.75.75 0 010 1.06l-7.5 7.5a2.25 2.25 0 003.182 3.182l7.5-7.5a3.75 3.75 0 00-5.303-5.303l-10.5 10.5a3.75 3.75 0 105.303 5.303l10.5-10.5a.75.75 0 00-1.06-1.06l-10.5 10.5a2.25 2.25 0 01-3.182-3.182l10.5-10.5a.75.75 0 00-1.06-1.06l-7.5 7.5a3.75 3.75 0 005.303 5.303l7.5-7.5a.75.75 0 011.06 0 .75.75 0 010 1.06l-7.5 7.5a2.25 2.25 0 003.182 3.182l7.5-7.5a3.75 3.75 0 00-5.303-5.303L6.75 18.25a.75.75 0 01-1.06-1.06l10.5-10.5a2.25 2.25 0 00-3.182-3.182L2.32 14.25a.75.75 0 001.06 1.06l10.5-10.5a.75.75 0 011.06 0z"
      clipRule="evenodd"
    />
  </svg>
);

export const XCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
    </svg>
);
