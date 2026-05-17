# IASevero Runtime Canonical Architecture Map

Generated at: 2026-05-17T20:14:53+00:00

## Runtime Files
app/lib/orchestrator/adaptive-protection.ts
app/lib/orchestrator/audit-trail.ts
app/lib/orchestrator/awareness-engine.ts
app/lib/orchestrator/central-runtime-core.ts
app/lib/orchestrator/decision-memory.ts
app/lib/orchestrator/decision-pipeline.ts
app/lib/orchestrator/diagnostics.ts
app/lib/orchestrator/event-logger.ts
app/lib/orchestrator/events.ts
app/lib/orchestrator/evolution-engine.ts
app/lib/orchestrator/executor.ts
app/lib/orchestrator/health-intelligence.ts
app/lib/orchestrator/hybrid-router.ts
app/lib/orchestrator/intelligent-selector.ts
app/lib/orchestrator/learning-engine.ts
app/lib/orchestrator/memory-governor.ts
app/lib/orchestrator/metrics.ts
app/lib/orchestrator/policy.ts
app/lib/orchestrator/provider-reputation.ts
app/lib/orchestrator/queue-governor.ts
app/lib/orchestrator/routing.ts
app/lib/orchestrator/runtime-action-executor.ts
app/lib/orchestrator/runtime-architecture-auditor.ts
app/lib/orchestrator/runtime-architecture-index.ts
app/lib/orchestrator/runtime-autonomous-decision.ts
app/lib/orchestrator/runtime-autonomous-stabilizer.ts
app/lib/orchestrator/runtime-awareness.ts
app/lib/orchestrator/runtime-budget-control.ts
app/lib/orchestrator/runtime-conscious-loop.ts
app/lib/orchestrator/runtime-context.ts
app/lib/orchestrator/runtime-contracts.ts
app/lib/orchestrator/runtime-coordinator.ts
app/lib/orchestrator/runtime-decision-engine.ts
app/lib/orchestrator/runtime-dependency-graph.ts
app/lib/orchestrator/runtime-dependency-scanner.ts
app/lib/orchestrator/runtime-dependency-validator.ts
app/lib/orchestrator/runtime-enforcement.ts
app/lib/orchestrator/runtime-event-bus.ts
app/lib/orchestrator/runtime-event-processor.ts
app/lib/orchestrator/runtime-execution-control.ts
app/lib/orchestrator/runtime-governor.ts
app/lib/orchestrator/runtime-graph-registry.ts
app/lib/orchestrator/runtime-guardian.ts
app/lib/orchestrator/runtime-incidents.ts
app/lib/orchestrator/runtime-intelligence.ts
app/lib/orchestrator/runtime-lifecycle-manager.ts
app/lib/orchestrator/runtime-limiter.ts
app/lib/orchestrator/runtime-memory.ts
app/lib/orchestrator/runtime-operational-memory.ts
app/lib/orchestrator/runtime-policy-engine.ts
app/lib/orchestrator/runtime-policy.ts
app/lib/orchestrator/runtime-provider-governor.ts
app/lib/orchestrator/runtime-recovery.ts
app/lib/orchestrator/runtime-self-healing.ts
app/lib/orchestrator/runtime-snapshot.ts
app/lib/orchestrator/runtime-state-registry.ts
app/lib/orchestrator/runtime-structural-health.ts
app/lib/orchestrator/runtime-supervisor.ts
app/lib/orchestrator/runtime-task-planner.ts
app/lib/orchestrator/runtime-telemetry.ts
app/lib/orchestrator/runtime-topology-validator.ts
app/lib/orchestrator/runtime.ts
app/lib/orchestrator/self-healing.ts
app/lib/orchestrator/state-engine.ts
app/lib/orchestrator/trace.ts
app/runtime/runtime-lifecycle.ts
app/runtime/runtime-manifest.ts
app/runtime/runtime-registry.ts

