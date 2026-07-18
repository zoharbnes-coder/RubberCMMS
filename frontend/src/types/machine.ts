import type {
  Asset,
  AssetCriticality,
  AssetStatus,
} from "./asset";

/*
 * Compatibility aliases
 *
 * הקוד הקיים עדיין משתמש בשמות:
 * MachineCriticality
 * MachineStatus
 *
 * בפועל הם מבוססים כעת על מודל Asset.
 */
export type MachineCriticality =
  AssetCriticality;

export type MachineStatus =
  AssetStatus;

/*
 * Machine הוא סוג ממוקד של Asset.
 *
 * בשלב המעבר אנחנו שומרים על השדה:
 * machineCode
 *
 * במקום:
 * assetCode
 *
 * כך שכל המסכים, השירותים והרכיבים הקיימים
 * ימשיכו לעבוד ללא שינוי.
 */
export type Machine = Omit<
  Asset,
  | "assetCode"
  | "assetType"
  | "hierarchyLevel"
  | "plant"
  | "parentAssetId"
  | "rootAssetId"
  | "warrantyExpirationDate"
  | "specifications"
  | "meters"
  | "description"
  | "notes"
  | "createdAt"
  | "updatedAt"
> & {
  machineCode: string;
};

/*
 * המרה ממכונה ישנה לנכס חדש.
 *
 * הפונקציה מאפשרת בהמשך להעביר בהדרגה
 * רכיבים ושירותים לעבודה מול Asset.
 */
export function machineToAsset(
  machine: Machine
): Asset {
  const now =
    new Date().toISOString();

  return {
    id: machine.id,

    assetNumber:
      machine.assetNumber,

    assetCode:
      machine.machineCode,

    displayName:
      machine.displayName,

    shortName:
      machine.shortName,

    assetType: "machine",
    hierarchyLevel: "asset",

    criticality:
      machine.criticality,

    status:
      machine.status,

    active:
      machine.active,

    plant: "",

    department:
      machine.department,

    area:
      machine.area,

    location:
      machine.location,

    parentAssetId: null,
    rootAssetId: null,

    manufacturer:
      machine.manufacturer,

    model:
      machine.model,

    serialNumber:
      machine.serialNumber,

    installationDate:
      machine.installationDate,

    warrantyExpirationDate: "",

    openWorkOrders:
      machine.openWorkOrders,

    downtimeWorkOrders:
      machine.downtimeWorkOrders,

    mttrHours:
      machine.mttrHours,

    mtbfHours:
      machine.mtbfHours,

    availability:
      machine.availability,

    preventivePlanCount:
      machine.preventivePlanCount,

    sparePartsCount:
      machine.sparePartsCount,

    drawings:
      machine.drawings,

    manuals:
      machine.manuals,

    images:
      machine.images,

    specifications: [],
    meters: [],

    description: "",
    notes: "",

    createdAt: now,
    updatedAt: now,
  };
}

/*
 * המרה מנכס כללי למכונה.
 *
 * כרגע הפונקציה מיועדת לנכסים מסוג מכונה
 * או לנכסים שצריכים להופיע במסכים הישנים.
 */
export function assetToMachine(
  asset: Asset
): Machine {
  return {
    id: asset.id,

    assetNumber:
      asset.assetNumber,

    machineCode:
      asset.assetCode,

    displayName:
      asset.displayName,

    shortName:
      asset.shortName,

    department:
      asset.department,

    area:
      asset.area,

    location:
      asset.location,

    manufacturer:
      asset.manufacturer,

    model:
      asset.model,

    serialNumber:
      asset.serialNumber,

    installationDate:
      asset.installationDate,

    criticality:
      asset.criticality,

    active:
      asset.active,

    status:
      asset.status,

    openWorkOrders:
      asset.openWorkOrders,

    downtimeWorkOrders:
      asset.downtimeWorkOrders,

    mttrHours:
      asset.mttrHours,

    mtbfHours:
      asset.mtbfHours,

    availability:
      asset.availability,

    preventivePlanCount:
      asset.preventivePlanCount,

    sparePartsCount:
      asset.sparePartsCount,

    drawings:
      asset.drawings,

    manuals:
      asset.manuals,

    images:
      asset.images,
  };
}