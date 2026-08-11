"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { adminFetchHeaders } from "@/lib/admin-session";
import type { AdminProjectPublic } from "@/lib/admin-projects";
import {
  Field,
  PasswordField,
  RenewalBadge,
  Section,
} from "@/components/admin/AdminFormFields";

type FormState = {
  name: string;
  slug: string;
  shortDescription: string;
  publicUrl: string;
  logoUrl: string;
  emailAddress: string;
  emailPassword: string;
  domainPlatform: string;
  domainEmail: string;
  domainPassword: string;
  dbPlatform: string;
  dbEmail: string;
  dbPassword: string;
  deployPlatform: string;
  deployEmail: string;
  deployPassword: string;
  domainRegisteredAt: string;
  domainRenewsAt: string;
};

const emptyForm = (): FormState => ({
  name: "",
  slug: "",
  shortDescription: "",
  publicUrl: "",
  logoUrl: "",
  emailAddress: "",
  emailPassword: "",
  domainPlatform: "",
  domainEmail: "",
  domainPassword: "",
  dbPlatform: "",
  dbEmail: "",
  dbPassword: "",
  deployPlatform: "",
  deployEmail: "",
  deployPassword: "",
  domainRegisteredAt: "",
  domainRenewsAt: "",
});

function fromProject(p: AdminProjectPublic): FormState {
  return {
    name: p.name,
    slug: p.slug,
    shortDescription: p.shortDescription ?? "",
    publicUrl: p.publicUrl ?? "",
    logoUrl: p.logoUrl ?? "",
    emailAddress: p.emailAddress ?? "",
    emailPassword: p.emailPassword ?? "",
    domainPlatform: p.domainPlatform ?? "",
    domainEmail: p.domainEmail ?? "",
    domainPassword: p.domainPassword ?? "",
    dbPlatform: p.dbPlatform ?? "",
    dbEmail: p.dbEmail ?? "",
    dbPassword: p.dbPassword ?? "",
    deployPlatform: p.deployPlatform ?? "",
    deployEmail: p.deployEmail ?? "",
    deployPassword: p.deployPassword ?? "",
    domainRegisteredAt: p.domainRegisteredAt?.slice(0, 10) ?? "",
    domainRenewsAt: p.domainRenewsAt?.slice(0, 10) ?? "",
  };
}

