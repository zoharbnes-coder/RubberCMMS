export type AssetCriticality =
  | "critical"
  | "high"
  | "medium"
  | "low";

export type AssetStatus =
  | "running"
  | "warning"
  | "alarm"
  | "maintenance";

export type AssetType =
  | "machine"
  | "production-line"
  | "mixer"
  | "mill"
  | "press"
  | "injection-machine"
  | "extruder"
  | "conveyor"
  | "pump"
  | "compressor"
  | "chiller"
  | "cooling-tower"
  | "boiler"
  | "electrical-panel"
  | "utility"
  | "building"
  | "area"
  | "component"
  | "other";

export type AssetMeterType =
  | "operating-hours"
  | "cycles"
  | "production-quantity"
  | "energy"
  | "distance"
  | "custom";

export type AssetHierarchyLevel =
  | "plant"
  | "department"
  | "area"
  | "production-line"
  | "asset"
  | "sub-asset"
  | "component";

export type AssetMeter = {
  id: string;

  name: string;
  type: AssetMeterType;
  unit: string;

  currentValue: number;
  lastUpdatedAt: string;

  active: boolean;
};

export type AssetSpecification = {
  id: string;

  name: string;
  value: string;
  unit: string;

  category: string;
};

export type Asset = {
  id: string;

  /*
   * Asset identification
   */
  assetNumber: string;
  assetCode: string;

  displayName: string;
  shortName: string;

  /*
   * Asset classification
   */
  assetType: AssetType;
  hierarchyLevel: AssetHierarchyLevel;

  criticality: AssetCriticality;
  status: AssetStatus;

  active: boolean;

  /*
   * Organizational location
   */
  plant: string;
  department: string;
  area: string;
  location: string;

  /*
   * Asset hierarchy
   *
   * parentAssetId:
   * The direct parent of the asset.
   *
   * rootAssetId:
   * The highest asset in the hierarchy.
   *
   * Example:
   * Mixing Line
   *   └─ Mixer
   *       └─ Gearbox
   *           └─ Bearing
   */
  parentAssetId: string | null;
  rootAssetId: string | null;

  /*
   * Manufacturer information
   */
  manufacturer: string;
  model: string;
  serialNumber: string;

  installationDate: string;
  warrantyExpirationDate: string;

  /*
   * Operational data
   */
  openWorkOrders: number;
  downtimeWorkOrders: number;

  mttrHours: number;
  mtbfHours: number;
  availability: number;

  /*
   * Maintenance information
   */
  preventivePlanCount: number;
  sparePartsCount: number;

  /*
   * Documentation
   */
  drawings: number;
  manuals: number;
  images: number;

  /*
   * Asset structure and measurements
   */
  specifications: AssetSpecification[];
  meters: AssetMeter[];

  /*
   * General notes
   */
  description: string;
  notes: string;

  /*
   * Audit information
   */
  createdAt: string;
  updatedAt: string;
};

export type CreateAssetInput = {
  assetNumber: string;
  assetCode: string;

  displayName: string;
  shortName: string;

  assetType: AssetType;
  hierarchyLevel: AssetHierarchyLevel;

  criticality: AssetCriticality;
  status: AssetStatus;

  active: boolean;

  plant: string;
  department: string;
  area: string;
  location: string;

  parentAssetId: string | null;
  rootAssetId: string | null;

  manufacturer: string;
  model: string;
  serialNumber: string;

  installationDate: string;
  warrantyExpirationDate: string;

  description: string;
  notes: string;
};

export type UpdateAssetInput =
  Partial<CreateAssetInput>;

export type AssetRepositoryResult = {
  success: boolean;
  asset: Asset | null;
  message: string;
};