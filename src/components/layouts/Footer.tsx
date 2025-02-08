import Link from 'next/link'

import { links } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="border-t border-t-primary-outline bg-black p-4 text-white">
      <div className="flex w-full flex-row justify-between">
        <div className="uppercase">© Story Foundation 2025</div>
        <section className="flex flex-row gap-4">
          <Link
            href={links.privacy}
            className="hover:cursor-pointer"
            target="_blank"
            rel="noreferrer noopener"
          >
            Privacy Policy
          </Link>
          <Link
            href={links.terms}
            className="hover:cursor-pointer"
            target="_blank"
            rel="noreferrer noopener"
          >
            Terms of Service
          </Link>
        </section>
      </div>
    </footer>
  )
}
