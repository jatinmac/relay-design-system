import { AccessManagementPage } from '@relay/product-access';
import { Button, Stack } from '@relay/react';

import type { DemoScenario } from './api/scenarios';
import { useAccessManagement } from './hooks/useAccessManagement';
import styles from './App.module.css';

export interface AccessManagementContainerProps {
  scenario: DemoScenario;
}

export function AccessManagementContainer({
  scenario,
}: AccessManagementContainerProps) {
  const model = useAccessManagement(scenario);
  const isRefreshing =
    model.collection.status === 'ready' && model.collection.refreshing === true;
  const isLoading = model.collection.status === 'loading';

  return (
    <Stack gap="lg">
      <div className={styles.integrationBar}>
        <span>
          Application container → product composition → universal components
        </span>
        <Button
          variant="secondary"
          size="sm"
          loading={isRefreshing}
          disabled={isLoading}
          onClick={() => void model.onRefresh()}
        >
          {isRefreshing ? 'Refreshing data' : 'Refresh data'}
        </Button>
      </div>
      <AccessManagementPage
        collection={model.collection}
        permissions={model.permissions}
        selection={model.selection}
        sort={model.sort}
        inviteState={model.inviteState}
        memberMutationState={model.memberMutationState}
        onSelectionChange={model.onSelectionChange}
        onSortChange={model.onSortChange}
        onInviteMember={model.onInviteMember}
        onChangeRole={model.onChangeRole}
        onRemoveMember={model.onRemoveMember}
      />
    </Stack>
  );
}

AccessManagementContainer.displayName = 'AccessManagementContainer';
