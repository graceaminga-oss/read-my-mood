function Navbar({ activeView, setActiveView, user, onLogout }) {
  const navItems = [
    { id: 'discover', label: 'Discover' },
    { id: 'shelf', label: 'My Shelf' },
    { id: 'journal', label: 'Mood Journal' },
  ];

  return (
    <nav className="border-b border-[#F3ECDA]/10 mb-10 sm:mb-14">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between pb-5">
        
        {/* Brand */}
        <button
          type="button"
          onClick={() => setActiveView('discover')}
          className="text-left"
        >
          <p className="font-['Fraunces'] font-semibold text-xl sm:text-2xl text-[#F3ECDA]">
            Read My Mood
          </p>

          <p className="font-['Courier_Prime'] text-xs text-[#B8D9C4] mt-1">
            welcome, {user.name}
          </p>
        </button>

        {/* Navigation */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-5">
          {navItems.map((item) => {
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveView(item.id)}
                className={`px-2 py-2 font-['Courier_Prime'] text-xs uppercase tracking-wide transition-colors ${
                  isActive
                    ? 'text-[#F3ECDA] underline underline-offset-8 decoration-[#C08A32] decoration-2'
                    : 'text-[#B8D9C4] hover:text-[#F3ECDA]'
                }`}
              >
                {item.label}
              </button>
            );
          })}

          {/* Sign out */}
          <button
            type="button"
            onClick={onLogout}
            className="ml-1 px-3 py-2 border border-[#F3ECDA]/40 text-[#F3ECDA] font-['Courier_Prime'] text-xs uppercase tracking-wide hover:bg-[#F3ECDA] hover:text-[#21402F] hover:border-[#F3ECDA] transition-all duration-200"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;