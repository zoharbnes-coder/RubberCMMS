export type KnowledgeGraphNodeType =
  | "plant"
  | "functional-location"
  | "equipment-class"
  | "asset"
  | "asset-relationship"
  | "failure-mode"
  | "failure-event"
  | "maintenance-request"
  | "work-order"
  | "skill"
  | "certification"
  | "person"
  | "team"
  | "contractor"
  | "spare-part"
  | "inventory"
  | "document"
  | "supplier"
  | "project"
  | "other";

export type KnowledgeGraphNodeStatus =
  | "active"
  | "inactive"
  | "archived"
  | "unknown";

export type KnowledgeGraphEdgeType =
  | "contains"
  | "located-at"
  | "belongs-to"
  | "classified-as"
  | "depends-on"
  | "connected-to"
  | "parent-of"
  | "child-of"
  | "causes"
  | "caused-by"
  | "related-to"
  | "affects"
  | "affected-by"
  | "requires"
  | "required-by"
  | "uses"
  | "used-by"
  | "assigned-to"
  | "responsible-for"
  | "supports"
  | "supported-by"
  | "maintains"
  | "maintained-by"
  | "performed-by"
  | "experienced-by"
  | "qualified-by"
  | "certified-by"
  | "documented-by"
  | "references"
  | "recommended-for"
  | "compatible-with"
  | "alternative-to"
  | "replaces"
  | "replaced-by"
  | "stored-at"
  | "reserved-for"
  | "consumed-by"
  | "supplied-by"
  | "serviced-by"
  | "triggered-by"
  | "resolved-by"
  | "prevented-by"
  | "similar-to"
  | "derived-from"
  | "other";

export type KnowledgeGraphRelationshipStrength =
  | "very-weak"
  | "weak"
  | "medium"
  | "strong"
  | "very-strong";

export type KnowledgeGraphConfidenceLevel =
  | "low"
  | "medium"
  | "high"
  | "verified";

export type KnowledgeGraphSourceType =
  | "manual"
  | "system"
  | "integration"
  | "work-order"
  | "failure-event"
  | "document"
  | "sensor"
  | "user-feedback"
  | "mie"
  | "ai"
  | "import"
  | "other";

export type KnowledgeGraphInferenceType =
  | "none"
  | "rule-based"
  | "statistical"
  | "pattern"
  | "machine-learning"
  | "ai-generated"
  | "human-validated"
  | "other";

export type KnowledgeGraphPropertyValue =
  | string
  | number
  | boolean
  | null
  | string[]
  | number[];

export type KnowledgeGraphProperty = {
  id: string;

  key: string;

  displayName: string;

  value:
    KnowledgeGraphPropertyValue;

  unit: string;

  sourceType:
    KnowledgeGraphSourceType;

  confidence:
    KnowledgeGraphConfidenceLevel;

  createdAt: string;

  updatedAt: string;

  notes: string;
};

export type KnowledgeGraphNodeReference = {
  nodeType:
    KnowledgeGraphNodeType;

  entityId: string;

  entityCode: string;

  entityName: string;
};

export type KnowledgeGraphNode = {
  id: string;

  /*
   * Entity reference
   */
  nodeType:
    KnowledgeGraphNodeType;

  entityId: string;

  entityCode: string;

  entityName: string;

  /*
   * Classification
   */
  status:
    KnowledgeGraphNodeStatus;

  active: boolean;

  /*
   * Context
   */
  plantId: string | null;

  functionalLocationId:
    string | null;

  equipmentClassId:
    string | null;

  assetId: string | null;

  /*
   * Properties
   */
  properties:
    KnowledgeGraphProperty[];

  /*
   * Search
   */
  keywords: string[];

  tags: string[];

  /*
   * Intelligence
   */
  importanceScore: number;

  centralityScore: number;

  riskScore: number;

  knowledgeScore: number;

  /*
   * Audit
   */
  createdAt: string;

  updatedAt: string;

  lastAnalyzedAt:
    string | null;
};

