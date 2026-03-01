"use client";

const LunarisLogo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path
      d="M16 0c8.83656 0 16 7.16344 16 16 0 8.83656-7.16344 16-16 16-8.83656 0-16-7.16344-16-16 0-8.83656 7.16344-16 16-16z m1.86035 8.71777c-0.66585-1.68829-3.05485-1.68829-3.7207 0l-1.21485 3.08008c-0.20329 0.51544-0.61151 0.92366-1.12695 1.12695l-3.08008 1.21485c-1.68829 0.66585-1.68829 3.05485 0 3.7207l3.08008 1.21485c0.51544 0.20329 0.92366 0.61151 1.12695 1.12695l1.21485 3.08008c0.66585 1.68829 3.05485 1.68829 3.7207 0l1.21485-3.08008c0.20329-0.51544 0.61151-0.92366 1.12695-1.12695l3.08008-1.21485c1.68829-0.66585 1.68829-3.05485 0-3.7207l-3.08008-1.21485c-0.51544-0.20329-0.92366-0.61151-1.12695-1.12695l-1.21485-3.08008z"
      fill="var(--primary)"
    />
  </svg>
);

interface NavItem {
  icon: string;
  label: string;
  active?: boolean;
}

const navSections: { title: string; items: NavItem[] }[] = [
  {
    title: "Main",
    items: [{ icon: "receipt_long", label: "Transactions", active: true }],
  },
  {
    title: "Settings",
    items: [{ icon: "settings", label: "Settings" }],
  },
];

const Sidebar = () => {
  return (
    <aside className="flex h-full w-[280px] shrink-0 flex-col bg-sidebar border-r border-sidebar-border">
      {/* Header */}
      <div className="flex h-[88px] items-center gap-2 border-b border-sidebar-border px-8 py-6">
        <LunarisLogo />
        <span className="font-primary text-lg font-bold leading-none text-primary">
          LUNARIS
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-6 px-4 py-0">
        {navSections.map((section) => (
          <div key={section.title} className="flex flex-col">
            <span className="px-4 py-4 font-primary text-sm text-sidebar-foreground">
              {section.title}
            </span>
            {section.items.map((item) => (
              <a
                key={item.label}
                href="#"
                className={`flex items-center gap-4 rounded-full px-4 py-3 ${
                  item.active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                }`}
              >
                <span
                  className="material-symbols-sharp text-sidebar-foreground"
                  style={{ fontSize: 24, fontVariationSettings: "'wght' 100" }}
                >
                  {item.icon}
                </span>
                <span className="font-secondary text-base text-sidebar-foreground">
                  {item.label}
                </span>
              </a>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="flex items-center gap-2 px-8 py-6">
        <div className="flex flex-1 flex-col gap-1">
          <span className="font-secondary text-base text-sidebar-foreground">
            Joe Doe
          </span>
          <span className="font-secondary text-base text-sidebar-foreground">
            joe@acmecorp.com
          </span>
        </div>
        <span
          className="material-symbols-sharp text-sidebar-foreground"
          style={{ fontSize: 24, fontVariationSettings: "'wght' 100" }}
        >
          keyboard_arrow_down
        </span>
      </div>
    </aside>
  );
};

export default Sidebar;
