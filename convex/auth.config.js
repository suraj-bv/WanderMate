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

const applicationIds = [
  "convex",
  // Clerk session tokens in this app commonly include the site origin as azp.
  "https://wandermate.surajbv.me",
].filter(Boolean);

const uniqueIssuers = [...new Set(issuers)];
const uniqueApplicationIds = [...new Set(applicationIds)];

export default {
  providers: uniqueIssuers.flatMap((domain) =>
    uniqueApplicationIds.map((applicationID) => ({
      domain,
      applicationID,
    })),
  ),
};
