const URI_USER_SVC = process.env.URI_USER_SVC || "http://localhost:8000";
export const URI_MATCH_SVC = process.env.URI_MATCH_SVC || "http://localhost:8001";
export const URI_COLLAB_SVC = process.env.URI_COLLAB_SVC || "http://localhost:8050";

const PREFIX_USER_SVC = "/api/user";
const PREFIX_MATCH_SVC = "/api/match";
const PREFIX_COLLAB_SVC = "/api/collab";

export const URL_USER_SVC = URI_USER_SVC + PREFIX_USER_SVC;
export const URL_MATCH_SVC = URI_MATCH_SVC + PREFIX_MATCH_SVC;
export const URL_COLLAB_SVC = URI_COLLAB_SVC + PREFIX_COLLAB_SVC;
