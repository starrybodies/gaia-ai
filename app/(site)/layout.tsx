import Header from "@/components/Header";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-dvh">
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  );
}
