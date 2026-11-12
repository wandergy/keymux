"use strict";

(() => {
  const storageKey = "keymux.ui.theme";
  const modes = ["system", "light", "dark"];
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
  let preference = "system";

  try {
    const saved = localStorage.getItem(storageKey);
    if (modes.includes(saved)) preference = saved;
  } catch {
    // Local file previews may not allow storage; theme selection still works for this page.
  }

  function applyTheme() {
    const resolved = preference === "system" ? (systemTheme.matches ? "dark" : "light") : preference;
    document.documentElement.dataset.theme = resolved;
    document.documentElement.dataset.themePreference = preference;
    document.documentElement.style.colorScheme = resolved;
    const control = document.getElementById("theme-mode");
    if (control) control.value = preference;
  }

  // Run before the stylesheet to avoid showing the wrong theme on initial load.
  applyTheme();
  document.addEventListener("DOMContentLoaded", applyTheme, { once: true });
  systemTheme.addEventListener("change", () => {
    if (preference === "system") applyTheme();
  });
  document.addEventListener("change", event => {
    if (event.target.id !== "theme-mode" || !modes.includes(event.target.value)) return;
    preference = event.target.value;
    try { localStorage.setItem(storageKey, preference); } catch { /* Keep the in-page choice. */ }
    applyTheme();
  });
})();
