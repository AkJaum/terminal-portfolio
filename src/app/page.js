"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

const COPY = {
  "pt-BR": {
    welcome: "Seja bem-vindo! Esse e o meu portfolio, selecione uma das opcoes abaixo para visualizar meus projetos",
    guiTitle: "GUI",
    recommended: "(RECOMENDADO)",
    guiDescription: "Utilize um \"sistema operacional\" criado por mim para explorar conteudos do portfolio.",
    guiDescriptionExtra: "Tambem e possivel acessar o terminal nesse ambiente.",
    terminalTitle: "Terminal",
    terminalDescription: "Se voce e um entusiasta de terminais e comandos, essa e a opcao para voce! Explore o portfolio usando uma interface de linha de comando inspirada em sistemas Unix.",
    modalTitle: "Definir usuario da maquina",
    modalDescription: "Escolha o nome do usuario para entrar no ambiente selecionado.",
    userLabel: "Nome do usuario",
    userPlaceholder: "ex: joao",
    cancel: "Cancelar",
    confirmGui: "Entrar em GUI",
    confirmTerminal: "Entrar em Terminal",
  },
  "en-US": {
    welcome: "Welcome! This is my portfolio, choose one of the options below to explore my projects",
    guiTitle: "GUI",
    recommended: "(RECOMMENDED)",
    guiDescription: "Use an operating system built by me to explore the portfolio content.",
    guiDescriptionExtra: "You can also access the terminal inside this environment.",
    terminalTitle: "Terminal",
    terminalDescription: "If you enjoy terminals and commands, this option is for you! Explore the portfolio through a Unix-inspired command line interface.",
    modalTitle: "Set machine user",
    modalDescription: "Choose the user name to enter the selected environment.",
    userLabel: "User name",
    userPlaceholder: "e.g. joao",
    cancel: "Cancel",
    confirmGui: "Enter GUI",
    confirmTerminal: "Enter Terminal",
  },
};

function sanitizeUserName(value) {
  const trimmed = value.trim().replace(/\s+/g, "_");
  const cleaned = trimmed.replace(/[^a-zA-Z0-9_-]/g, "");
  return cleaned.slice(0, 24);
}

export default function Page() {
  const router = useRouter();
  const [languageIndex, setLanguageIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState("terminal");
  const [userName, setUserName] = useState("");

  const languages = useMemo(() => ["pt-BR", "en-US"], []);
  const activeLanguage = languages[languageIndex];
  const copy = COPY[activeLanguage];

  function rotateLanguage(direction) {
    setLanguageIndex((prev) => {
      const total = languages.length;
      return (prev + direction + total) % total;
    });
  }

  function openModeModal(mode) {
    setSelectedMode(mode);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  function handleConfirm(event) {
    event.preventDefault();
    const finalUser = sanitizeUserName(userName) || "guest";
    router.push(`/${selectedMode}?user=${encodeURIComponent(finalUser)}`);
  }

  return (
    <main className={styles.container}>
      <div className={styles.languageFrame}>
        <button type="button" className={styles.arrowButton} onClick={() => rotateLanguage(-1)} aria-label="Idioma anterior">
          &#x2039;
        </button>

        <section className={styles.section}>
          <h1 className={styles.heading}>
            boot_loader0
          </h1>

          <p className={styles.languageIndicator}>{activeLanguage}</p>
          <h2 className={styles.headerTitle}>{copy.welcome}</h2>
          <div className={styles.grid}>
            <button type="button" className={`${styles.card} ${styles.cardButton}`} onClick={() => openModeModal("gui")}> 
              <h2 className={styles.cardTitle}>{copy.guiTitle} - <span className={styles.recommendedTag}>{copy.recommended}</span></h2>
              <p className={styles.cardDescription}>
                {copy.guiDescription} <span>{copy.guiDescriptionExtra}</span>
              </p>
            </button>
            <button type="button" className={`${styles.card} ${styles.cardButton}`} onClick={() => openModeModal("terminal")}> 
              <h2 className={styles.cardTitle}>{copy.terminalTitle}</h2>
              <p className={styles.cardDescription}>
                {copy.terminalDescription}
              </p>
            </button>
          </div>
        </section>

        <button type="button" className={styles.arrowButton} onClick={() => rotateLanguage(1)} aria-label="Proximo idioma">
          &#x203A;
        </button>
      </div>

      {modalOpen && (
        <div className={styles.modalOverlay} role="presentation" onClick={closeModal}>
          <div className={styles.modalCard} role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <h3 className={styles.modalTitle}>{copy.modalTitle}</h3>
            <p className={styles.modalDescription}>{copy.modalDescription}</p>
            <form onSubmit={handleConfirm}>
              <label htmlFor="username" className={styles.modalLabel}>{copy.userLabel}</label>
              <input
                id="username"
                className={styles.modalInput}
                value={userName}
                onChange={(event) => setUserName(event.target.value)}
                placeholder={copy.userPlaceholder}
                maxLength={24}
              />
              <div className={styles.modalActions}>
                <button type="button" className={styles.modalButtonGhost} onClick={closeModal}>{copy.cancel}</button>
                <button type="submit" className={styles.modalButtonPrimary}>
                  {selectedMode === "gui" ? copy.confirmGui : copy.confirmTerminal}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
