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
    RowFilter,
    useK8sWatchResource,
    useListPageFilter,
    useActiveColumns
} from '@openshift-console/dynamic-plugin-sdk';
import { sortable } from '@patternfly/react-table';
import { CubesIcon } from '@patternfly/react-icons';
import {
    EmptyState,
    EmptyStateBody,
    EmptyStateIcon,
} from '@patternfly/react-core';
import { useParams } from "react-router";
import { PolicyReport, policyReportKind } from './../data/model';

type PolicyReportTableProps = {
    data: PolicyReport[];
    unfilteredData: PolicyReport[];
    loaded: boolean;
    loadError: any;
};

const NoDataEmptyMsg = () => {
    const { t } = useTranslation();
    return (
        <EmptyState>
            <EmptyStateIcon icon={CubesIcon} />
            <EmptyStateBody>{t('No PolicyReports found')}</EmptyStateBody>
        </EmptyState>
    );
};


const tableColumns = () => {
    const { t } = useTranslation();
    const columns = React.useMemo<TableColumn<PolicyReport>[]>(
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

    const [activeColumns] = useActiveColumns({
        columns,
        showNamespaceOverride: false,
        columnManagementID: '',
    });

    return activeColumns;

}


const PolicyReportRow: React.FC<RowProps<PolicyReport>> = ({ obj, activeColumnIDs }) => {
    return (
        <>
            <TableData id="name" activeColumnIDs={activeColumnIDs}>
                <ResourceLink groupVersionKind={policyReportKind} name={obj.metadata.name} namespace={obj.metadata.namespace} />
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



const PolicyReportTable: React.FC<PolicyReportTableProps> = ({ data, unfilteredData, loaded, loadError }) => {

    return (
        <VirtualizedTable<PolicyReport>
            data={data}
            unfilteredData={unfilteredData}
            loaded={loaded}
            loadError={loadError}
            columns={tableColumns()}
            Row={PolicyReportRow}
            NoDataEmptyMsg={NoDataEmptyMsg}
        />
    );
};

export const filters: RowFilter[] = [
    {
        filterGroupName: 'Result type',
        type: 'result type',
        reducer: (policyreport) => (policyreport.metadata.name.includes('kube-scheduler') ? 'scheduler' : 'other'),
        filter: (input, policyreport) => {
            if (input.selected?.length) {
                if (policyreport.metadata.name.includes('kube-scheduler')) {
                    return input.selected.includes('scheduler');
                }
                if (!policyreport.metadata.name.includes('kube-scheduler')) {
                    return input.selected.includes('other');
                }
            }
            return true;
        },
        items: [
            { id: 'error', title: 'Error' },
            { id: 'fail', title: 'Fail' },
            { id: 'pass', title: 'Pass' },
            { id: 'skip', title: 'Skip' },
            { id: 'warn', title: 'Warn' },
        ],
    },
];



const PolicyReportPage = () => {
    const { ns } = useParams<{ ns: string }>();
    const [policyreports, loaded, loadError] = useK8sWatchResource<PolicyReport[]>({
        groupVersionKind: policyReportKind,
        isList: true,
        namespace: ns,
        namespaced: true,
    });

    const [data, filteredData, onFilterChange] = useListPageFilter(policyreports);

    return (
        <>
            <ListPageHeader title="PolicyReports" />
            <ListPageBody>
                <ListPageFilter
                    data={data}
                    loaded={loaded}
                    onFilterChange={onFilterChange}
                    hideColumnManagement={true}
                />
                <PolicyReportTable
                    data={filteredData}
                    unfilteredData={policyreports}
                    loaded={loaded}
                    loadError={loadError}
                />
            </ListPageBody>
        </>
    );

}

export default PolicyReportPage;