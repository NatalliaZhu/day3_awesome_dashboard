import type { Metadata } from "next"
import { Quicksand } from "next/font/google"

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-trello",
})

export const metadata: Metadata = {
  title: "My Trello Board",
}

export default function TrelloLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`flex min-h-0 flex-1 flex-col ${quicksand.variable}`}>
      {children}
    </div>
  )
}
