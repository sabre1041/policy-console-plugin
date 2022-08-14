import * as React from 'react';

import { useTranslation } from '../i18n';
import {
    ListPageHeader,
    ListPageBody,
    ListPageFilter,
    VirtualizedTable,
    TableColumn,
    TableData,
    RowProps,
    ResourceLink,
    useK8sWatchResource,
    useListPageFilter
} from '@openshift-console/dynamic-plugin-sdk';
import { sortable } from '@patternfly/react-table';
import { CubesIcon } from '@patternfly/react-icons';
import {
    EmptyState,
    EmptyStateBody,
    EmptyStateIcon,
} from '@patternfly/react-core';
import { useParams } from "react-router";
import { ClusterPolicyReport, clusterPolicyReportKind } from './../data/model';


type ClusterPolicyReportTableProps = {
    data: ClusterPolicyReport[];
    unfilteredData: ClusterPolicyReport[];
    loaded: boolean;
    loadError: any;
};

const NoDataEmptyMsg = () => {
    const { t } = useTranslation();
    return (
        <EmptyState>
            <EmptyStateIcon icon={CubesIcon} />
            <EmptyStateBody>{t('No ClusterPolicyReports found')}</EmptyStateBody>
        </EmptyState>
    );
};


const tableColumns = () => {
    const { t } = useTranslation();
    const columns = React.useMemo<TableColumn<ClusterPolicyReport>[]>(
        () => [
            {
                title: 'Name',
                transforms: [sortable],
                sort: 'metadata.name',
                id: 'name',
            },
            {
                title: 'Namespace',
                sort: 'metadata.namespace',
                id: 'namespace',
                transforms: [sortable],
            },
            {
                title: 'Pass',
                sort: 'summary.pass',
                id: 'pass',
                transforms: [sortable],
            },
            {
                title: 'Fail',
                sort: 'summary.fail',
                id: 'fail',
                transforms: [sortable],
            },
            {
                title: 'Warn',
                sort: 'summary.warn',
                id: 'warn',
                transforms: [sortable],
            },
            {
                title: 'Error',
                sort: 'summary.error',
                id: 'error',
                transforms: [sortable],
            },
            {
                title: 'Skip',
                sort: 'summary.skip',
                id: 'skip',
                transforms: [sortable],
            },
        ],
        [t],
    );

    return columns;

}


const ClusterPolicyReportRow: React.FC<RowProps<ClusterPolicyReport>> = ({ obj, activeColumnIDs }) => {
    return (
        <>
            <TableData id="name" activeColumnIDs={activeColumnIDs}>
                <ResourceLink groupVersionKind={clusterPolicyReportKind} name={obj.metadata.name} namespace={obj.metadata.namespace} />
            </TableData>
            <TableData id="namespace" activeColumnIDs={activeColumnIDs}>
                <ResourceLink kind="Namespace" name={obj.metadata.namespace} />
            </TableData>
            <TableData id="pass" activeColumnIDs={activeColumnIDs}>
                {obj.summary?.pass || '0'}
            </TableData>
            <TableData id="fail" activeColumnIDs={activeColumnIDs}>
                {obj.summary?.fail || '0'}
            </TableData>
            <TableData id="warn" activeColumnIDs={activeColumnIDs}>
                {obj.summary?.warn || '0'}
            </TableData>
            <TableData id="error" activeColumnIDs={activeColumnIDs}>
                {obj.summary?.error || '0'}
            </TableData>
            <TableData id="skip" activeColumnIDs={activeColumnIDs}>
                {obj.summary?.skip || '0'}
            </TableData>
        </>
    );
};



const ClusterPolicyReportTable: React.FC<ClusterPolicyReportTableProps> = ({ data, unfilteredData, loaded, loadError }) => {

    return (
        <VirtualizedTable<ClusterPolicyReport>
            data={data}
            unfilteredData={unfilteredData}
            loaded={loaded}
            loadError={loadError}
            columns={tableColumns()}
            Row={ClusterPolicyReportRow}
            NoDataEmptyMsg={NoDataEmptyMsg}
        />
    );
};


const ClusterPolicyReportPage = () => {
    const { ns } = useParams<{ ns: string }>();
    const [clusterPolicyReports, loaded, loadError] = useK8sWatchResource<ClusterPolicyReport[]>({
        groupVersionKind: clusterPolicyReportKind,
        isList: true,
        namespace: ns,
        namespaced: true,
    });

    const [data, filteredData, onFilterChange] = useListPageFilter(clusterPolicyReports);

    return (
        <>
            <ListPageHeader title="ClusterPolicyReports" />
            <ListPageBody>
                <ListPageFilter
                    data={data}
                    loaded={loaded}
                    onFilterChange={onFilterChange}
                    hideColumnManagement={true}
                />
                <ClusterPolicyReportTable
                    data={filteredData}
                    unfilteredData={clusterPolicyReports}
                    loaded={loaded}
                    loadError={loadError}
                />
            </ListPageBody>
        </>
    );

}

export default ClusterPolicyReportPage;