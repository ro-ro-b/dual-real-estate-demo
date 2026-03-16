import ConsumerNav from '@/components/layout/ConsumerNav';

export default function ConsumerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <main className="max-w-md mx-auto pb-24">
        {children}
      </main>
      <ConsumerNav />
    </div>
  );
}
