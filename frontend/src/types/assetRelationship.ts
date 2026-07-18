export type AssetRelationshipType =
  | "contains"
  | "installed-in"
  | "feeds"
  | "powered-by"
  | "controls"
  | "drives"
  | "connected-to"
  | "backup-for"
  | "depends-on"
  | "monitors"
  | "cools"
  | "heats"
  | "supplies"
  | "other";

export type AssetRelationship = {
  id: string;

  /*
   * Source Asset
   */
  sourceAssetId: string;

  /*
   * Target Asset
   */
  targetAssetId: string;

  /*
   * Relationship
   */
  relationshipType:
    AssetRelationshipType;

  /*
   * Information
   */

  bidirectional: boolean;

  active: boolean;

  description: string;

  /*
   * Audit
   */

  createdAt: string;

  updatedAt: string;
};

export type CreateAssetRelationshipInput =
  Omit<
    AssetRelationship,
    | "id"
    | "createdAt"
    | "updatedAt"
  >;

export type UpdateAssetRelationshipInput =
  Partial<CreateAssetRelationshipInput>;

export type AssetRelationshipRepositoryResult =
  {
    success: boolean;

    relationship:
      | AssetRelationship
      | null;

    message: string;
  };
  