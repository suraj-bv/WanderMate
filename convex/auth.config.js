const primaryIssuer = process.env.CLERK_JWT_ISSUER_DOMAIN;
const legacyFrontendApi = process.env.CLERK_FRONTEND_API_URL;

const issuers = [
  primaryIssuer,
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