## Export Map
app/lib/orchestrator/adaptive-protection.ts:export function applyAdaptiveProtection() {
app/lib/orchestrator/audit-trail.ts:export function getAuditTrail() {
app/lib/orchestrator/awareness-engine.ts:export function getRuntimeAwareness() {
app/lib/orchestrator/central-runtime-core.ts:export function runCentralRuntimeCore() {
app/lib/orchestrator/decision-memory.ts:export function clearDecisionMemory() {
app/lib/orchestrator/decision-memory.ts:export function getRecentDecisions() {
app/lib/orchestrator/decision-memory.ts:export function rememberDecision(
app/lib/orchestrator/decision-pipeline.ts:export function runDecisionPipeline(message: string, intent = 'general'): PipelineResult {
app/lib/orchestrator/decision-pipeline.ts:export type PipelineResult = {
app/lib/orchestrator/diagnostics.ts:export function runDiagnostics(): RuntimeDiagnostic {
app/lib/orchestrator/diagnostics.ts:export type RuntimeDiagnostic = {
app/lib/orchestrator/event-logger.ts:export function getRecentEvents() {
app/lib/orchestrator/event-logger.ts:export function logEvent(event: IASeveroEvent) {
app/lib/orchestrator/events.ts:export function createEvent(
app/lib/orchestrator/events.ts:export type IASeveroEvent = {
app/lib/orchestrator/evolution-engine.ts:export function evaluateRuntimeEvolution() {
app/lib/orchestrator/executor.ts:export function executeRoute(
app/lib/orchestrator/health-intelligence.ts:export function getHealthIntelligence() {
app/lib/orchestrator/hybrid-router.ts:export function resolveHybridProvider() {
app/lib/orchestrator/intelligent-selector.ts:export function selectBestProvider() {
app/lib/orchestrator/learning-engine.ts:export function analyzeRuntimePatterns() {
app/lib/orchestrator/memory-governor.ts:export function getMemoryPolicy(): MemoryPolicy {
app/lib/orchestrator/memory-governor.ts:export function shouldStoreFact(key: string, value: string): boolean {
app/lib/orchestrator/memory-governor.ts:export function trimHistory(history: string[]): string[] {
app/lib/orchestrator/memory-governor.ts:export type MemoryPolicy = {
app/lib/orchestrator/metrics.ts:export function getOperationalMetrics() {
app/lib/orchestrator/policy.ts:export function evaluatePolicy(message: string): PolicyResult {
app/lib/orchestrator/policy.ts:export type PolicyResult = {
app/lib/orchestrator/provider-reputation.ts:export function getProviderReputation() {
app/lib/orchestrator/provider-reputation.ts:export function registerProviderResult(
app/lib/orchestrator/queue-governor.ts:export function addTask(task: RuntimeTask) {
app/lib/orchestrator/queue-governor.ts:export function clearQueue() {
app/lib/orchestrator/queue-governor.ts:export function getQueue() {
app/lib/orchestrator/routing.ts:export function resolveProviderRoute(
app/lib/orchestrator/routing.ts:export type ProviderRoute = {
app/lib/orchestrator/runtime-action-executor.ts:export async function executeRuntimeAction(
app/lib/orchestrator/runtime-action-executor.ts:export type RuntimeAction = {
app/lib/orchestrator/runtime-action-executor.ts:export type RuntimeActionResult = {
app/lib/orchestrator/runtime-architecture-auditor.ts:export function auditRuntimeArchitecture(): RuntimeArchitectureAudit {
app/lib/orchestrator/runtime-architecture-auditor.ts:export type RuntimeArchitectureAudit = {
app/lib/orchestrator/runtime-architecture-index.ts:export const runtimeArchitectureIndex: RuntimeArchitectureModule[] = [
app/lib/orchestrator/runtime-architecture-index.ts:export function getRuntimeArchitectureIndex() {
app/lib/orchestrator/runtime-architecture-index.ts:export type RuntimeArchitectureModule = {
app/lib/orchestrator/runtime-architecture-index.ts:export type RuntimeLayer =
app/lib/orchestrator/runtime-autonomous-decision.ts:export function createAutonomousDecision(
app/lib/orchestrator/runtime-autonomous-decision.ts:export type RuntimeAutonomousDecision = {
app/lib/orchestrator/runtime-autonomous-stabilizer.ts:export function evaluateAutonomousStabilization(
app/lib/orchestrator/runtime-autonomous-stabilizer.ts:export type RuntimeAutonomousState = {
app/lib/orchestrator/runtime-awareness.ts:export function evaluateRuntimeAwareness(
app/lib/orchestrator/runtime-awareness.ts:export type RuntimeAwareness = {
app/lib/orchestrator/runtime-budget-control.ts:export function evaluateRuntimeBudget(
app/lib/orchestrator/runtime-budget-control.ts:export type RuntimeBudgetResult = {
app/lib/orchestrator/runtime-conscious-loop.ts:export function executeRuntimeConsciousLoop():
app/lib/orchestrator/runtime-conscious-loop.ts:export type RuntimeConsciousState = {
app/lib/orchestrator/runtime-context.ts:export function appendRuntimeTrace(
app/lib/orchestrator/runtime-context.ts:export function createRuntimeContext(input?: Partial<RuntimeContext>): RuntimeContext {
app/lib/orchestrator/runtime-context.ts:export function getLastRuntimeState(): RuntimeContext | null {
app/lib/orchestrator/runtime-context.ts:export function setLastRuntimeState(
app/lib/orchestrator/runtime-context.ts:export type RuntimeContext = {
app/lib/orchestrator/runtime-context.ts:export type RuntimeMode = 'local' | 'openai' | 'hybrid' | 'safe'
app/lib/orchestrator/runtime-context.ts:export type RuntimeProvider = 'local' | 'openai' | 'hybrid'
app/lib/orchestrator/runtime-contracts.ts:export function validateAwarenessContract(
app/lib/orchestrator/runtime-contracts.ts:export function validateExecutionContract(
app/lib/orchestrator/runtime-contracts.ts:export function validateTelemetryContract(
app/lib/orchestrator/runtime-contracts.ts:export type RuntimeAwarenessContract = {
app/lib/orchestrator/runtime-contracts.ts:export type RuntimeContractStatus =
app/lib/orchestrator/runtime-contracts.ts:export type RuntimeContractValidation = {
app/lib/orchestrator/runtime-contracts.ts:export type RuntimeExecutionContract = {
app/lib/orchestrator/runtime-contracts.ts:export type RuntimeMemoryContract = {
app/lib/orchestrator/runtime-contracts.ts:export type RuntimePolicyContract = {
app/lib/orchestrator/runtime-contracts.ts:export type RuntimeRecoveryContract = {
app/lib/orchestrator/runtime-contracts.ts:export type RuntimeTelemetryContract = {
app/lib/orchestrator/runtime-coordinator.ts:export function coordinateRuntime(): RuntimeCoordinationReport {
app/lib/orchestrator/runtime-coordinator.ts:export type RuntimeCoordinationReport = {
app/lib/orchestrator/runtime-decision-engine.ts:export function executeRuntimeDecisionEngine() {
app/lib/orchestrator/runtime-dependency-graph.ts:export function buildRuntimeDependencyGraph(
app/lib/orchestrator/runtime-dependency-graph.ts:export type RuntimeDependencyGraph = {
app/lib/orchestrator/runtime-dependency-graph.ts:export type RuntimeDependencyNode = {
app/lib/orchestrator/runtime-dependency-scanner.ts:export function scanRuntimeDependencies(
app/lib/orchestrator/runtime-dependency-scanner.ts:export type RuntimeDependencyIssue = {
app/lib/orchestrator/runtime-dependency-scanner.ts:export type RuntimeDependencyScanReport = {
app/lib/orchestrator/runtime-dependency-validator.ts:export function validateRuntimeDependencies(): RuntimeDependencyReport {
app/lib/orchestrator/runtime-dependency-validator.ts:export type RuntimeDependencyIssue = {
app/lib/orchestrator/runtime-dependency-validator.ts:export type RuntimeDependencyReport = {
app/lib/orchestrator/runtime-enforcement.ts:export function enforceRuntimeExecution(
app/lib/orchestrator/runtime-enforcement.ts:export type RuntimeEnforcementResult = {
app/lib/orchestrator/runtime-event-bus.ts:export function emitRuntimeEvent(
app/lib/orchestrator/runtime-event-bus.ts:export function getRuntimeEvents() {
app/lib/orchestrator/runtime-event-bus.ts:export function getRuntimeEventsByType(
app/lib/orchestrator/runtime-event-bus.ts:export type RuntimeEvent = {
app/lib/orchestrator/runtime-event-processor.ts:export function processRuntimeEvent(
app/lib/orchestrator/runtime-event-processor.ts:export type RuntimeEventProcessingResult = {
app/lib/orchestrator/runtime-execution-control.ts:export function evaluateExecutionControl(
app/lib/orchestrator/runtime-execution-control.ts:export type RuntimeExecutionControlResult = {
app/lib/orchestrator/runtime-governor.ts:export function evaluateRuntimeGovernance(
app/lib/orchestrator/runtime-governor.ts:export type RuntimeGovernanceDecision = {
app/lib/orchestrator/runtime-graph-registry.ts:export const runtimeGraphRegistry = buildRuntimeDependencyGraph([
app/lib/orchestrator/runtime-guardian.ts:export function enforceRuntimeSafety() {
app/lib/orchestrator/runtime-incidents.ts:export function getRuntimeIncidents(): RuntimeIncident[] {
app/lib/orchestrator/runtime-incidents.ts:export function registerRuntimeIncident(
app/lib/orchestrator/runtime-incidents.ts:export type RuntimeIncident = {
app/lib/orchestrator/runtime-incidents.ts:export type RuntimeIncidentSeverity =
app/lib/orchestrator/runtime-intelligence.ts:export function analyzeRuntimeIntelligence(
app/lib/orchestrator/runtime-intelligence.ts:export type RuntimeIntelligenceReport = {
app/lib/orchestrator/runtime-lifecycle-manager.ts:export function getRuntimeLifecycle(): RuntimeLifecycleSnapshot {
app/lib/orchestrator/runtime-lifecycle-manager.ts:export function isRuntimeDegraded(): boolean {
app/lib/orchestrator/runtime-lifecycle-manager.ts:export function isRuntimeOperational(): boolean {
app/lib/orchestrator/runtime-lifecycle-manager.ts:export function isRuntimeRecovering(): boolean {
app/lib/orchestrator/runtime-lifecycle-manager.ts:export function transitionRuntimeLifecycle(
app/lib/orchestrator/runtime-lifecycle-manager.ts:export type RuntimeLifecycleSnapshot = {
app/lib/orchestrator/runtime-lifecycle-manager.ts:export type RuntimeLifecycleState =
app/lib/orchestrator/runtime-lifecycle-manager.ts:export type RuntimeLifecycleTransition = {
app/lib/orchestrator/runtime-limiter.ts:export function getRuntimeLimits() {
app/lib/orchestrator/runtime-limiter.ts:export function isLimitExceeded(data: {
app/lib/orchestrator/runtime-memory.ts:export function evaluateRuntimeMemory(
app/lib/orchestrator/runtime-memory.ts:export type RuntimeMemoryState = {
app/lib/orchestrator/runtime-operational-memory.ts:export function getCriticalRuntimeEvents() {
app/lib/orchestrator/runtime-operational-memory.ts:export function getRuntimeOperationalMemory() {
app/lib/orchestrator/runtime-operational-memory.ts:export function registerRuntimeMemoryEvent(
app/lib/orchestrator/runtime-operational-memory.ts:export type RuntimeMemoryEvent = {
app/lib/orchestrator/runtime-policy-engine.ts:export function evaluateRuntimeIntelligencePolicy(
app/lib/orchestrator/runtime-policy-engine.ts:export type RuntimePolicyDecision = {
app/lib/orchestrator/runtime-policy.ts:export function evaluateRuntimePolicy(
app/lib/orchestrator/runtime-policy.ts:export type RuntimePolicyDecision = {
app/lib/orchestrator/runtime-provider-governor.ts:export function evaluateProviderGovernor(
app/lib/orchestrator/runtime-provider-governor.ts:export type RuntimeProviderGovernorResult = {
app/lib/orchestrator/runtime-recovery.ts:export function evaluateRuntimeRecovery(
app/lib/orchestrator/runtime-recovery.ts:export type RuntimeRecoveryPlan = {
app/lib/orchestrator/runtime-self-healing.ts:export function executeSelfHealing(
app/lib/orchestrator/runtime-self-healing.ts:export type RuntimeHealingResult = {
app/lib/orchestrator/runtime-snapshot.ts:export function persistRuntimeSnapshot(
app/lib/orchestrator/runtime-snapshot.ts:export function readRuntimeSnapshots():
app/lib/orchestrator/runtime-snapshot.ts:export type RuntimeSnapshot = {
app/lib/orchestrator/runtime-state-registry.ts:export function appendRuntimeWarning(
app/lib/orchestrator/runtime-state-registry.ts:export function getRuntimeRegistry(): RuntimeStateRegistry {
app/lib/orchestrator/runtime-state-registry.ts:export function updateRuntimeRegistry(
app/lib/orchestrator/runtime-state-registry.ts:export type RuntimeHealth =
app/lib/orchestrator/runtime-state-registry.ts:export type RuntimeStateRegistry = {
app/lib/orchestrator/runtime-structural-health.ts:export function evaluateStructuralHealth(
app/lib/orchestrator/runtime-structural-health.ts:export type RuntimeStructuralHealthReport = {
app/lib/orchestrator/runtime-supervisor.ts:export function evaluateRuntimeSupervisor(
app/lib/orchestrator/runtime-supervisor.ts:export function superviseRuntime() {
app/lib/orchestrator/runtime-supervisor.ts:export type RuntimeSupervisorReport = {
app/lib/orchestrator/runtime-task-planner.ts:export function createRuntimeTaskPlan(
app/lib/orchestrator/runtime-task-planner.ts:export type RuntimeTaskPlan = {
app/lib/orchestrator/runtime-task-planner.ts:export type RuntimeTaskStep = {
app/lib/orchestrator/runtime-telemetry.ts:export function generateRuntimeTelemetry(
app/lib/orchestrator/runtime-telemetry.ts:export type RuntimeTelemetry = {
app/lib/orchestrator/runtime-topology-validator.ts:export function validateRuntimeTopology(
app/lib/orchestrator/runtime-topology-validator.ts:export type RuntimeTopologyIssue = {
app/lib/orchestrator/runtime-topology-validator.ts:export type RuntimeTopologyReport = {
app/lib/orchestrator/runtime.ts:export function resolveRuntimeDecision(): RuntimeDecision {
app/lib/orchestrator/runtime.ts:export type RuntimeDecision = {
app/lib/orchestrator/self-healing.ts:export function executeSelfHealing() {
app/lib/orchestrator/state-engine.ts:export function getState(): IASeveroState {
app/lib/orchestrator/state-engine.ts:export function resetState(): IASeveroState {
app/lib/orchestrator/state-engine.ts:export function updateState(
app/lib/orchestrator/state-engine.ts:export type IASeveroState = {
app/lib/orchestrator/trace.ts:export function addTrace(trace: RuntimeTrace) {
app/lib/orchestrator/trace.ts:export function getRecentTraces() {
app/runtime/runtime-lifecycle.ts:export function runtimeLifecycle() {
app/runtime/runtime-manifest.ts:export const RUNTIME_MANIFEST = {
app/runtime/runtime-registry.ts:export const runtimeRegistry: RuntimeModule[] = [
app/runtime/runtime-registry.ts:export type RuntimeModule = {

## Import Map
app/lib/orchestrator/adaptive-protection.ts:import { runDiagnostics } from './diagnostics'
app/lib/orchestrator/adaptive-protection.ts:import { updateState } from './state-engine'
app/lib/orchestrator/audit-trail.ts:import { getRecentEvents } from './event-logger'
app/lib/orchestrator/audit-trail.ts:import { getRecentTraces } from './trace'
app/lib/orchestrator/audit-trail.ts:import { getState } from './state-engine'
app/lib/orchestrator/awareness-engine.ts:import { getOperationalMetrics } from './metrics'
app/lib/orchestrator/awareness-engine.ts:import { getState } from './state-engine'
app/lib/orchestrator/awareness-engine.ts:import { runDiagnostics } from './diagnostics'
app/lib/orchestrator/central-runtime-core.ts:import { evaluateRuntimeEvolution } from './evolution-engine'
app/lib/orchestrator/central-runtime-core.ts:import { executeSelfHealing } from './self-healing'
app/lib/orchestrator/central-runtime-core.ts:import { persistRuntimeSnapshot } from './runtime-snapshot'
app/lib/orchestrator/central-runtime-core.ts:import { superviseRuntime } from './runtime-supervisor'
app/lib/orchestrator/decision-pipeline.ts:import { addTrace } from './trace'
app/lib/orchestrator/decision-pipeline.ts:import { createEvent } from './events'
app/lib/orchestrator/decision-pipeline.ts:import { evaluatePolicy } from './policy'
app/lib/orchestrator/decision-pipeline.ts:import { executeRoute } from './executor'
app/lib/orchestrator/decision-pipeline.ts:import { logEvent } from './event-logger'
app/lib/orchestrator/decision-pipeline.ts:import { resolveProviderRoute } from './routing'
app/lib/orchestrator/diagnostics.ts:import { getOperationalMetrics } from './metrics'
app/lib/orchestrator/event-logger.ts:import { IASeveroEvent } from './events'
app/lib/orchestrator/evolution-engine.ts:import { analyzeRuntimePatterns } from './learning-engine'
app/lib/orchestrator/evolution-engine.ts:import { getRuntimeAwareness } from './awareness-engine'
app/lib/orchestrator/health-intelligence.ts:import { getOperationalMetrics } from './metrics'
app/lib/orchestrator/health-intelligence.ts:import { getState } from './state-engine'
app/lib/orchestrator/health-intelligence.ts:import { runDiagnostics } from './diagnostics'
app/lib/orchestrator/hybrid-router.ts:import { getRuntimeAwareness } from './awareness-engine'
app/lib/orchestrator/hybrid-router.ts:import { selectBestProvider } from './intelligent-selector'
app/lib/orchestrator/intelligent-selector.ts:import { getProviderReputation } from './provider-reputation'
app/lib/orchestrator/learning-engine.ts:import { getRecentDecisions } from './decision-memory'
app/lib/orchestrator/metrics.ts:import { getMemoryPolicy } from './memory-governor'
app/lib/orchestrator/metrics.ts:import { getRecentEvents } from './event-logger'
app/lib/orchestrator/metrics.ts:import { getRecentTraces } from './trace'
app/lib/orchestrator/metrics.ts:import { getState } from './state-engine'
app/lib/orchestrator/routing.ts:import { createEvent } from './events'
app/lib/orchestrator/routing.ts:import { evaluatePolicy } from './policy'
app/lib/orchestrator/routing.ts:import { logEvent } from './event-logger'
app/lib/orchestrator/routing.ts:import { resolveRuntimeDecision } from './runtime'
app/lib/orchestrator/runtime-architecture-auditor.ts:import { analyzeRuntimeIntelligence } from './runtime-intelligence'
app/lib/orchestrator/runtime-architecture-auditor.ts:import { evaluateStructuralHealth } from './runtime-structural-health'
app/lib/orchestrator/runtime-architecture-auditor.ts:import { runtimeGraphRegistry } from './runtime-graph-registry'
app/lib/orchestrator/runtime-architecture-auditor.ts:import { validateRuntimeTopology } from './runtime-topology-validator'
app/lib/orchestrator/runtime-autonomous-decision.ts:import {
app/lib/orchestrator/runtime-autonomous-stabilizer.ts:import type { RuntimeAwareness } from './runtime-awareness'
app/lib/orchestrator/runtime-autonomous-stabilizer.ts:import type { RuntimeRecoveryPlan } from './runtime-recovery'
app/lib/orchestrator/runtime-awareness.ts:import type { RuntimeStateRegistry } from './runtime-state-registry'
app/lib/orchestrator/runtime-budget-control.ts:import type { RuntimeContext } from './runtime-context'
app/lib/orchestrator/runtime-conscious-loop.ts:import {
app/lib/orchestrator/runtime-conscious-loop.ts:import {
app/lib/orchestrator/runtime-conscious-loop.ts:import {
app/lib/orchestrator/runtime-coordinator.ts:import {
app/lib/orchestrator/runtime-coordinator.ts:import {
app/lib/orchestrator/runtime-decision-engine.ts:import { analyzeRuntimeIntelligence } from './runtime-intelligence'
app/lib/orchestrator/runtime-decision-engine.ts:import { createRuntimeContext, appendRuntimeTrace, type RuntimeMode, type RuntimeProvider } from './runtime-context'
app/lib/orchestrator/runtime-decision-engine.ts:import { enforceRuntimeExecution } from './runtime-enforcement'
app/lib/orchestrator/runtime-decision-engine.ts:import { evaluateAutonomousStabilization } from './runtime-autonomous-stabilizer'
app/lib/orchestrator/runtime-decision-engine.ts:import { evaluateExecutionControl } from './runtime-execution-control'
app/lib/orchestrator/runtime-decision-engine.ts:import { evaluateProviderGovernor } from './runtime-provider-governor'
app/lib/orchestrator/runtime-decision-engine.ts:import { evaluateRuntimeAwareness } from './runtime-awareness'
app/lib/orchestrator/runtime-decision-engine.ts:import { evaluateRuntimeBudget } from './runtime-budget-control'
app/lib/orchestrator/runtime-decision-engine.ts:import { evaluateRuntimeGovernance } from './runtime-governor'
app/lib/orchestrator/runtime-decision-engine.ts:import { evaluateRuntimeIntelligencePolicy } from './runtime-policy-engine'
app/lib/orchestrator/runtime-decision-engine.ts:import { evaluateRuntimeMemory } from './runtime-memory'
app/lib/orchestrator/runtime-decision-engine.ts:import { evaluateRuntimePolicy } from './runtime-policy'
app/lib/orchestrator/runtime-decision-engine.ts:import { evaluateRuntimeRecovery } from './runtime-recovery'
app/lib/orchestrator/runtime-decision-engine.ts:import { executeRuntimeConsciousLoop } from './runtime-conscious-loop'
app/lib/orchestrator/runtime-decision-engine.ts:import { executeSelfHealing } from './self-healing'
app/lib/orchestrator/runtime-decision-engine.ts:import { generateRuntimeTelemetry } from './runtime-telemetry'
app/lib/orchestrator/runtime-decision-engine.ts:import { persistRuntimeSnapshot, readRuntimeSnapshots } from './runtime-snapshot'
app/lib/orchestrator/runtime-decision-engine.ts:import { registerRuntimeIncident } from './runtime-incidents'
app/lib/orchestrator/runtime-decision-engine.ts:import { resolveHybridProvider } from './hybrid-router'
app/lib/orchestrator/runtime-decision-engine.ts:import { transitionRuntimeLifecycle } from './runtime-lifecycle-manager'
app/lib/orchestrator/runtime-decision-engine.ts:import { updateRuntimeRegistry, appendRuntimeWarning } from './runtime-state-registry'
app/lib/orchestrator/runtime-dependency-validator.ts:import {
app/lib/orchestrator/runtime-enforcement.ts:import type { RuntimeContext } from './runtime-context'
app/lib/orchestrator/runtime-enforcement.ts:import type { RuntimeGovernanceDecision } from './runtime-governor'
app/lib/orchestrator/runtime-event-processor.ts:import {
app/lib/orchestrator/runtime-event-processor.ts:import {
app/lib/orchestrator/runtime-execution-control.ts:import type { RuntimeContext } from './runtime-context'
app/lib/orchestrator/runtime-governor.ts:import type { RuntimeContext } from './runtime-context'
app/lib/orchestrator/runtime-governor.ts:import type { RuntimePolicyDecision } from './runtime-policy'
app/lib/orchestrator/runtime-graph-registry.ts:import { buildRuntimeDependencyGraph } from './runtime-dependency-graph'
app/lib/orchestrator/runtime-guardian.ts:import { getOperationalMetrics } from './metrics'
app/lib/orchestrator/runtime-guardian.ts:import { isLimitExceeded } from './runtime-limiter'
app/lib/orchestrator/runtime-guardian.ts:import { updateState } from './state-engine'
app/lib/orchestrator/runtime-intelligence.ts:import type { RuntimeSnapshot } from './runtime-snapshot'
app/lib/orchestrator/runtime-memory.ts:import type { RuntimeContext } from './runtime-context'
app/lib/orchestrator/runtime-policy-engine.ts:import type { RuntimeIntelligenceReport } from './runtime-intelligence'
app/lib/orchestrator/runtime-policy.ts:import type { RuntimeContext } from './runtime-context'
app/lib/orchestrator/runtime-provider-governor.ts:import type { RuntimeContext } from './runtime-context'
app/lib/orchestrator/runtime-recovery.ts:import type { RuntimeAwareness } from './runtime-awareness'
app/lib/orchestrator/runtime-self-healing.ts:import {
app/lib/orchestrator/runtime-snapshot.ts:import fs from 'fs'
app/lib/orchestrator/runtime-snapshot.ts:import path from 'path'
app/lib/orchestrator/runtime-structural-health.ts:import type { RuntimeIntelligenceReport } from './runtime-intelligence'
app/lib/orchestrator/runtime-structural-health.ts:import type { RuntimeTopologyReport } from './runtime-topology-validator'
app/lib/orchestrator/runtime-supervisor.ts:import type { RuntimeAwareness } from './runtime-awareness'
app/lib/orchestrator/runtime-supervisor.ts:import type { RuntimeIntelligenceReport } from './runtime-intelligence'
app/lib/orchestrator/runtime-supervisor.ts:import type { RuntimeStructuralHealthReport } from './runtime-structural-health'
app/lib/orchestrator/runtime-supervisor.ts:import type { RuntimeTopologyReport } from './runtime-topology-validator'
app/lib/orchestrator/runtime-telemetry.ts:import {
app/lib/orchestrator/runtime-topology-validator.ts:import type { RuntimeDependencyGraph } from './runtime-dependency-graph'
app/lib/orchestrator/runtime.ts:import { getRuntimeStatus } from '../env'
app/lib/orchestrator/self-healing.ts:import { clearDecisionMemory } from './decision-memory'
app/lib/orchestrator/self-healing.ts:import { clearQueue } from './queue-governor'
app/lib/orchestrator/self-healing.ts:import { resetState } from './state-engine'
app/lib/orchestrator/self-healing.ts:import { runDiagnostics } from './diagnostics'
