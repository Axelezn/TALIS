// src/hooks/usePageFocus.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function usePageFocus() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (window.location.hash) return;

    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
    }
  }, [pathname]);
}