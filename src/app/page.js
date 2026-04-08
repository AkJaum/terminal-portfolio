import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen bg-black text-green-400 flex items-center justify-center p-6">
      <section className="w-full max-w-4xl">
        <h1 className="text-2xl md:text-3xl font-mono text-center mb-10">
          selecione o modo de visualização
        </h1>

        <div className="grid gap-6 md:grid-cols-2">
          <Link
            href="/terminal"
            className="block rounded-xl border border-green-500/60 bg-[#111] p-6 hover:border-green-400 hover:bg-[#151515] transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">Terminal</h2>
            <p className="text-sm text-green-300/90 leading-relaxed">
              Experiência estilo shell com comandos, histórico e navegação por sistema de arquivos virtual.
            </p>
          </Link>

          <Link
            href="/gui"
            className="block rounded-xl border border-green-500/60 bg-[#111] p-6 hover:border-green-400 hover:bg-[#151515] transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">GUI</h2>
            <p className="text-sm text-green-300/90 leading-relaxed">
              Interface gráfica com foco em usabilidade visual para explorar conteúdos do portfólio.
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}