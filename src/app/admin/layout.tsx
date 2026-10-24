import "./admin.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Admin | Willesden Reclamation" },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main id="main-content" tabIndex={-1}>
      {children}
    </main>
  );
}