export type KnowledgeGraphEdgeEvidence = {
  id: string;

  sourceType:
    KnowledgeGraphSourceType;

  sourceEntityId:
    string | null;

  sourceEntityType:
    KnowledgeGraphNodeType | null;

  documentId: string | null;

  description: string;

  confidence:
    KnowledgeGraphConfidenceLevel;

  observedAt: string | null;

  createdAt: string;

  notes: string;
};

export type KnowledgeGraphEdge = {
  id: string;

  /*
   * Relationship
   */
  edgeType:
    KnowledgeGraphEdgeType;

  sourceNodeId: string;

  targetNodeId: string;

  sourceReference:
    KnowledgeGraphNodeReference;

  targetReference:
    KnowledgeGraphNodeReference;

  /*
   * Meaning
   */
  displayName: string;

  description: string;

  directed: boolean;

  /*
   * Strength
   */
  strength:
    KnowledgeGraphRelationshipStrength;

  weight: number;

  confidence:
    KnowledgeGraphConfidenceLevel;

  /*
   * Inference
   */
  inferred: boolean;

  inferenceType:
    KnowledgeGraphInferenceType;

  inferenceRuleId:
    string | null;

  /*
   * Validity
   */
  active: boolean;

  validFrom: string | null;

  validUntil: string | null;

  /*
   * Evidence
   */
  evidence:
    KnowledgeGraphEdgeEvidence[];

  /*
   * Analytics
   */
  occurrenceCount: number;

  successCount: number;

  failureCount: number;

  lastObservedAt:
    string | null;

  /*
   * Audit
   */
  createdAt: string;

  updatedAt: string;
};

export type KnowledgeGraphPathNode = {
  sequence: number;

  nodeId: string;

  nodeType:
    KnowledgeGraphNodeType;

  entityId: string;

  entityCode: string;

  entityName: string;
};

export type KnowledgeGraphPathEdge = {
  sequence: number;

  edgeId: string;

  edgeType:
    KnowledgeGraphEdgeType;

  sourceNodeId: string;

  targetNodeId: string;

  weight: number;

  confidence:
    KnowledgeGraphConfidenceLevel;
};

export type KnowledgeGraphPath = {
  id: string;

  sourceNodeId: string;

  targetNodeId: string;

  nodes:
    KnowledgeGraphPathNode[];

  edges:
    KnowledgeGraphPathEdge[];

  totalWeight: number;

  averageConfidence: number;

  pathLength: number;

  description: string;
};

export type KnowledgeGraphCluster = {
  id: string;

  clusterCode: string;

  displayName: string;

  description: string;

  nodeIds: string[];

  edgeIds: string[];

  dominantNodeType:
    KnowledgeGraphNodeType | null;

  importanceScore: number;

  riskScore: number;

  reliabilityScore: number;

  recurringFailureScore:
    number;

  keywords: string[];

  generatedBy:
    KnowledgeGraphInferenceType;

  generatedAt: string;

  lastUpdatedAt: string;
};

export type KnowledgeGraphPatternType =
  | "repeat-failure"
  | "common-root-cause"
  | "asset-dependency"
  | "spare-part-consumption"
  | "technician-expertise"
  | "team-performance"
  | "contractor-performance"
  | "document-relevance"
  | "failure-sequence"
  | "maintenance-sequence"
  | "downtime-pattern"
  | "cost-pattern"
  | "risk-pattern"
  | "other";

export type KnowledgeGraphPattern = {
  id: string;

  patternType:
    KnowledgeGraphPatternType;

  displayName: string;

  description: string;

  nodeIds: string[];

  edgeIds: string[];

  occurrenceCount: number;

  confidenceScore: number;

  impactScore: number;

  riskScore: number;

  detectedAt: string;

  firstObservedAt:
    string | null;

  lastObservedAt:
    string | null;

  active: boolean;

  recommendationIds:
    string[];

  notes: string;
};

