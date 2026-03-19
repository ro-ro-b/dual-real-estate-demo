'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: 'dashboard' },
  { name: 'Properties', href: '/admin/properties', icon: 'domain' },
  { name: 'Mint', href: '/admin/mint', icon: 'add_box' },
  { name: 'Transactions', href: '/admin/transactions', icon: 'receipt_long' },
  { name: 'Webhooks', href: '/admin/webhooks', icon: 'webhook' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-[#0f172a] text-white flex flex-col fixed h-full z-10 border-r border-slate-800">
      <div className="p-6 flex items-center gap-3">
        <div className="size-10 bg-primary-consumer rounded-lg flex items-center justify-center">
          <span className="material-symbols-outlined text-white">domain</span>
        </div>
        <div>
          <h1 className="font-bold text-lg leading-none">DUAL RE</h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Real Estate</p>
        </div>
      </div>

      <nav className="flex-1 px-4 mt-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all border-l-2 ${
                isActive
                  ? 'bg-wine-900/30 text-gold-400 font-medium border-l-gold-500'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white border-l-transparent'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <p className="text-xs text-slate-400 uppercase tracking-widest">Network Status</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="size-2 rounded-full bg-gold-500"></div>
            <p className="text-sm font-medium text-slate-200">DUAL Network</p>
          </div>
          <p className="text-[10px] text-slate-500 mt-2">Connected</p>
        </div>
      </div>
    </aside>
  );
}
