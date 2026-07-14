import {
  getMachineIntelligenceSnapshot,
  type MachineRiskLevel,
} from "./machineIntelligenceService";
import { getLiveMachines } from "./machineService";

export type ManagementRiskMachine = {
  assetNumber: string;
  machineCode: string;
  machineName: string;
  department: string;

  healthScore: number;
  riskLevel: MachineRiskLevel;

  openWorkOrders: number;
  downtimeWorkOrders: number;

  failuresLast7Days: number;
  failuresLast30Days: number;
  downtimeFailuresLast30Days: number;

  primaryRecommendation: string;
};

export type ManagementInsightsSnapshot = {
  generatedAt: string;

  totalMachines: number;

  lowRiskMachines: number;
  mediumRiskMachines: number;
  highRiskMachines: number;
  criticalRiskMachines: number;

  averageHealthScore: number;

  machinesRequiringAttention: number;

  topRiskMachines: ManagementRiskMachine[];
};

const riskRank: Record<MachineRiskLevel, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

function calculateAverage(
  values: number[]
): number {
  if (values.length === 0) {
    return 100;
  }

  const total = values.reduce(
    (sum, value) => sum + value,
    0
  );

  return total / values.length;
}

export function getManagementInsightsSnapshot():
  ManagementInsightsSnapshot {
  const machines = getLiveMachines();

  const analyzedMachines =
    machines.flatMap((machine) => {
      const intelligence =
        getMachineIntelligenceSnapshot(
          machine.assetNumber
        );

      if (!intelligence) {
        return [];
      }

      const analyzedMachine: ManagementRiskMachine = {
        assetNumber:
          machine.assetNumber,

        machineCode:
          machine.machineCode,

        machineName:
          machine.displayName,

        department:
          machine.department,

        healthScore:
          intelligence.healthScore,

        riskLevel:
          intelligence.riskLevel,

        openWorkOrders:
          machine.openWorkOrders,

        downtimeWorkOrders:
          machine.downtimeWorkOrders,

        failuresLast7Days:
          intelligence.failuresLast7Days,

        failuresLast30Days:
          intelligence.failuresLast30Days,

        downtimeFailuresLast30Days:
          intelligence.downtimeFailuresLast30Days,

        primaryRecommendation:
          intelligence.recommendations[0] ??
          "להמשיך במעקב שוטף.",
      };

      return [analyzedMachine];
    });

  const lowRiskMachines =
    analyzedMachines.filter(
      (machine) =>
        machine.riskLevel === "low"
    ).length;

  const mediumRiskMachines =
    analyzedMachines.filter(
      (machine) =>
        machine.riskLevel === "medium"
    ).length;

  const highRiskMachines =
    analyzedMachines.filter(
      (machine) =>
        machine.riskLevel === "high"
    ).length;

  const criticalRiskMachines =
    analyzedMachines.filter(
      (machine) =>
        machine.riskLevel === "critical"
    ).length;

  const topRiskMachines =
    [...analyzedMachines]
      .sort((first, second) => {
        const riskDifference =
          riskRank[second.riskLevel] -
          riskRank[first.riskLevel];

        if (riskDifference !== 0) {
          return riskDifference;
        }

        if (
          first.healthScore !==
          second.healthScore
        ) {
          return (
            first.healthScore -
            second.healthScore
          );
        }

        return (
          second.downtimeFailuresLast30Days -
          first.downtimeFailuresLast30Days
        );
      })
      .filter(
        (machine) =>
          machine.riskLevel !== "low"
      )
      .slice(0, 10);

  return {
    generatedAt:
      new Date().toISOString(),

    totalMachines:
      analyzedMachines.length,

    lowRiskMachines,
    mediumRiskMachines,
    highRiskMachines,
    criticalRiskMachines,

    averageHealthScore:
      calculateAverage(
        analyzedMachines.map(
          (machine) =>
            machine.healthScore
        )
      ),

    machinesRequiringAttention:
      mediumRiskMachines +
      highRiskMachines +
      criticalRiskMachines,

    topRiskMachines,
  };
}