export type KnowledgeGraphRuleCondition = {
  id: string;

  field: string;

  operator:
    | "equals"
    | "not-equals"
    | "greater-than"
    | "greater-than-or-equal"
    | "less-than"
    | "less-than-or-equal"
    | "contains"
    | "not-contains"
    | "exists"
    | "not-exists"
    | "in"
    | "not-in";

  value:
    KnowledgeGraphPropertyValue;
};

export type KnowledgeGraphRuleAction = {
  id: string;

  actionType:
    | "create-edge"
    | "update-edge"
    | "increase-weight"
    | "decrease-weight"
    | "create-pattern"
    | "create-recommendation"
    | "flag-risk"
    | "flag-knowledge-gap"
    | "other";

  edgeType:
    KnowledgeGraphEdgeType | null;

  targetNodeType:
    KnowledgeGraphNodeType | null;

  value: string;

  notes: string;
};

export type KnowledgeGraphInferenceRule = {
  id: string;

  ruleCode: string;

  displayName: string;

  description: string;

  active: boolean;

  priority: number;

  sourceNodeType:
    KnowledgeGraphNodeType | null;

  targetNodeType:
    KnowledgeGraphNodeType | null;

  conditions:
    KnowledgeGraphRuleCondition[];

  actions:
    KnowledgeGraphRuleAction[];

  minimumConfidence:
    number;

  createdAt: string;

  updatedAt: string;

  lastExecutedAt:
    string | null;
};

export type KnowledgeGraphQuery = {
  id: string;

  queryName: string;

  description: string;

  startNodeIds: string[];

  nodeTypes:
    KnowledgeGraphNodeType[];

  edgeTypes:
    KnowledgeGraphEdgeType[];

  maximumDepth: number;

  minimumWeight: number;

  minimumConfidence:
    number;

  includeInactive: boolean;

  createdAt: string;
};

export type KnowledgeGraphQueryResult = {
  queryId: string;

  nodeIds: string[];

  edgeIds: string[];

  paths:
    KnowledgeGraphPath[];

  totalNodeCount: number;

  totalEdgeCount: number;

  executionTimeMs: number;

  executedAt: string;
};

export type KnowledgeGraphMetrics = {
  totalNodeCount: number;

  totalEdgeCount: number;

  activeNodeCount: number;

  activeEdgeCount: number;

  inferredEdgeCount: number;

  verifiedEdgeCount: number;

  lowConfidenceEdgeCount:
    number;

  isolatedNodeCount: number;

  clusterCount: number;

  patternCount: number;

  activePatternCount: number;

  averageNodeDegree: number;

  averageEdgeWeight: number;

  averageConfidenceScore:
    number;

  knowledgeCoveragePercent:
    number;

  knowledgeGapCount: number;

  lastGraphBuildAt:
    string | null;

  lastGraphAnalysisAt:
    string | null;
};

export type KnowledgeGraphMieProfile = {
  graphHealthScore: number;

  knowledgeCoverageScore:
    number;

  relationshipConfidenceScore:
    number;

  failureKnowledgeScore:
    number;

  maintenanceKnowledgeScore:
    number;

  assetKnowledgeScore:
    number;

  peopleKnowledgeScore:
    number;

  sparePartKnowledgeScore:
    number;

  documentKnowledgeScore:
    number;

  overallIntelligenceScore:
    number;

  highRiskNodeIds: string[];

  highImportanceNodeIds:
    string[];

  knowledgeGapNodeIds:
    string[];

  weakRelationshipEdgeIds:
    string[];

  recommendedRelationshipIds:
    string[];

  recommendedAnalysisAreas:
    string[];

  mieSummary: string;

  lastAnalyzedAt: string | null;
};

