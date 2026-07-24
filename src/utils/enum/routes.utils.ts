export const RoutesUrl = {
  HOME: "/",
  ERROR: "/error",
  RELEASES: "/releases",
  SAGA_DETAILS: "/saga/:sagaId",
  ARC_DETAILS_LEGACY: "/arc/:arcId",
  ARC_DETAILS: "/saga/:sagaId/:arcId",
}

export const routePath = {
  sagaDetails: (sagaId: string) => `/saga/${sagaId}`,
  arcDetails: (sagaId: string, arcId: string) => `/saga/${sagaId}/${arcId}`,
}
