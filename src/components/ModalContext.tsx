"use client";

import React, { createContext, useContext, useState } from "react";
import type { AllyTab } from "./AllyDeskContent";
import { AllyDeskDrawer } from "./AllyDeskDrawer";
import { StandardsModal } from "./StandardsModal";

interface ModalContextValue {
  openStandardsModal: () => void;
  openAllyDrawer: (tab?: AllyTab) => void;
}

const ModalContext = createContext<ModalContextValue>({
  openStandardsModal: () => {},
  openAllyDrawer: () => {},
});

export function useDyeguModals() {
  return useContext(ModalContext);
}

export function DyeguModalProvider({ children }: { children: React.ReactNode }) {
  const [standardsOpen, setStandardsOpen] = useState(false);
  const [allyState, setAllyState] = useState<{ open: boolean; tab: AllyTab }>({
    open: false,
    tab: "practitioners",
  });

  return (
    <ModalContext.Provider
      value={{
        openStandardsModal: () => setStandardsOpen(true),
        openAllyDrawer: (tab = "practitioners") => setAllyState({ open: true, tab }),
      }}
    >
      {children}
      <StandardsModal open={standardsOpen} onClose={() => setStandardsOpen(false)} />
      <AllyDeskDrawer
        open={allyState.open}
        initialTab={allyState.tab}
        onClose={() => setAllyState((prev) => ({ ...prev, open: false }))}
      />
    </ModalContext.Provider>
  );
}
