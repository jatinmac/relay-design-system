import type {
  AccessMember,
  AccessPermissions,
  AccessRole,
  InviteMemberInput,
} from '@relay/product-access';
import type { SortDescriptor } from '@relay/react';

import type { DemoScenario } from './scenarios';

export interface AccessSnapshot {
  members: AccessMember[];
  permissions: AccessPermissions;
}

const ownerPermissions: AccessPermissions = {
  canInvite: true,
  canChangeRoles: true,
  canRemoveMembers: true,
};

const viewerPermissions: AccessPermissions = {
  canInvite: false,
  canChangeRoles: false,
  canRemoveMembers: false,
  restrictionReason:
    'Only workspace owners and administrators can manage member access.',
};

const initialMembers: AccessMember[] = [
  {
    id: 'member-owner',
    name: 'Avery Stone',
    email: 'avery@example.com',
    role: 'owner',
    status: 'active',
    lastActiveLabel: 'Today at 09:42',
  },
  {
    id: 'member-admin',
    name: 'Samira Okafor',
    email: 'samira@example.com',
    role: 'admin',
    status: 'active',
    lastActiveLabel: 'Yesterday',
  },
  {
    id: 'member-viewer',
    name: 'Morgan Lee',
    email: 'morgan@example.com',
    role: 'viewer',
    status: 'active',
    lastActiveLabel: '3 days ago',
  },
  {
    id: 'member-pending',
    name: 'Pending invitation',
    email: 'new.member@example.com',
    role: 'editor',
    status: 'pending',
  },
];

const edgeOnlyMembers: AccessMember[] = [
  {
    id: 'member-long',
    name: 'Dr. Ana María de la Cruz-Watanabe with an intentionally extended localized display name',
    email:
      'ana.maria.de.la.cruz-watanabe+international-collaboration@example.company',
    role: 'editor',
    status: 'active',
    lastActiveLabel: 'Heute um 14:07 Uhr',
  },
  {
    id: 'member-incomplete',
    name: 'プロフィール未完了',
    role: 'viewer',
    status: 'pending',
  },
];

const edgeMemberIds = new Set(edgeOnlyMembers.map((member) => member.id));

let memberStore = structuredClone([...initialMembers, ...edgeOnlyMembers]);
let nextMemberId = 1;

export function resetMockApi() {
  memberStore = structuredClone([...initialMembers, ...edgeOnlyMembers]);
  nextMemberId = 1;
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function scenarioFromUrl(url: URL): DemoScenario {
  return (url.searchParams.get('scenario') ?? 'success') as DemoScenario;
}

function latencyFor(scenario: DemoScenario) {
  return scenario === 'refreshing' ? 850 : 240;
}

function delay(milliseconds: number) {
  return new Promise<void>((resolve) => {
    globalThis.setTimeout(resolve, milliseconds);
  });
}

function sortMembers(
  members: AccessMember[],
  sort: SortDescriptor,
): AccessMember[] {
  const collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: 'base',
  });
  const direction = sort.direction === 'ascending' ? 1 : -1;

  return [...members].sort((left, right) => {
    const leftValue = String(left[sort.column as keyof AccessMember] ?? '');
    const rightValue = String(right[sort.column as keyof AccessMember] ?? '');
    return collator.compare(leftValue, rightValue) * direction;
  });
}

function permissionsFor(scenario: DemoScenario) {
  return scenario === 'restricted' ? viewerPermissions : ownerPermissions;
}

async function parseJson<T>(request: Request): Promise<T> {
  return (await request.json()) as T;
}

async function handleAccessRequest(
  url: URL,
  scenario: DemoScenario,
): Promise<Response> {
  if (scenario === 'request-error') {
    return jsonResponse(
      { message: 'The member service is temporarily unavailable.' },
      503,
    );
  }

  const sort: SortDescriptor = {
    column: url.searchParams.get('sortColumn') ?? 'name',
    direction:
      url.searchParams.get('sortDirection') === 'descending'
        ? 'descending'
        : 'ascending',
  };
  const sourceMembers =
    scenario === 'edge-cases'
      ? memberStore
      : scenario === 'empty'
        ? []
        : memberStore.filter((member) => !edgeMemberIds.has(member.id));

  return jsonResponse({
    members: sortMembers(sourceMembers, sort),
    permissions: permissionsFor(scenario),
  } satisfies AccessSnapshot);
}