export function AdminProjectsPanel() {
  const [projects, setProjects] = useState<AdminProjectPublic[]>([]);
  const [configured, setConfigured] = useState(true);
  const [setupNote, setSetupNote] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<"view" | "edit" | "create">("view");
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/projects", {
        credentials: "same-origin",
        headers: adminFetchHeaders(),
      });
      if (res.status === 401) {
        setError("Sesión no autorizada. Vuelve a iniciar sesión.");
        return;
      }
      const data = await res.json();
      setConfigured(Boolean(data.configured));
      setSetupNote(data.setupNote ?? null);
      setProjects(data.projects ?? []);
    } catch {
      setError("No se pudo cargar el vault de proyectos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = projects.filter((p) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q) ||
      (p.shortDescription ?? "").toLowerCase().includes(q)
    );
  });

  const selected = projects.find((p) => p.id === selectedId) ?? null;

  function openCreate() {
    setMode("create");
    setSelectedId(null);
    setForm(emptyForm());
    setMessage(null);
    setError(null);
  }

  function openEdit(p: AdminProjectPublic) {
    setSelectedId(p.id);
    setMode("edit");
    setForm(fromProject(p));
    setMessage(null);
    setError(null);
  }

  function openView(p: AdminProjectPublic) {
    setSelectedId(p.id);
    setMode("view");
    setForm(fromProject(p));
    setMessage(null);
  }

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleUpload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.set("file", file);
      fd.set("folder", "logos");
      const res = await fetch("/api/admin/projects/upload", {
        method: "POST",
        credentials: "same-origin",
        headers: adminFetchHeaders(),
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al subir");
      setField("logoUrl", data.url);
      setMessage("Imagen subida a Storage.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al subir imagen");
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    setSaving(true);
    setError(null);
    setMessage(null);
    const payload = {
      name: form.name,
      slug: form.slug,
      shortDescription: form.shortDescription || null,
      publicUrl: form.publicUrl || null,
      logoUrl: form.logoUrl || null,
      emailAddress: form.emailAddress || null,
      emailPassword: form.emailPassword || null,
      domainPlatform: form.domainPlatform || null,
      domainEmail: form.domainEmail || null,
      domainPassword: form.domainPassword || null,
      dbPlatform: form.dbPlatform || null,
      dbEmail: form.dbEmail || null,
      dbPassword: form.dbPassword || null,
      deployPlatform: form.deployPlatform || null,
      deployEmail: form.deployEmail || null,
      deployPassword: form.deployPassword || null,
      domainRegisteredAt: form.domainRegisteredAt || null,
      domainRenewsAt: form.domainRenewsAt || null,
    };

    try {
      const url =
        mode === "create"
          ? "/api/admin/projects"
          : `/api/admin/projects/${selectedId}`;
      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PATCH",
        credentials: "same-origin",
        headers: adminFetchHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo guardar");
      setMessage(mode === "create" ? "Proyecto creado." : "Cambios guardados.");
      await load();
      if (data.project?.id) {
        setSelectedId(data.project.id);
        setMode("edit");
        setForm(fromProject(data.project));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  async function removeProject() {
    if (!selectedId) return;
    if (!window.confirm("¿Eliminar este proyecto del vault admin?")) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/projects/${selectedId}`, {
        method: "DELETE",
        credentials: "same-origin",
        headers: adminFetchHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo eliminar");
      setSelectedId(null);
      setMode("view");
      setForm(emptyForm());
      setMessage("Proyecto eliminado.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al eliminar");
    } finally {
      setSaving(false);
    }
  }

  const showForm = mode === "create" || mode === "edit";

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.22em] text-accent uppercase">
            2. Proyecto
          </p>
          <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight text-fg md:text-4xl">
            Vault de proyectos
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            Control completo por proyecto: identidad, correo, dominio, base de
            datos, despliegue y renovaciones. Las contraseñas se cifran en el
            servidor (AES-GCM) y solo se descifran tras verificar la sesión
            admin.
          </p>
        </div>
        {configured && (
          <button
            type="button"
            onClick={openCreate}
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink transition hover:brightness-110"
          >
            Añadir proyecto
          </button>
        )}
      </header>

      <div className="border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-fg/90">
        Este vault es de uso privado del admin ATRIX. No compartas contraseñas de
        terceros ni las guardes en el repositorio. Requiere{" "}
        <code className="text-xs">PROJECT_SECRETS_KEY</code> (o service role)
        para cifrar.
      </div>

      {setupNote && (
        <div className="border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-fg">
          {setupNote}
        </div>
      )}
      {error && (
        <div className="border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-fg">
          {error}
        </div>
      )}
      {message && (
        <div className="border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-fg">
          {message}
        </div>
      )}

      {!configured && !loading ? (
        <div className="border border-dashed border-line bg-bg-elevated/40 p-8 text-center text-sm text-muted">
          Configura Supabase y la migración{" "}
          <code className="text-fg">20260811_admin_modules.sql</code> para
          activar el módulo.
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.25fr]">
          <div className="space-y-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre o slug…"
              className="w-full border border-line bg-bg px-4 py-2.5 text-sm text-fg outline-none focus:border-accent"
            />
            <ul className="divide-y divide-line border border-line bg-bg-elevated/70 backdrop-blur">
              {loading && (
                <li className="px-5 py-8 text-center text-sm text-muted">
                  Cargando…
                </li>
              )}
              {!loading &&
                filtered.map((project) => (
                  <li key={project.id}>
                    <button
                      type="button"
                      onClick={() => openView(project)}
                      className={`flex w-full items-start gap-3 px-4 py-3.5 text-left transition hover:bg-bg/50 ${
                        selectedId === project.id ? "bg-accent/10" : ""
                      }`}
                    >
                      {project.logoUrl ? (
                        <span className="relative mt-0.5 h-10 w-10 shrink-0 overflow-hidden rounded-full border border-line bg-bg">
                          <Image
                            src={project.logoUrl}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="40px"
                            unoptimized
                          />
                        </span>
                      ) : (
                        <span
                          className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-bg text-xs font-semibold text-accent"
                          aria-hidden
                        >
                          {project.name.slice(0, 1)}
                        </span>
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="font-medium text-fg">
                            {project.name}
                          </span>
                          <RenewalBadge
                            days={project.daysUntilRenewal}
                            status={project.renewalStatus}
                          />
                        </span>
                        <span className="mt-0.5 block font-mono text-[11px] text-muted">
                          {project.slug}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              {!loading && filtered.length === 0 && (
                <li className="px-5 py-8 text-center text-sm text-muted">
                  Sin proyectos.
                </li>
              )}
            </ul>
          </div>

          <div className="border border-line bg-bg-elevated/70 p-4 backdrop-blur md:p-6">
            {!showForm && !selected && (
              <p className="py-16 text-center text-sm text-muted">
                Selecciona un proyecto o crea uno nuevo.
              </p>
            )}

            {!showForm && selected && (
              <div className="space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-2xl font-semibold text-fg">
                      {selected.name}
                    </h2>
                    <p className="mt-1 font-mono text-xs text-muted">
                      {selected.slug}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(selected)}
                      className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-ink"
                    >
                      Abrir / Editar
                    </button>
                    {selected.publicUrl && (
                      <a
                        href={selected.publicUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-fg"
                      >
                        URL pública
                      </a>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted">
                  {selected.shortDescription || "Sin descripción."}
                </p>
                <div className="flex flex-wrap gap-2">
                  <RenewalBadge
                    days={selected.daysUntilRenewal}
                    status={selected.renewalStatus}
                  />
                  {selected.domainRenewsAt && (
                    <span className="text-xs text-muted">
                      Renueva: {selected.domainRenewsAt.slice(0, 10)}
                    </span>
                  )}
                </div>
                <dl className="grid gap-3 text-sm sm:grid-cols-2">
                  <Info label="Correo" value={selected.emailAddress} />
                  <Info label="Dominio" value={selected.domainPlatform} />
                  <Info label="Base de datos" value={selected.dbPlatform} />
                  <Info label="Deploy" value={selected.deployPlatform} />
                </dl>
              </div>
            )}

            {showForm && (
              <form
                className="space-y-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  void save();
                }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-display text-xl font-semibold text-fg">
                    {mode === "create" ? "Nuevo proyecto" : "Editar proyecto"}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {mode === "edit" && (
                      <button
                        type="button"
                        onClick={() => void removeProject()}
                        className="rounded-full border border-red-500/40 px-4 py-2 text-sm font-semibold text-red-600 dark:text-red-300"
                      >
                        Eliminar
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        if (selected) openView(selected);
                        else {
                          setMode("view");
                          setForm(emptyForm());
                        }
                      }}
                      className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-fg"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={saving || !form.name.trim()}
                      className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-ink disabled:opacity-50"
                    >
                      {saving ? "Guardando…" : "Guardar"}
                    </button>
                  </div>
                </div>

                <Section title="Identidad">
                  <Field
                    id="name"
                    label="Nombre"
                    value={form.name}
                    onChange={(v) => setField("name", v)}
                  />
                  <Field
                    id="slug"
                    label="Slug"
                    value={form.slug}
                    onChange={(v) => setField("slug", v)}
                    placeholder="mi-proyecto"
                  />
                  <div className="sm:col-span-2">
                    <Field
                      id="desc"
                      label="Descripción corta"
                      value={form.shortDescription}
                      onChange={(v) => setField("shortDescription", v)}
                      as="textarea"
                      rows={2}
                    />
                  </div>
                  <Field
                    id="url"
                    label="URL pública"
                    value={form.publicUrl}
                    onChange={(v) => setField("publicUrl", v)}
                    placeholder="https://"
                  />
                  <div>
                    <Field
                      id="logo"
                      label="Imagen / logotipo (URL)"
                      value={form.logoUrl}
                      onChange={(v) => setField("logoUrl", v)}
                    />
                    <label className="mt-2 inline-flex cursor-pointer text-xs font-semibold text-accent">
                      {uploading ? "Subiendo…" : "Subir a Supabase Storage"}
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        disabled={uploading}
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) void handleUpload(f);
                        }}
                      />
                    </label>
                  </div>
                </Section>

                <Section title="Correo">
                  <Field
                    id="email"
                    label="Correo del proyecto"
                    value={form.emailAddress}
                    onChange={(v) => setField("emailAddress", v)}
                    type="email"
                    placeholder="proyecto@gmail.com"
                  />
                  <PasswordField
                    id="email-pw"
                    label="Contraseña de correo"
                    value={form.emailPassword}
                    onChange={(v) => setField("emailPassword", v)}
                  />
                </Section>

                <Section title="Dominio">
                  <Field
                    id="dom-plat"
                    label="Plataforma del dominio"
                    value={form.domainPlatform}
                    onChange={(v) => setField("domainPlatform", v)}
                    placeholder="GoDaddy, Namecheap…"
                  />
                  <Field
                    id="dom-email"
                    label="Correo de la plataforma"
                    value={form.domainEmail}
                    onChange={(v) => setField("domainEmail", v)}
                    type="email"
                  />
                  <div className="sm:col-span-2">
                    <PasswordField
                      id="dom-pw"
                      label="Contraseña"
                      value={form.domainPassword}
                      onChange={(v) => setField("domainPassword", v)}
                    />
                  </div>
                </Section>

                <Section title="Base de datos">
                  <Field
                    id="db-plat"
                    label="Plataforma / motor"
                    value={form.dbPlatform}
                    onChange={(v) => setField("dbPlatform", v)}
                    placeholder="Supabase, Neon, PlanetScale…"
                  />
                  <Field
                    id="db-email"
                    label="Correo"
                    value={form.dbEmail}
                    onChange={(v) => setField("dbEmail", v)}
                    type="email"
                  />
                  <div className="sm:col-span-2">
                    <PasswordField
                      id="db-pw"
                      label="Contraseña"
                      value={form.dbPassword}
                      onChange={(v) => setField("dbPassword", v)}
                    />
                  </div>
                </Section>

                <Section title="Deploy">
                  <Field
                    id="dep-plat"
                    label="Plataforma de despliegue"
                    value={form.deployPlatform}
                    onChange={(v) => setField("deployPlatform", v)}
                    placeholder="Vercel / Netlify"
                  />
                  <Field
                    id="dep-email"
                    label="Correo"
                    value={form.deployEmail}
                    onChange={(v) => setField("deployEmail", v)}
                    type="email"
                  />
                  <div className="sm:col-span-2">
                    <PasswordField
                      id="dep-pw"
                      label="Contraseña"
                      value={form.deployPassword}
                      onChange={(v) => setField("deployPassword", v)}
                    />
                  </div>
                </Section>

                <Section title="Fechas">
                  <Field
                    id="reg"
                    label="Fecha de renta del dominio"
                    value={form.domainRegisteredAt}
                    onChange={(v) => setField("domainRegisteredAt", v)}
                    type="date"
                  />
                  <Field
                    id="ren"
                    label="Próxima renovación"
                    value={form.domainRenewsAt}
                    onChange={(v) => setField("domainRenewsAt", v)}
                    type="date"
                  />
                  <p className="sm:col-span-2 text-xs text-muted">
                    Si solo indicas la fecha de renta, la renovación se calcula
                    automáticamente a +1 año.
                  </p>
                </Section>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="text-xs tracking-[0.12em] text-muted uppercase">{label}</dt>
      <dd className="mt-1 text-fg">{value || "—"}</dd>
    </div>
  );
}
