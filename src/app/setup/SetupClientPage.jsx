"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./setup.module.css";

const MODES = {
  gui: { label: "GUI", path: "/gui" },
  terminal: { label: "Terminal", path: "/terminal" },
};

const LANGUAGE_OPTIONS = [
  { value: "pt-BR", label: "Portugues (Brasil)" },
  { value: "en-US", label: "English (US)" },
];

function sanitizeUserName(value) {
  const trimmed = value.trim().replace(/\s+/g, "_");
  const cleaned = trimmed.replace(/[^a-zA-Z0-9_-]/g, "");
  return cleaned.slice(0, 24);
}

export default function SetupClientPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userName, setUserName] = useState("");
  const [language, setLanguage] = useState("pt-BR");

  const modeKey = useMemo(() => {
    const rawMode = searchParams.get("mode") || "terminal";
    return rawMode === "gui" ? "gui" : "terminal";
  }, [searchParams]);

  const mode = MODES[modeKey];

  function handleSubmit(event) {
    event.preventDefault();
    const finalUserName = sanitizeUserName(userName) || "guest";
    const params = new URLSearchParams({
      user: finalUserName,
      lang: language,
    });
    router.push(`${mode.path}?${params.toString()}`);
  }

  return (
    <main className={styles.container}>
      <section className={styles.card}>
        <p className={styles.badge}>Machine Setup</p>
        <h1 className={styles.title}>Configurar acesso</h1>
        <p className={styles.subtitle}>
          Escolha o nome do usuario da maquina antes de entrar no ambiente {mode.label}.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label} htmlFor="userName">
            Nome do usuario
          </label>
          <input
            id="userName"
            className={styles.input}
            type="text"
            value={userName}
            onChange={(event) => setUserName(event.target.value)}
            placeholder="ex: joao"
            maxLength={24}
          />

          <label className={styles.label} htmlFor="language">
            Linguagem do sistema
          </label>
          <select
            id="language"
            className={styles.select}
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
          >
            {LANGUAGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <div className={styles.actions}>
            <button type="submit" className={styles.confirmButton}>
              Confirmar e entrar em {mode.label}
            </button>
            <Link href="/" className={styles.backLink}>
              Voltar
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