export type KnowledgeGraph = {
  id: string;

  /*
   * Identification
   */
  graphNumber: string;

  graphCode: string;

  displayName: string;

  description: string;

  /*
   * Scope
   */
  plantIds: string[];

  functionalLocationIds:
    string[];

  equipmentClassIds:
    string[];

  assetIds: string[];

  /*
   * Graph data
   */
  nodes:
    KnowledgeGraphNode[];

  edges:
    KnowledgeGraphEdge[];

  /*
   * Analysis
   */
  clusters:
    KnowledgeGraphCluster[];

  patterns:
    KnowledgeGraphPattern[];

  paths:
    KnowledgeGraphPath[];

  /*
   * Inference
   */
  inferenceRules:
    KnowledgeGraphInferenceRule[];

  /*
   * Queries
   */
  savedQueries:
    KnowledgeGraphQuery[];

  /*
   * Metrics
   */
  metrics:
    KnowledgeGraphMetrics;

  /*
   * Intelligence
   */
  mieProfile:
    KnowledgeGraphMieProfile;

  /*
   * Configuration
   */
  automaticInferenceEnabled:
    boolean;

  automaticPatternDetectionEnabled:
    boolean;

  minimumInferenceConfidence:
    number;

  minimumRelationshipWeight:
    number;

  maximumTraversalDepth:
    number;

  /*
   * General
   */
  active: boolean;

  tags: string[];

  notes: string;

  /*
   * Audit
   */
  createdAt: string;

  updatedAt: string;
};

export type CreateKnowledgeGraphInput =
  Omit<
    KnowledgeGraph,
    | "id"
    | "metrics"
    | "mieProfile"
    | "createdAt"
    | "updatedAt"
  >;

export type UpdateKnowledgeGraphInput =
  Partial<CreateKnowledgeGraphInput>;

export type KnowledgeGraphRepositoryResult = {
  success: boolean;

  knowledgeGraph:
    KnowledgeGraph | null;

  message: string;
};

export const defaultKnowledgeGraphMetrics:
  KnowledgeGraphMetrics = {
  totalNodeCount: 0,

  totalEdgeCount: 0,

  activeNodeCount: 0,

  activeEdgeCount: 0,

  inferredEdgeCount: 0,

  verifiedEdgeCount: 0,

  lowConfidenceEdgeCount: 0,

  isolatedNodeCount: 0,

  clusterCount: 0,

  patternCount: 0,

  activePatternCount: 0,

  averageNodeDegree: 0,

  averageEdgeWeight: 0,

  averageConfidenceScore: 0,

  knowledgeCoveragePercent: 0,

  knowledgeGapCount: 0,

  lastGraphBuildAt: null,

  lastGraphAnalysisAt: null,
};

export const defaultKnowledgeGraphMieProfile:
  KnowledgeGraphMieProfile = {
  graphHealthScore: 0,

  knowledgeCoverageScore: 0,

  relationshipConfidenceScore: 0,

  failureKnowledgeScore: 0,

  maintenanceKnowledgeScore: 0,

  assetKnowledgeScore: 0,

  peopleKnowledgeScore: 0,

  sparePartKnowledgeScore: 0,

  documentKnowledgeScore: 0,

  overallIntelligenceScore: 0,

  highRiskNodeIds: [],

  highImportanceNodeIds: [],

  knowledgeGapNodeIds: [],

  weakRelationshipEdgeIds: [],

  recommendedRelationshipIds:
    [],

  recommendedAnalysisAreas: [],

  mieSummary: "",

  lastAnalyzedAt: null,
};

export const defaultKnowledgeGraph:
  CreateKnowledgeGraphInput = {
  graphNumber: "",

  graphCode: "",

  displayName: "",

  description: "",

  plantIds: [],

  functionalLocationIds: [],

  equipmentClassIds: [],

  assetIds: [],

  nodes: [],

  edges: [],

  clusters: [],

  patterns: [],

  paths: [],

  inferenceRules: [],

  savedQueries: [],

  automaticInferenceEnabled:
    true,

  automaticPatternDetectionEnabled:
    true,

  minimumInferenceConfidence:
    0.7,

  minimumRelationshipWeight:
    0.1,

  maximumTraversalDepth: 5,

  active: true,

  tags: [],

  notes: "",
};