import { Metadata } from "next";
import SharePageClient from "./SharePageClient";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://spendlens.app";
  return {
    title: "AI Spend Audit — SpendLens",
    description: "See this team's AI tool spend audit. Find out if you're overpaying for Cursor, Claude, ChatGPT & more.",
    openGraph: {
      title: "AI Spend Audit Report — SpendLens",
      description: "See how much this team could save on AI tools. Run your own free audit in 2 minutes.",
      url: `${baseUrl}/share/${params.id}`,
      images: [{ url: `${baseUrl}/og-image.png`, width: 1200, height: 630 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "AI Spend Audit Report — SpendLens",
      description: "See how much this team could save on AI tools. Run your own free audit in 2 minutes.",
      images: [`${baseUrl}/og-image.png`],
    },
  };
}

export default function SharePage({ params }: Props) {
  return <SharePageClient id={params.id} />;
}
