'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface NavItem {
  label: string;
  icon: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Properties', icon: 'domain', href: '/wallet' },
  { label: 'Browse', icon: 'search', href: '/browse' },
  { label: 'SCAN', icon: 'qr_code_scanner', href: '/scan' },
  { label: 'Portfolio', icon: 'analytics', href: '/portfolio' },
  { label: 'Activity', icon: 'history', href: '/activity' },
];

export default function ConsumerNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/wallet') return pathname === '/wallet' || pathname.startsWith('/wallet/');
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-200 shadow-lg">
      <div className="flex justify-between items-end px-2 py-2">
        {navItems.map((item) => {
          const isItemActive = isActive(item.href);
          const isScan = item.label === 'SCAN';

          if (isScan) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-8 mb-2"
              >
                <div className="w-14 h-14 rounded-full wine-gradient flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
                  <span className="material-symbols-outlined text-white text-2xl">
                    {item.icon}
                  </span>
                </div>
                <span className="text-xs font-semibold text-slate-700 mt-1">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center py-3 px-4 flex-1"
            >
              <span
                className={`material-symbols-outlined text-xl transition-colors ${
                  isItemActive ? 'text-primary-consumer' : 'text-slate-400'
                }`}
              >
                {item.icon}
              </span>
              <span
                className={`text-xs mt-1 font-medium transition-colors ${
                  isItemActive ? 'text-primary-consumer' : 'text-slate-500'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
