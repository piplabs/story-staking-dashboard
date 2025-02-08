export default function CopyStringButton({ value }: { value: string }) {
  return (
    <button
      onClick={() => navigator.clipboard.writeText(value as string)}
      className="group flex flex-shrink-0 items-center rounded-md p-1 transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 20"
        stroke="currentColor"
        className="h-5 w-5 transition-colors group-hover:stroke-primary-outline group-active:stroke-sp-purple"
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
