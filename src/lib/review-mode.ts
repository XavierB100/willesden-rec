export function reviewStockEnabled(context: string | undefined, enabled: string | undefined) {
  return context === "deploy-preview" && enabled === "true";
}

export function isReviewStockEnabled() {
  // This public boolean is frozen by next.config.ts during the build. Netlify
  // build-context/toml variables are not available to Functions at runtime.
  return process.env.REVIEW_CATALOGUE_ENABLED === "true";
}
