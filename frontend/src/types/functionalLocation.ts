export type FunctionalLocationType =
  | "plant"
  | "building"
  | "hall"
  | "department"
  | "production-line"
  | "room"
  | "area"
  | "warehouse"
  | "utility"
  | "laboratory"
  | "office"
  | "custom";

export type FunctionalLocationStatus =
  | "active"
  | "inactive";

export type FunctionalLocation = {
  id: string;

  /*
   * Identification
   */

  locationNumber: string;
  locationCode: string;

  displayName: string;
  shortName: string;

  /*
   * Classification
   */

  type: FunctionalLocationType;

  status: FunctionalLocationStatus;

  active: boolean;

  /*
   * Hierarchy
   */

  plantId: string;

  parentLocationId: string | null;

  rootLocationId: string | null;

  level: number;

  /*
   * Description
   */

  description: string;

  notes: string;

  /*
   * Statistics
   */

  assetCount: number;

  activeAssetCount: number;

  childLocationCount: number;

  /*
   * Audit
   */

  createdAt: string;

  updatedAt: string;
};

export type CreateFunctionalLocationInput =
  Omit<
    FunctionalLocation,
    | "id"
    | "assetCount"
    | "activeAssetCount"
    | "childLocationCount"
    | "createdAt"
    | "updatedAt"
  >;

export type UpdateFunctionalLocationInput =
  Partial<CreateFunctionalLocationInput>;

export type FunctionalLocationRepositoryResult =
  {
    success: boolean;

    location:
      | FunctionalLocation
      | null;

    message: string;
  };