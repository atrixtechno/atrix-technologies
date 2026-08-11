"use client";

import Image from "next/image";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { adminFetch } from "@/lib/admin-session";
import type { AdminProjectPublic } from "@/lib/admin-projects";
import {
  AdminAlert,
  AdminPageHeader,
  AdminPanel,
  AdminToolbar,
  Field,
  GhostButton,
  PasswordField,
  PrimaryButton,
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
  const [contractBusy, setContractBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminFetch("/api/admin/projects", {
        credentials: "same-origin",
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
  const renewWarn = projects.filter(
    (p) => p.renewalStatus === "warn" || p.renewalStatus === "danger",
  ).length;

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
      const res = await adminFetch("/api/admin/projects/upload", {
        method: "POST",
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

  async function handleContractUpload(projectId: string, file: File) {
    setContractBusy(true);
    setError(null);
    setMessage(null);
    try {
      const fd = new FormData();
      fd.set("file", file);
      const res = await adminFetch(`/api/admin/projects/${projectId}/contract`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al subir el contrato");
      setMessage(data.message || "Contrato PDF guardado.");
      await load();
      if (data.project?.id) setSelectedId(data.project.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al subir el contrato");
    } finally {
      setContractBusy(false);
    }
  }

  async function handleContractDownload(projectId: string) {
    setContractBusy(true);
    setError(null);
    try {
      const res = await adminFetch(`/api/admin/projects/${projectId}/contract`, {
        method: "GET",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo abrir el contrato");
      if (!data.downloadUrl) throw new Error("No hay enlace de descarga");
      window.open(data.downloadUrl, "_blank", "noopener,noreferrer");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al descargar el contrato");
    } finally {
      setContractBusy(false);
    }
  }

  async function handleContractDelete(projectId: string) {
    if (
      !window.confirm(
        "¿Eliminar el contrato PDF de este proyecto? Esta acción no se puede deshacer.",
      )
    ) {
      return;
    }
    setContractBusy(true);
    setError(null);
    setMessage(null);
    try {
      const res = await adminFetch(`/api/admin/projects/${projectId}/contract`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo eliminar el contrato");
      setMessage(data.message || "Contrato eliminado.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al eliminar el contrato");
    } finally {
      setContractBusy(false);
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
      const res = await adminFetch(url, {
        method: mode === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
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
      const res = await adminFetch(`/api/admin/projects/${selectedId}`, {
        method: "DELETE",
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
    <div className="space-y-5">
      <AdminPageHeader
        eyebrow="Proyecto"
        title="Vault de proyectos"
        description="Identidad, correo, dominio, base de datos, despliegue y contratos por proyecto. Las contraseñas se cifran en el servidor (AES-GCM) y solo se descifran con sesión admin."
        actions={
          configured ? (
            <PrimaryButton onClick={openCreate}>Añadir proyecto</PrimaryButton>
          ) : undefined
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Proyectos" value={loading ? "…" : String(projects.length)} />
        <StatCard
          label="Renovaciones próximas"
          value={loading ? "…" : String(renewWarn)}
          hint="Aviso o vencido"
        />
        <StatCard
          label="Resultados"
          value={loading ? "…" : String(filtered.length)}
          hint={query.trim() ? "Filtro activo" : "Sin filtro"}
        />
      </div>

      <AdminAlert tone="soft">
        Vault privado ATRIX. Las contraseñas se guardan cifradas y no se
        exponen fuera de esta sesión.
      </AdminAlert>

      {setupNote && <AdminAlert tone="info">{setupNote}</AdminAlert>}
      {error && <AdminAlert tone="error">{error}</AdminAlert>}
      {message && <AdminAlert tone="success">{message}</AdminAlert>}

      {!configured && !loading ? (
        <AdminPanel className="border-dashed p-10 text-center text-sm text-muted">
          Configura Supabase y la migración{" "}
          <code className="text-fg">20260811_admin_modules.sql</code> para
          activar el módulo.
        </AdminPanel>
      ) : (
        <div className="grid gap-5 xl:grid-cols-[minmax(280px,0.9fr)_minmax(0,1.3fr)]">
          <div className="space-y-3">
            <AdminToolbar>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nombre o slug…"
                className="min-w-0 flex-1 border border-line bg-bg px-3 py-2 text-sm text-fg outline-none transition focus:border-accent"
                aria-label="Buscar proyectos"
              />
              <span className="hidden text-xs text-muted sm:inline">
                {filtered.length} de {projects.length}
              </span>
            </AdminToolbar>

            <AdminPanel>
              <ul className="divide-y divide-line" role="list">
                {loading && (
                  <li className="px-5 py-12 text-center text-sm text-muted">
                    Cargando vault…
                  </li>
                )}
                {!loading &&
                  filtered.map((project) => {
                    const active = selectedId === project.id;
                    return (
                      <li key={project.id}>
                        <button
                          type="button"
                          onClick={() => openView(project)}
                          className={`flex w-full items-start gap-3 px-4 py-3.5 text-left transition ${
                            active
                              ? "border-l-2 border-l-accent bg-accent/10"
                              : "border-l-2 border-l-transparent hover:bg-bg/50"
                          }`}
                        >
                          <ProjectAvatar
                            name={project.name}
                            logoUrl={project.logoUrl}
                          />
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
                            <span className="mt-0.5 block truncate font-mono text-[11px] text-muted">
                              {project.slug}
                            </span>
                            <span className="mt-2 flex flex-wrap gap-1.5">
                              {project.domainPlatform && (
                                <MetaChip>{project.domainPlatform}</MetaChip>
                              )}
                              {project.deployPlatform && (
                                <MetaChip>{project.deployPlatform}</MetaChip>
                              )}
                              {project.contractUrl && (
                                <MetaChip accent>Contrato</MetaChip>
                              )}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                {!loading && filtered.length === 0 && (
                  <li className="px-5 py-12 text-center text-sm text-muted">
                    {query.trim()
                      ? "Ningún proyecto coincide con la búsqueda."
                      : "Sin proyectos todavía."}
                  </li>
                )}
              </ul>
            </AdminPanel>
          </div>

          <AdminPanel className="min-h-[420px]">
            {!showForm && !selected && (
              <div className="flex h-full min-h-[420px] flex-col items-center justify-center px-6 py-16 text-center">
                <p className="font-display text-lg font-semibold text-fg">
                  Selecciona un proyecto
                </p>
                <p className="mt-2 max-w-sm text-sm text-muted">
                  Revisa credenciales, renovaciones y contratos, o crea uno
                  nuevo desde la barra superior.
                </p>
                {configured && (
                  <PrimaryButton className="mt-5" onClick={openCreate}>
                    Añadir proyecto
                  </PrimaryButton>
                )}
              </div>
            )}

            {!showForm && selected && (
              <div className="space-y-6 p-4 md:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex min-w-0 items-start gap-4">
                    <ProjectAvatar
                      name={selected.name}
                      logoUrl={selected.logoUrl}
                      size="lg"
                    />
                    <div className="min-w-0">
                      <h2 className="font-display text-2xl font-semibold tracking-tight text-fg">
                        {selected.name}
                      </h2>
                      <p className="mt-1 font-mono text-xs text-muted">
                        {selected.slug}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
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
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <PrimaryButton onClick={() => openEdit(selected)}>
                      Abrir / Editar
                    </PrimaryButton>
                    {selected.publicUrl && (
                      <a
                        href={selected.publicUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-fg transition hover:border-accent/40 hover:text-accent"
                      >
                        URL pública
                      </a>
                    )}
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-muted">
                  {selected.shortDescription || "Sin descripción."}
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  <InfoCard label="Correo" value={selected.emailAddress} />
                  <InfoCard label="Dominio" value={selected.domainPlatform} />
                  <InfoCard label="Base de datos" value={selected.dbPlatform} />
                  <InfoCard label="Deploy" value={selected.deployPlatform} />
                </div>

                <ContractSection
                  project={selected}
                  busy={contractBusy}
                  onUpload={(file) => void handleContractUpload(selected.id, file)}
                  onDownload={() => void handleContractDownload(selected.id)}
                  onDelete={() => void handleContractDelete(selected.id)}
                />
              </div>
            )}

            {showForm && (
              <form
                className="space-y-4 p-4 md:p-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  void save();
                }}
              >
                <div className="sticky top-0 z-10 -mx-4 border-b border-line bg-bg-elevated/95 px-4 py-3 backdrop-blur md:-mx-6 md:px-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="font-display text-xl font-semibold text-fg">
                        {mode === "create" ? "Nuevo proyecto" : "Editar proyecto"}
                      </h2>
                      <p className="mt-0.5 text-xs text-muted">
                        Completa por secciones. Guarda cuando termines.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {mode === "edit" && (
                        <GhostButton danger onClick={() => void removeProject()}>
                          Eliminar
                        </GhostButton>
                      )}
                      <GhostButton
                        onClick={() => {
                          if (selected) openView(selected);
                          else {
                            setMode("view");
                            setForm(emptyForm());
                          }
                        }}
                      >
                        Cancelar
                      </GhostButton>
                      <PrimaryButton
                        type="submit"
                        disabled={saving || !form.name.trim()}
                      >
                        {saving ? "Guardando…" : "Guardar"}
                      </PrimaryButton>
                    </div>
                  </div>
                </div>

                <Section
                  title="Identidad"
                  description="Nombre público, slug, descripción y logotipo del proyecto."
                >
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
                    <label className="mt-2 inline-flex cursor-pointer text-xs font-semibold text-accent transition hover:brightness-110">
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
                    {form.logoUrl && (
                      <div className="relative mt-3 h-14 w-14 overflow-hidden border border-line bg-bg">
                        <Image
                          src={form.logoUrl}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="56px"
                          unoptimized
                        />
                      </div>
                    )}
                  </div>
                </Section>

                <Section
                  title="Correo"
                  description="Cuenta de correo asociada al proyecto."
                >
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

                <Section
                  title="Dominio"
                  description="Registrador y acceso a la plataforma del dominio."
                >
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

                <Section
                  title="Base de datos"
                  description="Motor o hosting y credenciales de acceso."
                >
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

                <Section
                  title="Deploy"
                  description="Plataforma de despliegue y acceso al panel."
                >
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

                <Section
                  title="Fechas"
                  description="Registro y próxima renovación del dominio."
                >
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

                {mode === "edit" && selectedId && (
                  <Section
                    title="Contrato"
                    description="PDF del contrato guardado de forma privada (máx. 10 MB)."
                    cols={1}
                  >
                    <ContractSection
                      embedded
                      project={
                        projects.find((p) => p.id === selectedId) ?? {
                          id: selectedId,
                          contractUrl: null,
                          contractFilename: null,
                          contractUploadedAt: null,
                        }
                      }
                      busy={contractBusy}
                      onUpload={(file) =>
                        void handleContractUpload(selectedId, file)
                      }
                      onDownload={() => void handleContractDownload(selectedId)}
                      onDelete={() => void handleContractDelete(selectedId)}
                    />
                  </Section>
                )}
              </form>
            )}
          </AdminPanel>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="border border-line bg-bg-elevated/70 px-4 py-3 backdrop-blur">
      <p className="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
        {label}
      </p>
      <p className="font-display mt-1 text-2xl font-semibold tabular-nums text-fg">
        {value}
      </p>
      {hint && <p className="mt-0.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}

function MetaChip({
  children,
  accent,
}: {
  children: ReactNode;
  accent?: boolean;
}) {
  return (
    <span
      className={`inline-flex border px-1.5 py-0.5 text-[10px] font-medium ${
        accent
          ? "border-accent/35 bg-accent/10 text-accent"
          : "border-line text-muted"
      }`}
    >
      {children}
    </span>
  );
}

function ProjectAvatar({
  name,
  logoUrl,
  size = "md",
}: {
  name: string;
  logoUrl: string | null;
  size?: "md" | "lg";
}) {
  const dim = size === "lg" ? "h-14 w-14" : "h-10 w-10";
  if (logoUrl) {
    return (
      <span
        className={`relative ${dim} shrink-0 overflow-hidden border border-line bg-bg`}
      >
        <Image
          src={logoUrl}
          alt=""
          fill
          className="object-cover"
          sizes={size === "lg" ? "56px" : "40px"}
          unoptimized
        />
      </span>
    );
  }
  return (
    <span
      className={`flex ${dim} shrink-0 items-center justify-center border border-line bg-bg text-xs font-semibold text-accent`}
      aria-hidden
    >
      {name.slice(0, 1).toUpperCase()}
    </span>
  );
}

function InfoCard({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="border border-line bg-bg/40 px-4 py-3">
      <dt className="text-[11px] font-semibold tracking-[0.12em] text-muted uppercase">
        {label}
      </dt>
      <dd className="mt-1.5 truncate text-sm text-fg">{value || "—"}</dd>
    </div>
  );
}

type ContractProjectBits = {
  id: string;
  contractUrl: string | null;
  contractFilename: string | null;
  contractUploadedAt: string | null;
};

function ContractSection({
  project,
  busy,
  onUpload,
  onDownload,
  onDelete,
  embedded = false,
}: {
  project: ContractProjectBits;
  busy: boolean;
  onUpload: (file: File) => void;
  onDownload: () => void;
  onDelete: () => void;
  embedded?: boolean;
}) {
  const hasContract = Boolean(project.contractUrl);

  const body = hasContract ? (
    <div className="space-y-3">
      <div className="flex items-start gap-3 border border-line bg-bg/40 px-3 py-3">
        <span
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center border border-accent/30 bg-accent/10 text-[10px] font-bold tracking-wide text-accent"
          aria-hidden
        >
          PDF
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-fg">
            {project.contractFilename || "contrato.pdf"}
          </p>
          {project.contractUploadedAt && (
            <p className="mt-0.5 text-xs text-muted">
              Subido: {project.contractUploadedAt.slice(0, 10)}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <GhostButton disabled={busy} onClick={onDownload}>
          Ver / Descargar
        </GhostButton>
        <label
          className={`inline-flex cursor-pointer rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-ink ${
            busy ? "pointer-events-none opacity-50" : ""
          }`}
        >
          {busy ? "Procesando…" : "Reemplazar PDF"}
          <input
            type="file"
            accept="application/pdf,.pdf"
            className="sr-only"
            disabled={busy}
            onChange={(e) => {
              const f = e.target.files?.[0];
              e.target.value = "";
              if (f) onUpload(f);
            }}
          />
        </label>
        <GhostButton danger disabled={busy} onClick={onDelete}>
          Eliminar
        </GhostButton>
      </div>
    </div>
  ) : (
    <label
      className={`inline-flex cursor-pointer rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink ${
        busy ? "pointer-events-none opacity-50" : ""
      }`}
    >
      {busy ? "Subiendo…" : "Subir contrato (PDF)"}
      <input
        type="file"
        accept="application/pdf,.pdf"
        className="sr-only"
        disabled={busy}
        onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (f) onUpload(f);
        }}
      />
    </label>
  );

  if (embedded) return body;

  return (
    <section className="border border-line bg-bg/40">
      <div className="border-b border-line px-4 py-3">
        <h3 className="text-[11px] font-semibold tracking-[0.16em] text-accent uppercase">
          Contrato PDF
        </h3>
        <p className="mt-1 text-xs text-muted">
          Documento privado vinculado al proyecto (máx. 10 MB).
        </p>
      </div>
      <div className="p-4">{body}</div>
    </section>
  );
}
