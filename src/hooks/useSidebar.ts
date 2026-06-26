"use client";

import { useState, useEffect } from "react";

/**
 * Hook para gerenciar o estado da sidebar.
 * Controla abertura/fechamento no mobile e detecta tamanho de tela.
 */
export const useSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (desktop) setIsOpen(false);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const toggle = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);
  const open = () => setIsOpen(true);

  return { isOpen, isDesktop, toggle, close, open };
};
