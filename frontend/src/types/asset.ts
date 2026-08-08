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

export type AssetLifecycleStatus =
  | "active"
  | "suspended"
  | "archived";

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

  /*
   * Asset lifecycle
   *
   * Transitional field:
   * lifecycleStatus is optional during
   * the migration so existing Asset and
   * Machine repositories continue to work.
   *
   * During migration:
   * - missing lifecycleStatus + active=true
   *   should be interpreted as "active"
   * - missing lifecycleStatus + active=false
   *   should be interpreted as "suspended"
   *
   * Later, after all repositories and UI
   * use lifecycleStatus, this field can be
   * made required and active can be removed.
   */
  lifecycleStatus?: AssetLifecycleStatus;

  /*
   * Legacy compatibility.
   * Existing Dashboard, Analytics, PM,
   * Work Orders and Machine adapters still
   * depend on this field.
   */
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
   *
   * A department may also contain only
   * one machine with no children.
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

  /*
   * Optional during migration.
   * New Plant Structure code will provide
   * this explicitly.
   */
  lifecycleStatus?: AssetLifecycleStatus;

  /*
   * Kept temporarily for compatibility.
   */
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