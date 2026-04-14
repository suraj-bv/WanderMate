const primaryIssuer = process.env.CLERK_JWT_ISSUER_DOMAIN;
const legacyIssuer = process.env.CLERK_ISSUER_URL;
const legacyFrontendApi = process.env.CLERK_FRONTEND_API_URL;

const issuers = [
  primaryIssuer,
  legacyIssuer,
  legacyFrontendApi,
  // Safe default for this project's production Clerk Frontend API URL.
  "https://clerk.wandermate.surajbv.me",
].filter(Boolean);

export default {
  providers: issuers.map((domain) => ({
    domain,
    applicationID: "convex",
  })),
};
