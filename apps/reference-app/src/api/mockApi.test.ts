import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { mockApiFetch, resetMockApi, type AccessSnapshot } from './mockApi';

async function settle<T>(promise: Promise<T>) {
  await vi.advanceTimersByTimeAsync(1000);
  return promise;
}

describe('mock HTTP API', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    resetMockApi();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns sorted successful, empty, error, and restricted responses', async () => {
    const successResponse = await settle(
      mockApiFetch(
        '/api/access?scenario=success&sortColumn=name&sortDirection=descending',
      ),
    );
    const success = (await successResponse.json()) as AccessSnapshot;
    expect(successResponse.status).toBe(200);
    expect(success.members[0]?.name).toBe('Samira Okafor');

    const emptyResponse = await settle(
      mockApiFetch('/api/access?scenario=empty'),
    );
    const empty = (await emptyResponse.json()) as AccessSnapshot;
    expect(empty.members).toEqual([]);

    const errorResponse = await settle(
      mockApiFetch('/api/access?scenario=request-error'),
    );
    expect(errorResponse.status).toBe(503);

    const restrictedResponse = await settle(
      mockApiFetch('/api/access?scenario=restricted'),
    );
    const restricted = (await restrictedResponse.json()) as AccessSnapshot;
    expect(restricted.permissions.canInvite).toBe(false);
    expect(restricted.permissions.restrictionReason).toMatch(/owners/i);
  });

  it('models duplicate invitations and mutation failures as HTTP errors', async () => {
    const duplicateResponse = await settle(
      mockApiFetch('/api/members?scenario=success', {
        method: 'POST',
        body: JSON.stringify({
          email: 'avery@example.com',
          role: 'viewer',
        }),
      }),
    );
    expect(duplicateResponse.status).toBe(409);

    const failedRoleResponse = await settle(
      mockApiFetch('/api/members/member-viewer?scenario=mutation-error', {
        method: 'PATCH',
        body: JSON.stringify({ role: 'editor' }),
      }),
    );
    expect(failedRoleResponse.status).toBe(500);
    expect(await failedRoleResponse.json()).toEqual({
      message: 'The role update failed and was rolled back.',
    });
  });

  it('persists successful invitation, role, and removal mutations', async () => {
    const inviteResponse = await settle(
      mockApiFetch('/api/members?scenario=success', {
        method: 'POST',
        body: JSON.stringify({
          email: 'invited@example.com',
          role: 'editor',
        }),
      }),
    );
    expect(inviteResponse.status).toBe(201);

    const roleResponse = await settle(
      mockApiFetch('/api/members/member-viewer?scenario=success', {
        method: 'PATCH',
        body: JSON.stringify({ role: 'editor' }),
      }),
    );
    expect(roleResponse.status).toBe(200);

    const removalResponse = await settle(
      mockApiFetch('/api/members/member-admin?scenario=success', {
        method: 'DELETE',
      }),
    );
    expect(removalResponse.status).toBe(204);

    const accessResponse = await settle(
      mockApiFetch('/api/access?scenario=success'),
    );
    const snapshot = (await accessResponse.json()) as AccessSnapshot;
    expect(snapshot.members).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          email: 'invited@example.com',
          role: 'editor',
        }),
        expect.objectContaining({
          id: 'member-viewer',
          role: 'editor',
        }),
      ]),
    );
    expect(
      snapshot.members.some((member) => member.id === 'member-admin'),
    ).toBe(false);
  });
});
