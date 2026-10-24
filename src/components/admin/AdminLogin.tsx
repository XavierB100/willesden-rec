import { ArrowUpRight, KeyRound } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Field } from "./Field";
import type { AdminWorkspace } from "./useAdminWorkspace";

export function AdminLogin({ workspace: w }: { workspace: AdminWorkspace }) {
  return (
    <div className="admin-login">
      <div className="login-story">
        <p className="eyebrow">Willesden Reclamation</p>
        <h1>
          The yard,
          <br />
          <em>at your fingertips.</em>
        </h1>
        <p>
          A little less admin.
          <br />A little more time for the next great find.
        </p>
        <Link href="/" className="text-link">
          Back to the website <ArrowUpRight size={16} />
        </Link>
      </div>
      <div className="login-form-wrap">
        <form onSubmit={w.handleLogin} className="login-form">
          <KeyRound size={26} className="text-forest-green" />
          <p className="eyebrow">Owner workspace</p>
          <h2>Welcome back.</h2>
          <p className="text-sm text-vintage-charcoal/75">
            Sign in to look after your stock and the yard’s details.
          </p>
          {w.error && (
            <p className="admin-feedback error" role="alert">
              {w.error}
            </p>
          )}
          <Field label="Email address">
            <input
              type="email"
              autoComplete="username"
              required
              value={w.email}
              onChange={(event) => w.setEmail(event.target.value)}
            />
          </Field>
          <Field label="Password">
            <input
              type="password"
              autoComplete="current-password"
              required
              value={w.password}
              onChange={(event) => w.setPassword(event.target.value)}
            />
          </Field>
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={w.isLoading}
          >
            {w.isLoading ? "Signing in…" : "Sign in to your workspace"}
          </Button>
          <p className="text-xs text-vintage-charcoal/80">
            Private access for the yard owner.
          </p>
        </form>
      </div>
    </div>
  );
}
