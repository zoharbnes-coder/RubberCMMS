import {
  archiveAsset,
  getAssets,
  moveAsset,
  reactivateAsset,
  suspendAsset,
  updateAsset,
} from "./assetRepository";

import type {
  Asset,
  AssetLifecycleStatus,
  AssetRepositoryResult,
} from "../types/asset";

const STORAGE_KEY = "rubbermip_plant_structure_v1";
const STRUCTURE_CHANGED_EVENT = "rubbermip-plant-structure-changed";

export type PlantDepartment = {
  id: string;
  name: string;
  description: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PlantArea = {
  id: string;
  departmentId: string;
  name: string;
  description: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PlantStructureData = {
  plantName: string;
  departments: PlantDepartment[];
  areas: PlantArea[];
};

export type PlantStructureAssetNode = {
  asset: Asset;
  children: PlantStructureAssetNode[];
};

export type PlantAreaSnapshot = {
  area: PlantArea;
  assets: PlantStructureAssetNode[];
};

export type PlantDepartmentSnapshot = {
  department: PlantDepartment;
  areas: PlantAreaSnapshot[];
  unassignedAssets: PlantStructureAssetNode[];
};

export type PlantStructureSnapshot = {
  generatedAt: string;
  plantName: string;
  departments: PlantDepartmentSnapshot[];
  suspendedAssets: Asset[];
  archivedAssets: Asset[];
  orphanAssets: Asset[];
};

export type PlantStructureResult = {
  success: boolean;
  message: string;
};

export type AssetMoveInput = {
  assetId: string;
  departmentId: string;
  areaId: string | null;
  parentAssetId: string | null;
};

function createId(prefix: string): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function now(): string {
  return new Date().toISOString();
}

function normalize(value: string): string {
  return value.trim();
}

function normalizeKey(value: string): string {
  return normalize(value).toLocaleLowerCase("he-IL");
}

function emitChange(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(STRUCTURE_CHANGED_EVENT),
  );
}

function resolveLifecycleStatus(
  asset: Asset,
): AssetLifecycleStatus {
  return (
    asset.lifecycleStatus ??
    (asset.active ? "active" : "suspended")
  );
}

function buildSeedData(): PlantStructureData {
  const assets = getAssets();

  const plantName =
    assets.find((asset) => Boolean(asset.plant))?.plant ||
    "RubberMIP Plant";

  const departments: PlantDepartment[] = [];
  const areas: PlantArea[] = [];
  const departmentByName = new Map<string, PlantDepartment>();

  for (const asset of assets) {
    const departmentName = normalize(asset.department);

    if (!departmentName) {
      continue;
    }

    const departmentKey = normalizeKey(departmentName);
    let department = departmentByName.get(departmentKey);

    if (!department) {
      const timestamp = now();

      department = {
        id: createId("department"),
        name: departmentName,
        description: "",
        active: true,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      departments.push(department);
      departmentByName.set(departmentKey, department);
    }

    const areaName = normalize(asset.area);

    if (!areaName) {
      continue;
    }

    const exists = areas.some(
      (area) =>
        area.departmentId === department!.id &&
        normalizeKey(area.name) === normalizeKey(areaName),
    );

    if (exists) {
      continue;
    }

    const timestamp = now();

    areas.push({
      id: createId("area"),
      departmentId: department.id,
      name: areaName,
      description: "",
      active: true,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  }

  return {
    plantName,
    departments,
    areas,
  };
}

function saveData(data: PlantStructureData): void {
  if (typeof localStorage === "undefined") {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(data),
  );

  emitChange();
}

function loadData(): PlantStructureData {
  if (typeof localStorage === "undefined") {
    return buildSeedData();
  }

  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    const seed = buildSeedData();
    saveData(seed);
    return seed;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<PlantStructureData>;

    if (
      !Array.isArray(parsed.departments) ||
      !Array.isArray(parsed.areas)
    ) {
      throw new Error("Invalid plant structure");
    }

    return {
      plantName:
        typeof parsed.plantName === "string"
          ? parsed.plantName
          : "RubberMIP Plant",
      departments: parsed.departments,
      areas: parsed.areas,
    };
  } catch {
    const seed = buildSeedData();
    saveData(seed);
    return seed;
  }
}

export function getPlantStructureData(): PlantStructureData {
  return loadData();
}

export function createDepartment(
  name: string,
  description = "",
): PlantStructureResult {
  const normalizedName = normalize(name);

  if (!normalizedName) {
    return {
      success: false,
      message: "חובה להזין שם מחלקה.",
    };
  }

  const data = loadData();

  const duplicate = data.departments.some(
    (department) =>
      normalizeKey(department.name) === normalizeKey(normalizedName),
  );

  if (duplicate) {
    return {
      success: false,
      message: "מחלקה בשם זה כבר קיימת.",
    };
  }

  const timestamp = now();

  data.departments.push({
    id: createId("department"),
    name: normalizedName,
    description: normalize(description),
    active: true,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  saveData(data);

  return {
    success: true,
    message: "המחלקה נוספה בהצלחה.",
  };
}

export function updateDepartment(
  departmentId: string,
  name: string,
  description = "",
): PlantStructureResult {
  const data = loadData();
  const department = data.departments.find(
    (item) => item.id === departmentId,
  );

  if (!department) {
    return {
      success: false,
      message: "המחלקה לא נמצאה.",
    };
  }

  const normalizedName = normalize(name);

  if (!normalizedName) {
    return {
      success: false,
      message: "חובה להזין שם מחלקה.",
    };
  }

  const duplicate = data.departments.some(
    (item) =>
      item.id !== departmentId &&
      normalizeKey(item.name) === normalizeKey(normalizedName),
  );

  if (duplicate) {
    return {
      success: false,
      message: "מחלקה בשם זה כבר קיימת.",
    };
  }

  const oldName = department.name;

  department.name = normalizedName;
  department.description = normalize(description);
  department.updatedAt = now();

  const assets = getAssets().filter(
    (asset) => asset.department === oldName,
  );

  for (const asset of assets) {
    updateAsset(asset.id, {
      department: normalizedName,
    });
  }

  saveData(data);

  return {
    success: true,
    message: "המחלקה עודכנה בהצלחה.",
  };
}

export function setDepartmentActive(
  departmentId: string,
  active: boolean,
): PlantStructureResult {
  const data = loadData();
  const department = data.departments.find(
    (item) => item.id === departmentId,
  );

  if (!department) {
    return {
      success: false,
      message: "המחלקה לא נמצאה.",
    };
  }

  department.active = active;
  department.updatedAt = now();
  saveData(data);

  return {
    success: true,
    message: active
      ? "המחלקה הוחזרה לפעילות."
      : "המחלקה הושהתה.",
  };
}

export function deleteDepartment(
  departmentId: string,
): PlantStructureResult {
  const data = loadData();
  const department = data.departments.find(
    (item) => item.id === departmentId,
  );

  if (!department) {
    return {
      success: false,
      message: "המחלקה לא נמצאה.",
    };
  }

  const hasAssets = getAssets().some(
    (asset) => asset.department === department.name,
  );

  if (hasAssets) {
    return {
      success: false,
      message:
        "לא ניתן למחוק מחלקה שמכילה נכסים. יש להעביר את הנכסים תחילה.",
    };
  }

  data.departments = data.departments.filter(
    (item) => item.id !== departmentId,
  );

  data.areas = data.areas.filter(
    (area) => area.departmentId !== departmentId,
  );

  saveData(data);

  return {
    success: true,
    message: "המחלקה נמחקה.",
  };
}

export function createArea(
  departmentId: string,
  name: string,
  description = "",
): PlantStructureResult {
  const data = loadData();
  const department = data.departments.find(
    (item) => item.id === departmentId,
  );

  if (!department) {
    return {
      success: false,
      message: "המחלקה לא נמצאה.",
    };
  }

  const normalizedName = normalize(name);

  if (!normalizedName) {
    return {
      success: false,
      message: "חובה להזין שם אזור / קבוצה.",
    };
  }

  const duplicate = data.areas.some(
    (area) =>
      area.departmentId === departmentId &&
      normalizeKey(area.name) === normalizeKey(normalizedName),
  );

  if (duplicate) {
    return {
      success: false,
      message: "אזור / קבוצה בשם זה כבר קיימים במחלקה.",
    };
  }

  const timestamp = now();

  data.areas.push({
    id: createId("area"),
    departmentId,
    name: normalizedName,
    description: normalize(description),
    active: true,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  saveData(data);

  return {
    success: true,
    message: "האזור / הקבוצה נוספו בהצלחה.",
  };
}

export function updateArea(
  areaId: string,
  name: string,
  description = "",
): PlantStructureResult {
  const data = loadData();
  const area = data.areas.find(
    (item) => item.id === areaId,
  );

  if (!area) {
    return {
      success: false,
      message: "האזור / הקבוצה לא נמצאו.",
    };
  }

  const department = data.departments.find(
    (item) => item.id === area.departmentId,
  );

  if (!department) {
    return {
      success: false,
      message: "מחלקת האב לא נמצאה.",
    };
  }

  const normalizedName = normalize(name);

  if (!normalizedName) {
    return {
      success: false,
      message: "חובה להזין שם אזור / קבוצה.",
    };
  }

  const duplicate = data.areas.some(
    (item) =>
      item.id !== areaId &&
      item.departmentId === area.departmentId &&
      normalizeKey(item.name) === normalizeKey(normalizedName),
  );

  if (duplicate) {
    return {
      success: false,
      message: "אזור / קבוצה בשם זה כבר קיימים במחלקה.",
    };
  }

  const oldName = area.name;

  area.name = normalizedName;
  area.description = normalize(description);
  area.updatedAt = now();

  const assets = getAssets().filter(
    (asset) =>
      asset.department === department.name &&
      asset.area === oldName,
  );

  for (const asset of assets) {
    updateAsset(asset.id, {
      area: normalizedName,
    });
  }

  saveData(data);

  return {
    success: true,
    message: "האזור / הקבוצה עודכנו בהצלחה.",
  };
}

export function setAreaActive(
  areaId: string,
  active: boolean,
): PlantStructureResult {
  const data = loadData();
  const area = data.areas.find(
    (item) => item.id === areaId,
  );

  if (!area) {
    return {
      success: false,
      message: "האזור / הקבוצה לא נמצאו.",
    };
  }

  area.active = active;
  area.updatedAt = now();
  saveData(data);

  return {
    success: true,
    message: active
      ? "האזור / הקבוצה הוחזרו לפעילות."
      : "האזור / הקבוצה הושהו.",
  };
}

export function deleteArea(
  areaId: string,
): PlantStructureResult {
  const data = loadData();
  const area = data.areas.find(
    (item) => item.id === areaId,
  );

  if (!area) {
    return {
      success: false,
      message: "האזור / הקבוצה לא נמצאו.",
    };
  }

  const department = data.departments.find(
    (item) => item.id === area.departmentId,
  );

  const hasAssets =
    Boolean(department) &&
    getAssets().some(
      (asset) =>
        asset.department === department!.name &&
        asset.area === area.name,
    );

  if (hasAssets) {
    return {
      success: false,
      message:
        "לא ניתן למחוק אזור / קבוצה שמכילים נכסים. יש להעביר את הנכסים תחילה.",
    };
  }

  data.areas = data.areas.filter(
    (item) => item.id !== areaId,
  );

  saveData(data);

  return {
    success: true,
    message: "האזור / הקבוצה נמחקו.",
  };
}

export function moveAssetInStructure(
  input: AssetMoveInput,
): AssetRepositoryResult {
  const data = loadData();

  const department = data.departments.find(
    (item) => item.id === input.departmentId,
  );

  if (!department) {
    return {
      success: false,
      asset: null,
      message: "מחלקת היעד לא נמצאה.",
    };
  }

  let areaName = "";

  if (input.areaId) {
    const area = data.areas.find(
      (item) => item.id === input.areaId,
    );

    if (
      !area ||
      area.departmentId !== department.id
    ) {
      return {
        success: false,
        asset: null,
        message: "האזור / הקבוצה אינם שייכים למחלקת היעד.",
      };
    }

    areaName = area.name;
  }

  return moveAsset(
    input.assetId,
    department.name,
    areaName,
    input.parentAssetId,
  );
}

export function changeAssetLifecycle(
  assetId: string,
  lifecycleStatus: AssetLifecycleStatus,
): AssetRepositoryResult {
  if (lifecycleStatus === "active") {
    return reactivateAsset(assetId);
  }

  if (lifecycleStatus === "archived") {
    return archiveAsset(assetId);
  }

  return suspendAsset(assetId);
}

function buildTree(
  assets: Asset[],
): PlantStructureAssetNode[] {
  const assetById = new Map(
    assets.map((asset) => [
      asset.id,
      asset,
    ]),
  );

  const childrenByParent = new Map<string, Asset[]>();

  for (const asset of assets) {
    if (!asset.parentAssetId) {
      continue;
    }

    const list =
      childrenByParent.get(asset.parentAssetId) ?? [];

    list.push(asset);
    childrenByParent.set(asset.parentAssetId, list);
  }

  function createNode(
    asset: Asset,
  ): PlantStructureAssetNode {
    const children = (
      childrenByParent.get(asset.id) ?? []
    )
      .sort((first, second) =>
        first.displayName.localeCompare(
          second.displayName,
          "he",
        ),
      )
      .map(createNode);

    return {
      asset,
      children,
    };
  }

  return assets
    .filter(
      (asset) =>
        !asset.parentAssetId ||
        !assetById.has(asset.parentAssetId),
    )
    .sort((first, second) =>
      first.displayName.localeCompare(
        second.displayName,
        "he",
      ),
    )
    .map(createNode);
}

export function getPlantStructureSnapshot():
  PlantStructureSnapshot {
  const data = loadData();
  const assets = getAssets();

  const activeAssets = assets.filter(
    (asset) =>
      resolveLifecycleStatus(asset) === "active",
  );

  const departmentSnapshots = data.departments.map(
    (department) => {
      const departmentAssets = activeAssets.filter(
        (asset) =>
          asset.department === department.name,
      );

      const areaSnapshots = data.areas
        .filter(
          (area) =>
            area.departmentId === department.id,
        )
        .map((area) => ({
          area,
          assets: buildTree(
            departmentAssets.filter(
              (asset) =>
                asset.area === area.name,
            ),
          ),
        }));

      const assignedAreaNames = new Set(
        areaSnapshots.map((item) => item.area.name),
      );

      return {
        department,
        areas: areaSnapshots,
        unassignedAssets: buildTree(
          departmentAssets.filter(
            (asset) =>
              !asset.area ||
              !assignedAreaNames.has(asset.area),
          ),
        ),
      };
    },
  );

  const knownDepartmentNames = new Set(
    data.departments.map(
      (department) => department.name,
    ),
  );

  return {
    generatedAt: now(),
    plantName: data.plantName,
    departments: departmentSnapshots,
    suspendedAssets: assets.filter(
      (asset) =>
        resolveLifecycleStatus(asset) === "suspended",
    ),
    archivedAssets: assets.filter(
      (asset) =>
        resolveLifecycleStatus(asset) === "archived",
    ),
    orphanAssets: activeAssets.filter(
      (asset) =>
        !knownDepartmentNames.has(asset.department),
    ),
  };
}

export function updatePlantName(
  plantName: string,
): PlantStructureResult {
  const normalizedName = normalize(plantName);

  if (!normalizedName) {
    return {
      success: false,
      message: "חובה להזין שם מפעל.",
    };
  }

  const data = loadData();
  data.plantName = normalizedName;
  saveData(data);

  const assets = getAssets();

  for (const asset of assets) {
    updateAsset(asset.id, {
      plant: normalizedName,
    });
  }

  return {
    success: true,
    message: "שם המפעל עודכן בהצלחה.",
  };
}

export function resetPlantStructure():
  PlantStructureData {
  const seed = buildSeedData();
  saveData(seed);
  return seed;
}

export function subscribeToPlantStructureChanges(
  listener: () => void,
): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener(
    STRUCTURE_CHANGED_EVENT,
    listener,
  );

  function handleStorage(
    event: StorageEvent,
  ) {
    if (event.key === STORAGE_KEY) {
      listener();
    }
  }

  window.addEventListener(
    "storage",
    handleStorage,
  );

  return () => {
    window.removeEventListener(
      STRUCTURE_CHANGED_EVENT,
      listener,
    );

    window.removeEventListener(
      "storage",
      handleStorage,
    );
  };
}