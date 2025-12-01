"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { createAdmin, getAdminStatus } from "../lib/api";

type ScreenState = "loading" | "ready";

export default function Home() {
  const [status, setStatus] = useState<ScreenState>("loading");
  const [hasAdmin, setHasAdmin] = useState<boolean | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const data = await getAdminStatus();
        setHasAdmin(data.hasAdmin);
      } catch (err) {
        console.error("Error fetching admin status", err);
        setError("No se pudo consultar el estado del administrador.");
      } finally {
        setStatus("ready");
      }
    };

    loadStatus();
  }, []);

  const handleChange = (
    field: keyof typeof form,
    value: string,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (form.password.trim().length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      setSubmitting(true);
      await createAdmin({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      setSuccess("Administrador creado con éxito. Ya puedes iniciar sesión.");
      setHasAdmin(true);
    } catch (err) {
      console.error("Error creating admin", err);
      setError("No se pudo crear el administrador. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  const showCreationForm = status === "ready" && hasAdmin === false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-900 text-slate-50">
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-12 lg:px-12">
        <header className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/90 text-2xl font-bold text-slate-950">
              J
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-emerald-200/80">
                Jota Domicilios
              </p>
              <h1 className="text-2xl font-semibold leading-tight">Panel de inicio</h1>
              <p className="text-sm text-slate-300/80">
                Verificación automática del administrador antes de operar.
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-3 text-sm font-medium text-emerald-100 sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_6px_rgba(52,211,153,0.2)]" />
            Sistema conectado
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-emerald-500/10 backdrop-blur">
            {status === "loading" && (
              <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                <div className="h-14 w-14 animate-spin rounded-full border-4 border-white/20 border-t-emerald-400" />
                <div>
                  <p className="text-lg font-semibold">Consultando el backend</p>
                  <p className="text-sm text-slate-300/80">
                    Validando si ya existe un usuario administrador.
                  </p>
                </div>
              </div>
            )}

            {status === "ready" && hasAdmin && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3 rounded-2xl bg-emerald-500/10 p-4 text-emerald-100">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/90 text-lg font-bold text-slate-950">
                    ✓
                  </div>
                  <div>
                    <p className="text-lg font-semibold">Administrador detectado</p>
                    <p className="text-sm text-emerald-50/80">
                      Usa tus credenciales para ingresar al panel principal.
                    </p>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-6 text-sm leading-relaxed text-slate-200/90">
                  <p>
                    El sistema encontró un administrador en la base de datos. Si
                    necesitas actualizarlo, hazlo desde la sección de usuarios
                    del panel una vez inicies sesión.
                  </p>
                  <p className="mt-4 text-emerald-100">
                    Tip: mantén tus credenciales seguras y actualiza la
                    contraseña de forma periódica.
                  </p>
                </div>
              </div>
            )}

            {showCreationForm && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <p className="text-xs uppercase tracking-[0.25em] text-emerald-200/80">
                    Primer inicio
                  </p>
                  <h2 className="text-2xl font-semibold leading-tight">
                    Crear el administrador inicial
                  </h2>
                  <p className="text-sm text-slate-200/80">
                    Configura el único usuario con acceso total al sistema de
                    pedidos. Esta acción solo estará disponible mientras no
                    exista un administrador registrado.
                  </p>
                </div>

                <form className="grid gap-5" onSubmit={handleSubmit}>
                  <div className="grid gap-2">
                    <label className="text-sm text-slate-200" htmlFor="name">
                      Nombre completo
                    </label>
                    <input
                      required
                      id="name"
                      type="text"
                      value={form.name}
                      onChange={(event) =>
                        handleChange("name", event.target.value)
                      }
                      className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-50 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40"
                      placeholder="Ej. Ana Martínez"
                    />
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm text-slate-200" htmlFor="email">
                      Correo electrónico
                    </label>
                    <input
                      required
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(event) =>
                        handleChange("email", event.target.value)
                      }
                      className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-50 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40"
                      placeholder="admin@jotadomicilios.com"
                    />
                  </div>

                  <div className="grid gap-2">
                    <label
                      className="text-sm text-slate-200"
                      htmlFor="password"
                    >
                      Contraseña
                    </label>
                    <input
                      required
                      id="password"
                      type="password"
                      value={form.password}
                      onChange={(event) =>
                        handleChange("password", event.target.value)
                      }
                      className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-50 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40"
                      placeholder="Mínimo 8 caracteres"
                    />
                  </div>

                  <div className="grid gap-2">
                    <label
                      className="text-sm text-slate-200"
                      htmlFor="confirmPassword"
                    >
                      Confirmar contraseña
                    </label>
                    <input
                      required
                      id="confirmPassword"
                      type="password"
                      value={form.confirmPassword}
                      onChange={(event) =>
                        handleChange("confirmPassword", event.target.value)
                      }
                      className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-50 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40"
                      placeholder="Repite la contraseña"
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 rounded-xl border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-100">
                      <span className="text-lg">⚠️</span>
                      <p>{error}</p>
                    </div>
                  )}

                  {success && (
                    <div className="flex items-center gap-2 rounded-xl border border-emerald-300/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-50">
                      <span className="text-lg">🎉</span>
                      <p>{success}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {submitting ? "Creando administrador..." : "Crear administrador"}
                  </button>
                </form>
              </div>
            )}

            {status === "ready" && hasAdmin === null && !showCreationForm && (
              <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 p-5 text-amber-50">
                No pudimos determinar el estado del administrador. Revisa la
                conexión con el backend y vuelve a intentarlo.
              </div>
            )}
          </div>

          <aside className="flex flex-col justify-between gap-6 rounded-3xl border border-white/10 bg-slate-950/50 p-8 shadow-[0_25px_80px_-35px_rgba(0,0,0,0.75)]">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.25em] text-emerald-200/80">
                Seguridad
              </p>
              <h3 className="text-xl font-semibold">Una sola cuenta</h3>
              <p className="text-sm leading-relaxed text-slate-300/90">
                El sistema solo admite un administrador. El asistente inicial
                consulta el backend y habilita este formulario únicamente cuando
                la base de datos no tiene usuarios. Después, la gestión se
                realiza desde el panel.
              </p>
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-white/5 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/90 text-slate-950">
                  <Image src="/favicon.ico" alt="Jota" width={28} height={28} />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-emerald-100/80">
                    Flujo inicial
                  </p>
                  <p className="text-base font-semibold">Verificación + alta</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-slate-200/90">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                  Consulta al backend para saber si hay usuarios.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                  Despliega un formulario seguro para crear al administrador.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                  Bloquea el alta una vez detectado el administrador.
                </li>
              </ul>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
