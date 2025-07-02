export function Logo() {
  return (
    <div className="flex items-center justify-center gap-2 text-xl font-bold tracking-tight text-white p-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-7 w-7 text-accent"
      >
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="m10 10.5 4 4" />
        <path d="m14 10.5-4 4" />
      </svg>
      <span className="hidden group-data-[state=expanded]:[data-sidebar=header]_&, group-data-[mobile=true]:[data-sidebar=header]_&">X-Audit</span>
    </div>
  );
}
