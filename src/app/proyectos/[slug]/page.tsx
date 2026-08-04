import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProjectCase } from "@/components/ProjectCase";
import { ProjectThemeShell } from "@/components/ProjectThemeShell";
import { getProject, projects } from "@/content/projects";
import { site } from "@/content/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const ogImage = project.previewImage
    ? project.previewImage.startsWith("http")
      ? project.previewImage
      : `https://atrixnld.com${project.previewImage}`
    : "https://atrixnld.com/brand/og-atrix-v2.png";
  const ogSize = project.previewImage
    ? { width: 1200, height: 720 }
    : { width: 1200, height: 630 };
  return {
    title: project.seoTitle,
    description: project.seoDescription,
    keywords: project.keywords,
    alternates: { canonical: `/proyectos/${project.slug}` },
    openGraph: {
      title: project.seoTitle,
      description: project.seoDescription,
      url: `${site.url}/proyectos/${project.slug}`,
      type: "article",
      images: [{ url: ogImage, ...ogSize }],
    },
    twitter: {
      card: "summary_large_image",
      title: project.seoTitle,
      description: project.seoDescription,
      images: [ogImage],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CaseStudy",
    name: project.name,
    description: project.seoDescription,
    url: `${site.url}/proyectos/${project.slug}`,
    creator: {
      "@type": "Organization",
      name: site.legalName,
      url: site.url,
    },
    about: project.sector,
    keywords: project.keywords.join(", "),
    inLanguage: "es-MX",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header solid />
      <ProjectThemeShell theme={project.theme} themeDark={project.themeDark}>
        <ProjectCase project={project} />
      </ProjectThemeShell>
      <Footer />
    </>
  );
}
