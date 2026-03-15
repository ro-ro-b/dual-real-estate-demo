export function Header() {
  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 sticky top-0 z-10">
      <h2 className="text-xl font-bold text-slate-800">Properties Dashboard</h2>
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <span className="material-symbols-outlined text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 text-xl">search</span>
          <input
            className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm w-64 focus:ring-2 focus:ring-[#14b8a7]/20 focus:outline-none"
            placeholder="Search properties..."
            type="text"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
          <div className="size-2 rounded-full bg-[#14b8a7]"></div>
          <span className="text-sm font-semibold text-slate-700">0x7a2d...F42D</span>
          <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
        </button>
        <button className="size-10 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600">
          <span className="material-symbols-outlined">notifications</span>
        </button>
      </div>
    </header>
  );
}
