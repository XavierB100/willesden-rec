"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  LayoutGrid,
  Plus,
  MapPin,
  LogOut,
  Leaf,
} from "lucide-react";
import { useAdminWorkspace } from "./useAdminWorkspace";
import { AdminLogin } from "./AdminLogin";
import { Inventory } from "./Inventory";
import { ProductEditor } from "./ProductEditor";
import { SiteDetails } from "./SiteDetails";

export function AdminWorkspace() {
  const w = useAdminWorkspace();
  if (!w.configured)
    return (
      <div className="site-container section-space">
        <h1 className="font-serif text-3xl">
          The workspace isn’t configured yet.
        </h1>
        <p>Please contact your website maintainer to finish the setup.</p>
      </div>
    );
  if (!w.authReady)
    return (
      <div className="site-container section-space" role="status">
        Opening your workspace…
      </div>
    );
  if (!w.session) return <AdminLogin workspace={w} />;
  return (
    <div className="admin-shell">
      <aside className="admin-navigation">
        <Link href="/" className="admin-brand">
          <span className="admin-monogram">WR</span>
          <span>
            Willesden
            <br />
            <small>THE OWNER WORKSPACE</small>
          </span>
        </Link>
        <p className="eyebrow">At the yard</p>
        <nav aria-label="Workspace sections">
          <button
            aria-current={w.view === "inventory" ? "page" : undefined}
            onClick={() => w.setView("inventory")}
          >
            <LayoutGrid size={19} /> Inventory{" "}
            <span className="nav-count">{w.products.length}</span>
          </button>
          <button
            aria-current={w.view === "editor" ? "page" : undefined}
            onClick={() => w.setView("editor")}
          >
            <Plus size={19} />
            {w.productForm.id ? "Product editor" : "Add a product"}
            {w.productDirty && (
              <span className="draft-dot" aria-label="Unsaved product" />
            )}
          </button>
          <button
            aria-current={w.view === "settings" ? "page" : undefined}
            onClick={() => w.setView("settings")}
          >
            <MapPin size={19} /> Yard details{" "}
            {w.settingsDirty && (
              <span className="draft-dot" aria-label="Unsaved settings" />
            )}
          </button>
        </nav>
        <div className="admin-nav-bottom">
          <div className="admin-note">
            <Leaf size={22} />
            <p>
              Good things deserve
              <br />a second chapter.
            </p>
          </div>
          <Link href="/" target="_blank">
            <ArrowUpRight size={17} /> View website
          </Link>
          <button
            onClick={w.handleLogout}
            disabled={w.isLoading || w.isUploading}
          >
            <LogOut size={17} /> Sign out
          </button>
        </div>
      </aside>
      <div className="admin-body">
        <header className="workspace-topbar">
          <span>
            Willesden Reclamation <span className="topbar-divider">/</span>{" "}
            Owner workspace
          </span>
          <Link href="/" target="_blank">
            View site <ArrowUpRight size={15} />
          </Link>
        </header>
        <div className="workspace-content">
          {(w.message || w.error) && (
            <div
              role={w.error ? "alert" : "status"}
              className={`admin-feedback ${w.error ? "error" : ""}`}
            >
              {w.error || w.message}
            </div>
          )}
          {w.view === "inventory" && <Inventory workspace={w} />}
          {w.view === "editor" && <ProductEditor workspace={w} />}
          {w.view === "settings" && <SiteDetails workspace={w} />}
        </div>
      </div>
    </div>
  );
}