async function handleInvite(
  request: Request,
  scenario: DemoScenario,
): Promise<Response> {
  if (!permissionsFor(scenario).canInvite) {
    return jsonResponse(
      { message: 'You do not have permission to invite.' },
      403,
    );
  }
  if (scenario === 'mutation-error') {
    return jsonResponse(
      { message: 'The invitation service rejected this request.' },
      500,
    );
  }

  const input = await parseJson<InviteMemberInput>(request);
  const duplicate = memberStore.some(
    (member) => member.email?.toLowerCase() === input.email.toLowerCase(),
  );
  if (duplicate) {
    return jsonResponse(
      { message: 'That email already belongs to a workspace member.' },
      409,
    );
  }

  const createdMember: AccessMember = {
    id: `member-invited-${nextMemberId}`,
    name: 'Pending invitation',
    email: input.email,
    role: input.role,
    status: 'pending',
  };
  nextMemberId += 1;
  memberStore = [...memberStore, createdMember];
  return jsonResponse(createdMember, 201);
}

async function handleRoleChange(
  request: Request,
  scenario: DemoScenario,
  memberId: string,
): Promise<Response> {
  if (!permissionsFor(scenario).canChangeRoles) {
    return jsonResponse(
      { message: 'You do not have permission to change roles.' },
      403,
    );
  }
  if (scenario === 'mutation-error') {
    return jsonResponse(
      { message: 'The role update failed and was rolled back.' },
      500,
    );
  }

  const input = await parseJson<{ role: AccessRole }>(request);
  const member = memberStore.find((candidate) => candidate.id === memberId);
  if (!member) {
    return jsonResponse({ message: 'Member not found.' }, 404);
  }
  if (member.role === 'owner') {
    return jsonResponse({ message: 'The owner role cannot be changed.' }, 409);
  }

  const updatedMember = { ...member, role: input.role };
  memberStore = memberStore.map((candidate) =>
    candidate.id === memberId ? updatedMember : candidate,
  );
  return jsonResponse(updatedMember);
}

function handleRemoval(scenario: DemoScenario, memberId: string): Response {
  if (!permissionsFor(scenario).canRemoveMembers) {
    return jsonResponse(
      { message: 'You do not have permission to remove members.' },
      403,
    );
  }
  if (scenario === 'mutation-error') {
    return jsonResponse(
      { message: 'The removal failed and was rolled back.' },
      500,
    );
  }

  const member = memberStore.find((candidate) => candidate.id === memberId);
  if (!member) {
    return jsonResponse({ message: 'Member not found.' }, 404);
  }
  if (member.role === 'owner') {
    return jsonResponse(
      { message: 'The workspace owner cannot be removed.' },
      409,
    );
  }

  memberStore = memberStore.filter((candidate) => candidate.id !== memberId);
  return new Response(null, { status: 204 });
}

export async function mockApiFetch(
  input: string,
  init?: RequestInit,
): Promise<Response> {
  const origin =
    typeof window === 'undefined'
      ? 'http://relay.local'
      : window.location.origin;
  const request = new Request(new URL(input, origin), init);
  const url = new URL(request.url);
  const scenario = scenarioFromUrl(url);

  if (scenario === 'loading' && request.method === 'GET') {
    return new Promise<Response>(() => undefined);
  }

  await delay(latencyFor(scenario));

  if (request.method === 'GET' && url.pathname === '/api/access') {
    return handleAccessRequest(url, scenario);
  }

  if (request.method === 'POST' && url.pathname === '/api/members') {
    return handleInvite(request, scenario);
  }

  const memberMatch = url.pathname.match(/^\/api\/members\/([^/]+)$/);
  const memberId = memberMatch?.[1];
  if (memberId && request.method === 'PATCH') {
    return handleRoleChange(request, scenario, memberId);
  }
  if (memberId && request.method === 'DELETE') {
    return handleRemoval(scenario, memberId);
  }

  return jsonResponse({ message: 'Mock endpoint not found.' }, 404);
}
