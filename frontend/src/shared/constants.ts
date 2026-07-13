/**
 * Shared cross-feature constants. Currently just the demo stadium ID, which
 * was previously duplicated as an identical literal in three separate
 * hooks (useAssistantChat, useRoute, useCrowdData) — a single source of
 * truth here means it can't drift out of sync between them.
 */
export const DEFAULT_STADIUM_ID = "stadium-atl-01";
