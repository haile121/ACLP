/** Static header placeholder (SSR / pre-mount) — matches Navbar height to avoid layout shift. */
export function NavbarShell() {
  return (
    <header
      className="fixed top-0 inset-x-0 z-40 h-16 border-b border-gray-200/80 dark:border-white/10 bg-white/80 dark:bg-[#06060c]/80 backdrop-blur-md"
      aria-hidden
      suppressHydrationWarning
    />
  );
}
