import {
    SetFeatureFlag,
    k8sList,
} from '@openshift-console/dynamic-plugin-sdk';
import { ClusterPolicyReportModel, ClusterPolicyReport } from './../data/model';


const CLUSTERPOLICYREPORT_ACCESS_FLAG = 'CLUSTERPOLICYREPORT_ACCESS_FLAG';

export const detectAccessClusterPolicyReport: FeatureDetector = async (
    setFlag: SetFeatureFlag
) => {
    let clusterPolicyReportIntervalId = null;
    const clusterPolicyReportAccessDetector = async () => {
        k8sList<ClusterPolicyReport>({
            model: ClusterPolicyReportModel,
            queryParams: { namespace: "" },
            requestInit: null,
        })
            .then(() => {
                setFlag(CLUSTERPOLICYREPORT_ACCESS_FLAG, true);
                clearInterval(clusterPolicyReportIntervalId);

            })
            .catch((e) => {
                console.error('Could not fetch ClusterPolicyReport', e);
                setFlag(CLUSTERPOLICYREPORT_ACCESS_FLAG, false);
            });

        setFlag(CLUSTERPOLICYREPORT_ACCESS_FLAG, false);

    };

    clusterPolicyReportAccessDetector();
    clusterPolicyReportIntervalId = setInterval(clusterPolicyReportAccessDetector, 15 * (60 * 1000));

}


export type FeatureDetector = (setFlag: SetFeatureFlag) => Promise<void>;
