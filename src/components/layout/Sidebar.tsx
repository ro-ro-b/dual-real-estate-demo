'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Properties', href: '/properties', icon: 'dashboard' },
  { name: 'Admin', href: '/admin', icon: 'admin_panel_settings' },
  { name: 'Transactions', href: '#', icon: 'account_balance_wallet' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-[#0f172a] text-white flex flex-col fixed h-full z-10">
      <div className="p-6 flex items-center gap-3">
        <div className="size-10 bg-[#14b8a7] rounded-lg flex items-center justify-center">
          <span className="material-symbols-outlined text-white">domain</span>
        </div>
        <div>
          <h1 className="font-bold text-lg leading-none">DUAL RE</h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Real Estate</p>
        </div>
      </div>

      <nav className="flex-1 px-4 mt-4 space-y-1">
        {navigation.map((item) => {
          const isActive = item.href !== '#' && pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-[#14b8a7]/20 text-[#14b8a7] font-medium'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-xl p-4">
          <p className="text-xs text-slate-400">Connected Network</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="size-2 rounded-full bg-[#14b8a7]"></div>
            <p className="text-sm font-medium">Ethereum Mainnet</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
