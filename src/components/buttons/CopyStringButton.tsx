export default function CopyStringButton({ value }: { value: string }) {
  return (
    <button
      onClick={() => navigator.clipboard.writeText(value as string)}
      className="group flex-shrink-0 rounded-md p-1 transition-colors hover:bg-primary-grey"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="h-4 w-4 transition-colors group-hover:stroke-primary-outline group-active:stroke-sp-purple"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
    </button>
  )
}
