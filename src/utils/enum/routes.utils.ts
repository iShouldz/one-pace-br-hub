export const RoutesUrl = {
  HOME: "/",
  SAGA_DETAILS: "/saga/:sagaId",
  ARC_DETAILS: "/saga/:sagaId/:arcId",
  ARC_DETAILS_LEGACY: "/arc/:arcId",
}

export const routePath = {
  sagaDetails: (sagaId: string) => `/saga/${sagaId}`,
  arcDetails: (sagaId: string, arcId: string) => `/saga/${sagaId}/${arcId}`,
}
