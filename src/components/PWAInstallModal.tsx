"use client";

import { usePWAInstall } from "@/hooks/usePWAInstall";
import { Button } from "@/components/ui/button";

const benefits = [
  { icon: "offline_bolt", text: "Funciona offline, sem internet" },
  { icon: "notifications_active", text: "Notificações e atualizações" },
  { icon: "speed", text: "Acesso rápido direto da tela inicial" },
];

const PWAInstallModal = () => {
  const { showModal, install, dismiss, canInstall, isIOS } = usePWAInstall();

  if (!showModal) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={dismiss}
    >
      <div
        className="mx-4 w-full max-w-[420px] overflow-hidden rounded-2xl border border-border bg-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <span className="material-symbols-rounded text-2xl text-primary-foreground">
                finance_mode
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-primary text-[15px] font-semibold text-foreground">
                Lunaris Finance
              </span>
              <span className="font-secondary text-xs text-muted-foreground">
                Controle financeiro pessoal
              </span>
            </div>
          </div>
          <button
            onClick={dismiss}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.08] text-muted-foreground transition-colors hover:bg-white/[0.14]"
          >
            <span className="material-symbols-rounded text-base">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-3 px-6 py-6">
          {benefits.map((b) => (
            <div key={b.icon} className="flex items-center gap-2.5">
              <span className="material-symbols-rounded text-lg text-primary">
                {b.icon}
              </span>
              <span className="font-secondary text-[13px] text-foreground">
                {b.text}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-2.5 border-t border-border px-6 py-4">
          {canInstall ? (
            <Button onClick={install} className="w-full">
              Instalar App
            </Button>
          ) : isIOS ? (
            <p className="text-center font-secondary text-xs text-muted-foreground">
              Toque em{" "}
              <span className="material-symbols-rounded align-middle text-sm text-foreground">
                ios_share
              </span>{" "}
              e depois em{" "}
              <strong className="text-foreground">
                Adicionar à Tela de Início
              </strong>
            </p>
          ) : (
            <Button onClick={dismiss} className="w-full">
              Instalar App
            </Button>
          )}
          <Button variant="outline" onClick={dismiss} className="w-full">
            Agora não
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallModal;
