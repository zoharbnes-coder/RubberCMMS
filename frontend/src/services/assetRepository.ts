import {
  getMachines,
} from "./machineRepository";

import {
  machineToAsset,
} from "../types/machine";

import type {
  Asset,
  AssetCriticality,
  AssetHierarchyLevel,
  AssetRepositoryResult,
  AssetStatus,
  AssetType,
  CreateAssetInput,
  UpdateAssetInput,
} from "../types/asset";

const STORAGE_KEY =
  "rubbermip_asset_repository_v1";

const ASSETS_CHANGED_EVENT =
  "rubbermip-assets-changed";

function createId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `asset-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

function normalizeText(
  value: string
): string {
  return value.trim();
}

function normalizeCode(
  value: string
): string {
  return normalizeText(value).toUpperCase();
}

function normalizeAssetNumber(
  value: string
): string {
  return normalizeText(value);
}

function isAssetCriticality(
  value: unknown
): value is AssetCriticality {
  return (
    value === "critical" ||
    value === "high" ||
    value === "medium" ||
    value === "low"
  );
}

function isAssetStatus(
  value: unknown
): value is AssetStatus {
  return (
    value === "running" ||
    value === "warning" ||
    value === "alarm" ||
    value === "maintenance"
  );
}

function isAssetType(
  value: unknown
): value is AssetType {
  return (
    value === "machine" ||
    value === "production-line" ||
    value === "mixer" ||
    value === "mill" ||
    value === "press" ||
    value === "injection-machine" ||
    value === "extruder" ||
    value === "conveyor" ||
    value === "pump" ||
    value === "compressor" ||
    value === "chiller" ||
    value === "cooling-tower" ||
    value === "boiler" ||
    value === "electrical-panel" ||
    value === "utility" ||
    value === "building" ||
    value === "area" ||
    value === "component" ||
    value === "other"
  );
}

function isAssetHierarchyLevel(
  value: unknown
): value is AssetHierarchyLevel {
  return (
    value === "plant" ||
    value === "department" ||
    value === "area" ||
    value === "production-line" ||
    value === "asset" ||
    value === "sub-asset" ||
    value === "component"
  );
}

function isAsset(
  value: unknown
): value is Asset {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const asset =
    value as Partial<Asset>;

  return (
    typeof asset.id === "string" &&
    typeof asset.assetNumber === "string" &&
    typeof asset.assetCode === "string" &&
    typeof asset.displayName === "string" &&
    typeof asset.shortName === "string" &&
    isAssetType(asset.assetType) &&
    isAssetHierarchyLevel(
      asset.hierarchyLevel
    ) &&
    isAssetCriticality(
      asset.criticality
    ) &&
    isAssetStatus(asset.status) &&
    typeof asset.active === "boolean"
  );
}

function sanitizeNumber(
  value: number,
  fallback = 0
): number {
  if (!Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(0, value);
}

function sanitizeAvailability(
  value: number
): number {
  if (!Number.isFinite(value)) {
    return 100;
  }

  return Math.max(
    0,
    Math.min(100, value)
  );
}

function sanitizeAsset(
  asset: Asset
): Asset {
  const now =
    getCurrentTimestamp();

  return {
    ...asset,

    id:
      normalizeText(asset.id) ||
      createId(),

    assetNumber:
      normalizeAssetNumber(
        asset.assetNumber
      ),

    assetCode:
      normalizeCode(
        asset.assetCode
      ),

    displayName:
      normalizeText(
        asset.displayName
      ),

    shortName:
      normalizeText(
        asset.shortName
      ) ||
      normalizeText(
        asset.displayName
      ),

    assetType:
      isAssetType(asset.assetType)
        ? asset.assetType
        : "other",

    hierarchyLevel:
      isAssetHierarchyLevel(
        asset.hierarchyLevel
      )
        ? asset.hierarchyLevel
        : "asset",

    criticality:
      isAssetCriticality(
        asset.criticality
      )
        ? asset.criticality
        : "medium",

    status:
      isAssetStatus(asset.status)
        ? asset.status
        : "running",

    active:
      Boolean(asset.active),

    plant:
      normalizeText(asset.plant),

    department:
      normalizeText(
        asset.department
      ),

    area:
      normalizeText(asset.area),

    location:
      normalizeText(
        asset.location
      ),

    parentAssetId:
      asset.parentAssetId
        ? normalizeText(
            asset.parentAssetId
          )
        : null,

    rootAssetId:
      asset.rootAssetId
        ? normalizeText(
            asset.rootAssetId
          )
        : null,

    manufacturer:
      normalizeText(
        asset.manufacturer
      ),

    model:
      normalizeText(asset.model),

    serialNumber:
      normalizeText(
        asset.serialNumber
      ),

    installationDate:
      normalizeText(
        asset.installationDate
      ),

    warrantyExpirationDate:
      normalizeText(
        asset.warrantyExpirationDate
      ),

    openWorkOrders:
      sanitizeNumber(
        asset.openWorkOrders
      ),

    downtimeWorkOrders:
      sanitizeNumber(
        asset.downtimeWorkOrders
      ),

    mttrHours:
      sanitizeNumber(
        asset.mttrHours
      ),

    mtbfHours:
      sanitizeNumber(
        asset.mtbfHours
      ),

    availability:
      sanitizeAvailability(
        asset.availability
      ),

    preventivePlanCount:
      sanitizeNumber(
        asset.preventivePlanCount
      ),

    sparePartsCount:
      sanitizeNumber(
        asset.sparePartsCount
      ),

    drawings:
      sanitizeNumber(
        asset.drawings
      ),

    manuals:
      sanitizeNumber(
        asset.manuals
      ),

    images:
      sanitizeNumber(
        asset.images
      ),

    specifications:
      Array.isArray(
        asset.specifications
      )
        ? asset.specifications
        : [],

    meters:
      Array.isArray(asset.meters)
        ? asset.meters
        : [],

    description:
      normalizeText(
        asset.description
      ),

    notes:
      normalizeText(asset.notes),

    createdAt:
      normalizeText(
        asset.createdAt
      ) || now,

    updatedAt:
      normalizeText(
        asset.updatedAt
      ) || now,
  };
}

function createInitialAssets():
  Asset[] {
  const machines =
    getMachines();

  return machines.map(
    (machine) =>
      sanitizeAsset(
        machineToAsset(machine)
      )
  );
}

function notifyAssetChanges(): void {
  if (
    typeof window === "undefined"
  ) {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(
      ASSETS_CHANGED_EVENT
    )
  );
}

function saveAssets(
  assets: Asset[]
): void {
  if (
    typeof localStorage ===
    "undefined"
  ) {
    return;
  }

  const sanitizedAssets =
    assets.map(sanitizeAsset);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      sanitizedAssets
    )
  );

  notifyAssetChanges();
}

function loadAssets(): Asset[] {
  if (
    typeof localStorage ===
    "undefined"
  ) {
    return createInitialAssets();
  }

  const storedValue =
    localStorage.getItem(
      STORAGE_KEY
    );

  if (!storedValue) {
    const initialAssets =
      createInitialAssets();

    saveAssets(initialAssets);

    return initialAssets;
  }

  try {
    const parsedValue: unknown =
      JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      throw new Error(
        "Asset repository is not an array"
      );
    }

    const validAssets =
      parsedValue
        .filter(isAsset)
        .map(sanitizeAsset);

    if (
      validAssets.length === 0
    ) {
      const initialAssets =
        createInitialAssets();

      saveAssets(initialAssets);

      return initialAssets;
    }

    return validAssets;
  } catch {
    const initialAssets =
      createInitialAssets();

    saveAssets(initialAssets);

    return initialAssets;
  }
}

function validateRequiredFields(
  input: CreateAssetInput
): string | null {
  if (
    !normalizeText(
      input.assetNumber
    )
  ) {
    return "חובה להזין מספר נכס.";
  }

  if (
    !normalizeText(
      input.assetCode
    )
  ) {
    return "חובה להזין קוד נכס.";
  }

  if (
    !normalizeText(
      input.displayName
    )
  ) {
    return "חובה להזין שם נכס.";
  }

  if (
    !normalizeText(
      input.department
    )
  ) {
    return "חובה להזין מחלקה.";
  }

  return null;
}

function findDuplicateAssetNumber(
  assets: Asset[],
  assetNumber: string,
  excludedAssetId?: string
): Asset | undefined {
  const normalizedValue =
    normalizeAssetNumber(
      assetNumber
    ).toLowerCase();

  return assets.find(
    (asset) =>
      asset.id !==
        excludedAssetId &&
      asset.assetNumber
        .toLowerCase() ===
        normalizedValue
  );
}

function findDuplicateAssetCode(
  assets: Asset[],
  assetCode: string,
  excludedAssetId?: string
): Asset | undefined {
  const normalizedValue =
    normalizeCode(
      assetCode
    ).toLowerCase();

  return assets.find(
    (asset) =>
      asset.id !==
        excludedAssetId &&
      asset.assetCode
        .toLowerCase() ===
        normalizedValue
  );
}

function getRootAssetId(
  assets: Asset[],
  parentAssetId: string | null
): string | null {
  if (!parentAssetId) {
    return null;
  }

  const parentAsset =
    assets.find(
      (asset) =>
        asset.id === parentAssetId
    );

  if (!parentAsset) {
    return null;
  }

  return (
    parentAsset.rootAssetId ??
    parentAsset.id
  );
}

function createsHierarchyCycle(
  assets: Asset[],
  assetId: string,
  parentAssetId: string | null
): boolean {
  if (!parentAssetId) {
    return false;
  }

  if (
    assetId === parentAssetId
  ) {
    return true;
  }

  let currentParentId:
    string | null =
    parentAssetId;

  const visitedIds =
    new Set<string>();

  while (currentParentId) {
    if (
      currentParentId === assetId
    ) {
      return true;
    }

    if (
      visitedIds.has(
        currentParentId
      )
    ) {
      return true;
    }

    visitedIds.add(
      currentParentId
    );

    const parent =
      assets.find(
        (asset) =>
          asset.id ===
          currentParentId
      );

    if (!parent) {
      return false;
    }

    currentParentId =
      parent.parentAssetId;
  }

  return false;
}

function buildAsset(
  input: CreateAssetInput,
  assets: Asset[]
): Asset {
  const now =
    getCurrentTimestamp();

  const assetId =
    createId();

  const parentAssetId =
    input.parentAssetId || null;

  return sanitizeAsset({
    id: assetId,

    assetNumber:
      input.assetNumber,

    assetCode:
      input.assetCode,

    displayName:
      input.displayName,

    shortName:
      input.shortName ||
      input.displayName,

    assetType:
      input.assetType,

    hierarchyLevel:
      input.hierarchyLevel,

    criticality:
      input.criticality,

    status:
      input.status,

    active:
      input.active,

    plant:
      input.plant,

    department:
      input.department,

    area:
      input.area,

    location:
      input.location,

    parentAssetId,

    rootAssetId:
      getRootAssetId(
        assets,
        parentAssetId
      ),

    manufacturer:
      input.manufacturer,

    model:
      input.model,

    serialNumber:
      input.serialNumber,

    installationDate:
      input.installationDate,

    warrantyExpirationDate:
      input.warrantyExpirationDate,

    openWorkOrders: 0,
    downtimeWorkOrders: 0,

    mttrHours: 0,
    mtbfHours: 0,
    availability: 100,

    preventivePlanCount: 0,
    sparePartsCount: 0,

    drawings: 0,
    manuals: 0,
    images: 0,

    specifications: [],
    meters: [],

    description:
      input.description,

    notes:
      input.notes,

    createdAt: now,
    updatedAt: now,
  });
}

function updateDescendantRootIds(
  assets: Asset[],
  parentAssetId: string,
  rootAssetId: string
): Asset[] {
  const directChildren =
    assets.filter(
      (asset) =>
        asset.parentAssetId ===
        parentAssetId
    );

  let updatedAssets =
    assets.map((asset) => {
      if (
        asset.parentAssetId !==
        parentAssetId
      ) {
        return asset;
      }

      return {
        ...asset,
        rootAssetId,
        updatedAt:
          getCurrentTimestamp(),
      };
    });

  for (
    const child of directChildren
  ) {
    updatedAssets =
      updateDescendantRootIds(
        updatedAssets,
        child.id,
        rootAssetId
      );
  }

  return updatedAssets;
}

export function getAssets():
  Asset[] {
  return loadAssets();
}

export function getActiveAssets():
  Asset[] {
  return loadAssets().filter(
    (asset) =>
      asset.active
  );
}

export function getInactiveAssets():
  Asset[] {
  return loadAssets().filter(
    (asset) =>
      !asset.active
  );
}

export function getAssetById(
  assetId: string
): Asset | undefined {
  return loadAssets().find(
    (asset) =>
      asset.id === assetId
  );
}

export function getAssetByCode(
  assetCode: string
): Asset | undefined {
  const normalizedCode =
    normalizeCode(assetCode);

  return loadAssets().find(
    (asset) =>
      asset.assetCode ===
      normalizedCode
  );
}

export function getAssetByNumber(
  assetNumber: string
): Asset | undefined {
  const normalizedNumber =
    normalizeAssetNumber(
      assetNumber
    );

  return loadAssets().find(
    (asset) =>
      asset.assetNumber ===
      normalizedNumber
  );
}

export function getAssetsByType(
  assetType: AssetType
): Asset[] {
  return loadAssets().filter(
    (asset) =>
      asset.assetType ===
      assetType
  );
}

export function getAssetsByDepartment(
  department: string
): Asset[] {
  const normalizedDepartment =
    normalizeText(department);

  return loadAssets().filter(
    (asset) =>
      asset.department ===
      normalizedDepartment
  );
}

export function getAssetsByArea(
  area: string
): Asset[] {
  const normalizedArea =
    normalizeText(area);

  return loadAssets().filter(
    (asset) =>
      asset.area ===
      normalizedArea
  );
}

export function getRootAssets():
  Asset[] {
  return loadAssets().filter(
    (asset) =>
      asset.parentAssetId === null
  );
}

export function getChildAssets(
  parentAssetId: string
): Asset[] {
  return loadAssets().filter(
    (asset) =>
      asset.parentAssetId ===
      parentAssetId
  );
}

export function getAssetDescendants(
  assetId: string
): Asset[] {
  const assets =
    loadAssets();

  const descendants:
    Asset[] = [];

  function collectChildren(
    parentId: string
  ) {
    const children =
      assets.filter(
        (asset) =>
          asset.parentAssetId ===
          parentId
      );

    for (const child of children) {
      descendants.push(child);
      collectChildren(child.id);
    }
  }

  collectChildren(assetId);

  return descendants;
}

export function getAssetDepartments():
  string[] {
  return Array.from(
    new Set(
      loadAssets()
        .map(
          (asset) =>
            asset.department
        )
        .filter(Boolean)
    )
  ).sort((first, second) =>
    first.localeCompare(
      second,
      "he"
    )
  );
}

export function getAssetAreas():
  string[] {
  return Array.from(
    new Set(
      loadAssets()
        .map(
          (asset) =>
            asset.area
        )
        .filter(Boolean)
    )
  ).sort((first, second) =>
    first.localeCompare(
      second,
      "he"
    )
  );
}

export function createAsset(
  input: CreateAssetInput
): AssetRepositoryResult {
  const validationError =
    validateRequiredFields(input);

  if (validationError) {
    return {
      success: false,
      asset: null,
      message: validationError,
    };
  }

  const assets =
    loadAssets();

  if (
    findDuplicateAssetNumber(
      assets,
      input.assetNumber
    )
  ) {
    return {
      success: false,
      asset: null,
      message:
        "כבר קיים נכס עם מספר זה.",
    };
  }

  if (
    findDuplicateAssetCode(
      assets,
      input.assetCode
    )
  ) {
    return {
      success: false,
      asset: null,
      message:
        "כבר קיים נכס עם קוד זה.",
    };
  }

  if (
    input.parentAssetId &&
    !assets.some(
      (asset) =>
        asset.id ===
        input.parentAssetId
    )
  ) {
    return {
      success: false,
      asset: null,
      message:
        "נכס האב שנבחר אינו קיים.",
    };
  }

  const asset =
    buildAsset(
      input,
      assets
    );

  saveAssets([
    ...assets,
    asset,
  ]);

  return {
    success: true,
    asset,
    message:
      "הנכס נוסף בהצלחה.",
  };
}

export function updateAsset(
  assetId: string,
  updates: UpdateAssetInput
): AssetRepositoryResult {
  const assets =
    loadAssets();

  const assetIndex =
    assets.findIndex(
      (asset) =>
        asset.id === assetId
    );

  if (assetIndex < 0) {
    return {
      success: false,
      asset: null,
      message:
        "הנכס לא נמצא.",
    };
  }

  const currentAsset =
    assets[assetIndex];

  const candidateInput:
    CreateAssetInput = {
      assetNumber:
        updates.assetNumber ??
        currentAsset.assetNumber,

      assetCode:
        updates.assetCode ??
        currentAsset.assetCode,

      displayName:
        updates.displayName ??
        currentAsset.displayName,

      shortName:
        updates.shortName ??
        currentAsset.shortName,

      assetType:
        updates.assetType ??
        currentAsset.assetType,

      hierarchyLevel:
        updates.hierarchyLevel ??
        currentAsset.hierarchyLevel,

      criticality:
        updates.criticality ??
        currentAsset.criticality,

      status:
        updates.status ??
        currentAsset.status,

      active:
        updates.active ??
        currentAsset.active,

      plant:
        updates.plant ??
        currentAsset.plant,

      department:
        updates.department ??
        currentAsset.department,

      area:
        updates.area ??
        currentAsset.area,

      location:
        updates.location ??
        currentAsset.location,

      parentAssetId:
        updates.parentAssetId ===
        undefined
          ? currentAsset.parentAssetId
          : updates.parentAssetId,

      rootAssetId:
        updates.rootAssetId ===
        undefined
          ? currentAsset.rootAssetId
          : updates.rootAssetId,

      manufacturer:
        updates.manufacturer ??
        currentAsset.manufacturer,

      model:
        updates.model ??
        currentAsset.model,

      serialNumber:
        updates.serialNumber ??
        currentAsset.serialNumber,

      installationDate:
        updates.installationDate ??
        currentAsset.installationDate,

      warrantyExpirationDate:
        updates.warrantyExpirationDate ??
        currentAsset.warrantyExpirationDate,

      description:
        updates.description ??
        currentAsset.description,

      notes:
        updates.notes ??
        currentAsset.notes,
    };

  const validationError =
    validateRequiredFields(
      candidateInput
    );

  if (validationError) {
    return {
      success: false,
      asset: null,
      message: validationError,
    };
  }

  if (
    findDuplicateAssetNumber(
      assets,
      candidateInput.assetNumber,
      assetId
    )
  ) {
    return {
      success: false,
      asset: null,
      message:
        "כבר קיים נכס אחר עם מספר זה.",
    };
  }

  if (
    findDuplicateAssetCode(
      assets,
      candidateInput.assetCode,
      assetId
    )
  ) {
    return {
      success: false,
      asset: null,
      message:
        "כבר קיים נכס אחר עם קוד זה.",
    };
  }

  if (
    candidateInput.parentAssetId &&
    !assets.some(
      (asset) =>
        asset.id ===
        candidateInput.parentAssetId
    )
  ) {
    return {
      success: false,
      asset: null,
      message:
        "נכס האב שנבחר אינו קיים.",
    };
  }

  if (
    createsHierarchyCycle(
      assets,
      assetId,
      candidateInput.parentAssetId
    )
  ) {
    return {
      success: false,
      asset: null,
      message:
        "לא ניתן ליצור מעגל בהיררכיית הנכסים.",
    };
  }

  const newRootAssetId =
    getRootAssetId(
      assets,
      candidateInput.parentAssetId
    );

  const updatedAsset =
    sanitizeAsset({
      ...currentAsset,

      ...candidateInput,

      id:
        currentAsset.id,

      rootAssetId:
        newRootAssetId,

      createdAt:
        currentAsset.createdAt,

      updatedAt:
        getCurrentTimestamp(),
    });

  assets[assetIndex] =
    updatedAsset;

  const descendantRootId =
    updatedAsset.rootAssetId ??
    updatedAsset.id;

  const updatedAssets =
    updateDescendantRootIds(
      assets,
      updatedAsset.id,
      descendantRootId
    );

  saveAssets(updatedAssets);

  return {
    success: true,
    asset: updatedAsset,
    message:
      "פרטי הנכס עודכנו בהצלחה.",
  };
}

export function setAssetActive(
  assetId: string,
  active: boolean
): AssetRepositoryResult {
  return updateAsset(
    assetId,
    {
      active,

      status: active
        ? "running"
        : "maintenance",
    }
  );
}

export function updateAssetStatus(
  assetId: string,
  status: AssetStatus
): AssetRepositoryResult {
  return updateAsset(
    assetId,
    {
      status,
    }
  );
}

export function deleteAsset(
  assetId: string
): AssetRepositoryResult {
  const assets =
    loadAssets();

  const asset =
    assets.find(
      (item) =>
        item.id === assetId
    );

  if (!asset) {
    return {
      success: false,
      asset: null,
      message:
        "הנכס לא נמצא.",
    };
  }

  const childAssets =
    assets.filter(
      (item) =>
        item.parentAssetId ===
        assetId
    );

  if (
    childAssets.length > 0
  ) {
    return {
      success: false,
      asset: null,
      message:
        "לא ניתן למחוק נכס שמכיל נכסי משנה. יש להעביר או למחוק אותם תחילה.",
    };
  }

  const updatedAssets =
    assets.filter(
      (item) =>
        item.id !== assetId
    );

  saveAssets(updatedAssets);

  return {
    success: true,
    asset,
    message:
      "הנכס נמחק מהמאגר.",
  };
}

export function resetAssetRepository():
  Asset[] {
  const initialAssets =
    createInitialAssets();

  saveAssets(initialAssets);

  return initialAssets;
}

export function subscribeToAssetChanges(
  listener: () => void
): () => void {
  if (
    typeof window === "undefined"
  ) {
    return () => undefined;
  }

  window.addEventListener(
    ASSETS_CHANGED_EVENT,
    listener
  );

  function handleStorageChange(
    event: StorageEvent
  ) {
    if (
      event.key === STORAGE_KEY
    ) {
      listener();
    }
  }

  window.addEventListener(
    "storage",
    handleStorageChange
  );

  return () => {
    window.removeEventListener(
      ASSETS_CHANGED_EVENT,
      listener
    );

    window.removeEventListener(
      "storage",
      handleStorageChange
    );
  };
}