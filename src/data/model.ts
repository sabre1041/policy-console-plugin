import { K8sGroupVersionKind, K8sResourceCommon } from "@openshift-console/dynamic-plugin-sdk";
import { K8sModel } from "@openshift-console/dynamic-plugin-sdk/lib/api/common-types";


export const policyReportKind: K8sGroupVersionKind = {
    version: 'v1alpha1',
    group: 'wgpolicyk8s.io',
    kind: 'PolicyReport',
};

export const clusterPolicyReportKind: K8sGroupVersionKind = {
    version: 'v1alpha1',
    group: 'wgpolicyk8s.io',
    kind: 'ClusterPolicyReport',
};

export const clusterPolicyReportStringKind = `${clusterPolicyReportKind.group}~${clusterPolicyReportKind.version}~${clusterPolicyReportKind.kind}`;
export const policyReportStringKind = `${policyReportKind.group}~${policyReportKind.version}~${policyReportKind.kind}`;

export type ClusterPolicyReport = {
    summary?: {
        pass: number,
        fail: number,
        warn: number,
        error: number,
        skip: number
    }
} & K8sResourceCommon;


export type PolicyReport = {
    summary?: {
        pass: number,
        fail: number,
        warn: number,
        error: number,
        skip: number
    }
} & K8sResourceCommon;

export const PolicyReportModel: K8sModel = {
    apiVersion: policyReportKind.version,
    apiGroup: policyReportKind.group,
    label: policyReportKind.kind,
    labelKey: policyReportKind.kind,
    plural: "policyreports",
    abbr: "POLR",
    namespaced: true,
    crd: true,
    kind: policyReportKind.kind,
    id: "policyReport",
    labelPlural: "PolicyReports",
    labelPluralKey: "PolicyReports",
};

export const ClusterPolicyReportModel: K8sModel = {
    apiVersion: clusterPolicyReportKind.version,
    apiGroup: clusterPolicyReportKind.group,
    label: clusterPolicyReportKind.kind,
    labelKey: clusterPolicyReportKind.kind,
    plural: "clusterpolicyreports",
    abbr: "CPOLR",
    namespaced: false,
    crd: true,
    kind: clusterPolicyReportKind.kind,
    id: "clusterPolicyReport",
    labelPlural: "ClusterPolicyReports",
    labelPluralKey: "ClusterPolicyReports",
};

