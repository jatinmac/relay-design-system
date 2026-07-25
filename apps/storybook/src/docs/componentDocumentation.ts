import type {
  DocumentationContent,
  DocumentationSection,
} from './documentationTypes';

interface ComponentDocumentationInput {
  title: string;
  purpose: string;
  use: ReadonlyArray<string>;
  avoid: ReadonlyArray<string>;
  anatomy: ReadonlyArray<string>;
  publicApi: ReadonlyArray<string>;
  states: ReadonlyArray<string>;
  interaction: ReadonlyArray<string>;
  accessibility: ReadonlyArray<string>;
  responsive: ReadonlyArray<string>;
  tokens: ReadonlyArray<string>;
  integration: ReadonlyArray<string>;
  edgeCases: ReadonlyArray<string>;
  example: string;
  tests: ReadonlyArray<string>;
  changelog: string;
}

function createComponentDocumentation({
  title,
  purpose,
  use,
  avoid,
  anatomy,
  publicApi,
  states,
  interaction,
  accessibility,
  responsive,
  tokens,
  integration,
  edgeCases,
  example,
  tests,
  changelog,
}: ComponentDocumentationInput): DocumentationContent {
  const sections: ReadonlyArray<DocumentationSection> = [
    {
      title: 'Status and purpose',
      paragraphs: [`Beta in v0.1. ${purpose}`],
    },
    {
      title: 'When to use and avoid',
      bullets: [
        ...use.map((item) => `Use: ${item}`),
        ...avoid.map((item) => `Avoid: ${item}`),
      ],
    },
    {
      title: 'Anatomy and hierarchy',
      bullets: anatomy,
    },
    {
      title: 'Public API and slots',
      bullets: publicApi,
    },
    {
      title: 'Variants and state matrix',
      bullets: states,
    },
    {
      title: 'Interaction and keyboard behavior',
      bullets: interaction,
    },
    {
      title: 'Accessibility requirements',
      bullets: accessibility,
    },
    {
      title: 'Responsive behavior',
      bullets: responsive,
    },
    {
      title: 'Token dependencies',
      bullets: tokens,
    },
    {
      title: 'Integration responsibilities',
      bullets: integration,
    },
    {
      title: 'Edge cases and limitations',
      bullets: edgeCases,
    },
    {
      title: 'Executable example source',
      code: example,
    },
    {
      title: 'Test coverage and changelog',
      bullets: [...tests, `Changelog: ${changelog}`],
    },
  ];

  return {
    eyebrow: 'Component documentation',
    title,
    status: 'Beta · v0.1',
    summary: purpose,
    sections,
  };
}

export const componentDocumentation = {
  stack: createComponentDocumentation({
    title: 'Stack',
    purpose:
      'Stack provides token-governed one-dimensional layout without imposing product semantics.',
    use: [
      'Arrange related content in rows or columns with consistent semantic gaps.',
      'Choose a semantic wrapper through the as prop.',
    ],
    avoid: [
      'Use CSS Grid for genuinely two-dimensional placement.',
      'Do not use Stack to encode application breakpoints or domain anatomy.',
    ],
    anatomy: [
      'Semantic wrapper element.',
      'Ordered child content.',
      'Token gap.',
    ],
    publicApi: [
      'as selects the rendered element.',
      'direction: row | column.',
      'gap: none | xs | sm | md | lg | xl.',
      'align, justify, and wrap control flex behavior.',
      'Native props follow the selected element type.',
    ],
    states: [
      'Row and column directions.',
      'Six spacing roles.',
      'Start, center, end, stretch, and baseline alignment.',
      'Wrapping enabled or disabled.',
    ],
    interaction: [
      'Stack adds no interaction or keyboard behavior.',
      'Keyboard behavior comes from semantic children.',
    ],
    accessibility: [
      'Choose as="ul", as="nav", or another semantic element when structure carries meaning.',
      'Do not use visual order to contradict DOM order.',
    ],
    responsive: [
      'Children may wrap when wrap is enabled.',
      'Consumers own direction changes at page-level breakpoints.',
    ],
    tokens: ['--ds-space-layout-none through --ds-space-layout-xl.'],
    integration: [
      'Consumers own content, semantic element choice, and responsive page composition.',
    ],
    edgeCases: [
      'Large unbreakable content can still overflow.',
      'Stack intentionally exposes no arbitrary numeric gap.',
    ],
    example: `<Stack direction="row" gap="sm" align="center" wrap>
  <Button>Save</Button>
  <Button variant="secondary">Cancel</Button>
</Stack>`,
    tests: [
      'Covers defaults, semantic element rendering, alignment, gap, and wrapping.',
      'Theme coverage renders the component under Relay and Northstar.',
    ],
    changelog: 'Introduced as a beta universal layout primitive.',
  }),
  buttons: createComponentDocumentation({
    title: 'Button and IconButton',
    purpose:
      'Button communicates intent for labeled actions; IconButton provides the same behavior for compact icon-only actions.',
    use: [
      'Trigger immediate UI or application actions.',
      'Use IconButton only when a concise accessible name is available.',
    ],
    avoid: [
      'Use links for navigation.',
      'Do not use critical styling for non-destructive emphasis.',
    ],
    anatomy: [
      'Native button element.',
      'Optional leading icon, label, and trailing icon.',
      'Loading spinner or icon-only visual.',
    ],
    publicApi: [
      'variant: primary | secondary | critical | quiet.',
      'size: sm | md | lg.',
      'loading and disabled control availability.',
      'leadingIcon and trailingIcon are decorative slots.',
      'IconButton requires aria-label and icon.',
    ],
    states: [
      'Default, hover, active, focus-visible, disabled, and loading.',
      'Primary, secondary, critical, and quiet intent.',
      'Small, medium, and large size.',
    ],
    interaction: [
      'Enter and Space activate the native button.',
      'Loading disables activation and exposes aria-busy.',
    ],
    accessibility: [
      'Labels describe the action outcome.',
      'IconButton requires aria-label; its icon is hidden from assistive technology.',
      'Disabled and loading states must remain understandable from surrounding context.',
    ],
    responsive: [
      'Labels remain visible and may wrap only when consumer layout permits.',
      'Stacks should wrap action groups rather than shrinking targets.',
    ],
    tokens: [
      'Action primary, secondary, critical, and quiet color roles.',
      'Control sizes, radius, borders, opacity, spacing, and motion.',
    ],
    integration: [
      'Consumers own mutation execution, confirmation rules, routing, and pending state.',
      'Pass loading while the corresponding operation is in flight.',
    ],
    edgeCases: [
      'Loading replaces decorative icons but preserves the label.',
      'Long labels require enough layout space; IconButton is not a truncation fallback.',
    ],
    example: `<Stack direction="row" gap="sm" wrap>
  <Button>Invite member</Button>
  <Button variant="critical">Remove access</Button>
  <IconButton aria-label="More actions" icon={<span>…</span>} />
</Stack>`,
    tests: [
      'Covers variants, sizes, loading, disabled behavior, refs, and icon labeling.',
      'Theme coverage renders actions under both brand contracts.',
    ],
    changelog: 'Introduced Button and IconButton as beta action primitives.',
  }),
  forms: createComponentDocumentation({
    title: 'FormField and TextField',
    purpose:
      'FormField establishes accessible label, hint, error, and required relationships; TextField applies that contract to a native input.',
    use: [
      'Collect short text, email, password, search, and similar input values.',
      'Use FormField to wrap another native or custom control.',
    ],
    avoid: [
      'Do not use placeholder text as the only label.',
      'Use a dedicated composition for rich editors or multi-control groups.',
    ],
    anatomy: ['Label and required indicator.', 'Control.', 'Hint.', 'Error.'],
    publicApi: [
      'FormField: id, label, hint, error, required, and render-function children.',
      'TextField: native input props plus label, hint, and error.',
      'Refs forward to the native TextField input.',
    ],
    states: [
      'Default, hover, focus, invalid, disabled, read-only, and required.',
      'Hint only, error only, or hint plus error.',
    ],
    interaction: [
      'Clicking the label focuses the control.',
      'Keyboard editing follows the selected native input type.',
    ],
    accessibility: [
      'Generated IDs connect labels, hints, and errors.',
      'Errors expose aria-invalid and an alert.',
      'Required state is communicated semantically and visually.',
    ],
    responsive: [
      'Controls fill available inline size.',
      'Labels, hints, errors, and values wrap without losing relationships.',
    ],
    tokens: [
      'Input background, border, text, placeholder, focus, invalid, and disabled roles.',
      'Body/label typography, control size, radius, and motion.',
    ],
    integration: [
      'Consumers own value state, schema validation, submission, and server-error mapping.',
      'Pass server messages through error after application validation.',
    ],
    edgeCases: [
      'FormField expects exactly one control relationship.',
      'TextField does not provide masking, formatting, or debounced validation.',
    ],
    example: `<TextField
  label="Email address"
  type="email"
  hint="Use your work email."
  required
/>`,
    tests: [
      'Covers generated and supplied IDs, hint/error relationships, required state, and refs.',
      'TextField covers invalid, disabled, read-only, and native prop forwarding.',
    ],
    changelog: 'Introduced FormField and TextField as beta field primitives.',
  }),
  checkbox: createComponentDocumentation({
    title: 'Checkbox',
    purpose:
      'Checkbox captures independent binary or mixed selection with optional supporting description.',
    use: [
      'Select zero or more independent options.',
      'Represent select-all mixed state through indeterminate.',
    ],
    avoid: [
      'Use radio buttons for one choice from a mutually exclusive set.',
      'Do not use a checkbox as an immediate action button.',
    ],
    anatomy: [
      'Native checkbox input.',
      'Visual control.',
      'Label.',
      'Description.',
    ],
    publicApi: [
      'label is required.',
      'description, indeterminate, readOnly, and visuallyHiddenLabel are optional.',
      'onCheckedChange emits a boolean.',
      'Native input props and refs are supported.',
    ],
    states: [
      'Unchecked, checked, and indeterminate.',
      'Default, hover, focus-visible, disabled, read-only, and required.',
    ],
    interaction: [
      'Space toggles the focused checkbox.',
      'Read-only prevents change while preserving focusability.',
      'Disabled prevents focus and change.',
    ],
    accessibility: [
      'The native input carries checked or mixed state.',
      'Label and optional description use generated relationships.',
      'Visually hidden labels remain available to assistive technology.',
    ],
    responsive: [
      'Label and description wrap while the control remains aligned.',
      'The target retains its tokenized icon size.',
    ],
    tokens: [
      'Input, selection, focus, text, opacity, icon-size, radius, and motion roles.',
    ],
    integration: [
      'Consumers own controlled checked state and group-level validation.',
      'DataTable owns select-all calculation when composing Checkbox.',
    ],
    edgeCases: [
      'indeterminate is presentation state and should be recalculated by the owner.',
      'Read-only checkboxes are not a native HTML concept and are enforced by the component.',
    ],
    example: `<Checkbox
  label="Select all visible members"
  indeterminate
  onCheckedChange={setSelected}
/>`,
    tests: [
      'Covers checked, indeterminate, read-only, disabled, required, descriptions, and refs.',
      'Keyboard behavior relies on native checkbox semantics.',
    ],
    changelog: 'Introduced as a beta universal selection primitive.',
  }),
  badge: createComponentDocumentation({
    title: 'Badge',
    purpose:
      'Badge presents a concise categorical status without introducing interaction.',
    use: [
      'Label state such as active, pending, warning, or informational.',
      'Pair a short icon with a short text label.',
    ],
    avoid: [
      'Do not use Badge as a button or filter control.',
      'Do not place sentences or critical recovery instructions inside a badge.',
    ],
    anatomy: [
      'Optional decorative icon.',
      'Short status label.',
      'Pill container.',
    ],
    publicApi: [
      'tone: neutral | info | success | warning | critical.',
      'icon accepts decorative visual content.',
      'Native span attributes are supported.',
    ],
    states: [
      'Neutral, information, success, warning, and critical tone.',
      'Text-only or icon plus text.',
    ],
    interaction: ['Badge has no keyboard or pointer interaction.'],
    accessibility: [
      'Status text must communicate meaning without color.',
      'The icon is hidden from assistive technology.',
      'Use a live region outside Badge when a status change needs announcement.',
    ],
    responsive: [
      'Badge stays inline-sized and is intended for short labels.',
      'Long localized labels may wrap; consumers must allow surrounding space.',
    ],
    tokens: [
      'Semantic status backgrounds, borders, and text.',
      'Pill radius, label typography, spacing, and icon size.',
    ],
    integration: [
      'Consumers map domain state to a semantic tone and localized label.',
    ],
    edgeCases: [
      'Tone is not a severity scale for arbitrary data.',
      'Badge does not announce dynamic changes by itself.',
    ],
    example: `<Badge tone="warning">Pending</Badge>`,
    tests: [
      'Covers semantic tone classes, content, icon treatment, and native props.',
      'Theme coverage validates both brand implementations.',
    ],
    changelog: 'Introduced as a beta universal status primitive.',
  }),
  statePanel: createComponentDocumentation({
    title: 'StatePanel',
    purpose:
      'StatePanel communicates non-ready collection or surface states with consistent live-region behavior and optional recovery.',
    use: [
      'Present loading, empty, no-results, error, or no-access states.',
      'Provide a clear recovery action for retryable failures.',
    ],
    avoid: [
      'Do not replace field-level validation or transient toast messages.',
      'Do not use loading when stale usable content can remain visible.',
    ],
    anatomy: ['Spinner or icon.', 'Title.', 'Description.', 'Optional action.'],
    publicApi: [
      'status: loading | empty | no-results | error | no-access.',
      'title is required; description, action, and icon are optional.',
      'Native div attributes are supported.',
    ],
    states: [
      'Loading, empty, no-results, error, and no-access.',
      'Icon or spinner, with or without description and action.',
    ],
    interaction: [
      'Only supplied action content is interactive.',
      'Loading exposes busy state; errors use assertive announcement.',
    ],
    accessibility: [
      'Non-error states use polite status semantics.',
      'Error copy uses an assertive alert.',
      'Icons are decorative; recovery controls need outcome-oriented labels.',
    ],
    responsive: [
      'Copy and action stack in a centered flexible surface.',
      'Long descriptions wrap within the containing width.',
    ],
    tokens: [
      'Surface, status, text, border, radius, typography, spacing, and motion roles.',
    ],
    integration: [
      'Applications decide whether a request state is initial loading, stale refresh, empty, or failed.',
      'Consumers provide retry and alternate-navigation actions.',
    ],
    edgeCases: [
      'No-results differs from empty: it implies filters or a query can be changed.',
      'Do not repeatedly remount live regions during background refresh.',
    ],
    example: `<StatePanel
  status="error"
  title="Unable to load members"
  action={<Button variant="secondary">Try again</Button>}
/>`,
    tests: [
      'Covers every status, live-region behavior, busy state, icons, and actions.',
      'DataTable tests verify composed loading, empty, and error behavior.',
    ],
    changelog: 'Introduced as a beta universal state-presentation primitive.',
  }),
  dialog: createComponentDocumentation({
    title: 'Dialog',
    purpose:
      'Dialog presents a focused modal task with managed focus, dismissal, accessible naming, and optional footer actions.',
    use: [
      'Collect a short focused task or request confirmation without route navigation.',
      'Use alertdialog role only when immediate attention and decision are required.',
    ],
    avoid: [
      'Use a page for long, multi-step, or deep-linkable workflows.',
      'Do not nest dialogs.',
    ],
    anatomy: [
      'Scrim and modal surface.',
      'Title, optional description, and close action.',
      'Body.',
      'Optional footer.',
    ],
    publicApi: [
      'Controlled isOpen and onOpenChange.',
      'title, description, children, and footer slots.',
      'size: sm | md | lg.',
      'dismissible, closeLabel, and role.',
    ],
    states: [
      'Open or closed.',
      'Dismissible or fixed.',
      'Small, medium, and large.',
      'dialog or alertdialog role.',
    ],
    interaction: [
      'Focus moves into the dialog and is trapped while open.',
      'Escape and outside click dismiss only when dismissible.',
      'Closing restores focus to the trigger.',
    ],
    accessibility: [
      'Title supplies the accessible name and description is connected when present.',
      'The close action has a localizable accessible label.',
      'Background content is made unavailable while modal.',
    ],
    responsive: [
      'Inline size is capped by the selected size and viewport.',
      'Body and footer remain usable on narrow screens.',
    ],
    tokens: [
      'Elevated background, scrim, overlay shadow, dialog radius, spacing, typography, and motion.',
    ],
    integration: [
      'Consumers own open state, form state, mutation state, and confirmation policy.',
      'Set dismissible false while an operation cannot safely be interrupted.',
    ],
    edgeCases: [
      'The component intentionally does not manage application form submission.',
      'Portal placement follows the nearest DesignSystemProvider.',
    ],
    example: `<Dialog
  isOpen={isOpen}
  onOpenChange={setOpen}
  title="Invite a member"
  footer={<Button>Send invitation</Button>}
>
  <TextField label="Email address" />
</Dialog>`,
    tests: [
      'Covers focus entry, focus trap, Escape, outside dismissal, fixed mode, and focus restoration.',
      'Accessible title and description relationships are asserted.',
    ],
    changelog: 'Introduced as a beta universal overlay primitive.',
  }),
  dataTable: createComponentDocumentation({
    title: 'DataTable',
    purpose:
      'DataTable presents structured records with controlled sorting, optional multiple selection, actions, and production collection states.',
    use: [
      'Compare records across consistent columns.',
      'Provide sorting or selection when the operation benefits from tabular context.',
    ],
    avoid: [
      'Use a list when items do not share comparable fields.',
      'Do not force complex card anatomy into cells.',
    ],
    anatomy: [
      'Optional refresh status.',
      'Named horizontal scroll region.',
      'Semantic table, header, rows, cells, and optional action column.',
      'Composed StatePanel for non-ready states.',
    ],
    publicApi: [
      'Generic columns, collection, getRowId, and ariaLabel.',
      'Controlled sort and onSortChange.',
      'Discriminated selection API for none or multiple.',
      'renderActions and localized labels.',
    ],
    states: [
      'Loading, error/retry, empty/custom empty, ready, and refreshing.',
      'Unsorted, ascending, and descending.',
      'None, some, or all visible rows selected.',
    ],
    interaction: [
      'Sort buttons activate with Enter or Space.',
      'Checkboxes select individual or all visible rows.',
      'The overflow region is keyboard focusable.',
    ],
    accessibility: [
      'Requires an accessible table label and stable row labels for selection.',
      'Row headers and aria-sort communicate structure and order.',
      'Action header is visually hidden but named.',
    ],
    responsive: [
      'Preserves semantic table layout inside horizontal overflow.',
      'Consumers should prioritize columns and keep action content compact.',
    ],
    tokens: [
      'Table header, border, hover, selected row, focus, spacing, typography, and motion.',
      'Also inherits Checkbox, Button, and StatePanel tokens.',
    ],
    integration: [
      'Applications own data fetching, server sorting, pagination, caching, and mutations.',
      'CollectionState adapts application request state without importing a data library.',
    ],
    edgeCases: [
      'Selection covers visible rows only and preserves IDs outside the current collection.',
      'Pagination, virtualization, resizing, and inline editing are not included in v0.1.',
    ],
    example: `<DataTable
  ariaLabel="Workspace members"
  columns={columns}
  collection={{ status: 'ready', items: members }}
  getRowId={(member) => member.id}
/>`,
    tests: [
      'Covers every collection state, retry, refreshing, sorting, selection, actions, and overflow naming.',
      'Long and missing content is exercised in Storybook and the reference application.',
    ],
    changelog: 'Introduced as a beta universal collection component.',
  }),
  accessManagement: createComponentDocumentation({
    title: 'AccessManagementPage',
    purpose:
      'AccessManagementPage is the coded product pattern for inviting members and managing workspace roles without owning application integration.',
    use: [
      'Provide a stable workspace-member access workflow with invitation and role management.',
      'Connect an application adapter that can satisfy the controlled state contract.',
    ],
    avoid: [
      'Do not use for unrelated people directories or organization charts.',
      'Do not import API clients into the product package.',
    ],
    anatomy: [
      'Page heading and invite action.',
      'Permission, mutation, and selection notices.',
      'Member DataTable with status and row actions.',
      'InviteMemberDialog.',
    ],
    publicApi: [
      'collection, permissions, selection, sort, inviteState, and memberMutationState.',
      'Callbacks for selection, sorting, invitation, role changes, and removal.',
      'Localized label overrides, including role/status maps and label functions.',
    ],
    states: [
      'Loading, empty, request error/retry, ready, and refreshing collection.',
      'Idle, pending, and error invitation.',
      'Idle, pending, and error member mutation.',
      'Full or restricted permissions.',
    ],
    interaction: [
      'Sorting and selection follow DataTable keyboard contracts.',
      'Invite opens a managed Dialog; pending submission locks dismissal and duplicate submission.',
      'Role and removal controls disable only for the affected pending member.',
    ],
    accessibility: [
      'The page is a named region with a single heading.',
      'Permission restrictions remain visible and describe disabled controls.',
      'Pending and error mutations are announced with status and alert semantics.',
    ],
    responsive: [
      'The header stacks through a component container query.',
      'The member table retains named keyboard-accessible horizontal overflow.',
      'Application shells own narrow, medium, and wide page placement.',
    ],
    tokens: [
      'Consumes semantic text, status, selection, input, border, typography, radius, size, and spacing tokens.',
      'Inherits all tokens used by composed universal components.',
    ],
    integration: [
      'The application owns API requests, SWR/cache state, permission resolution, optimistic updates, rollback, and retry.',
      'The product component owns ephemeral dialog form state and page presentation.',
    ],
    edgeCases: [
      'Owner role is locked.',
      'Missing email/activity and long localized content use explicit fallbacks.',
      'Bulk mutation is not included in v0.1 even though selection is exposed.',
    ],
    example: `<AccessManagementPage
  collection={collection}
  permissions={permissions}
  selection={selection}
  sort={sort}
  inviteState={inviteState}
  memberMutationState={memberMutationState}
  onInviteMember={inviteMember}
  onChangeRole={changeRole}
  onRemoveMember={removeMember}
  onSelectionChange={setSelection}
  onSortChange={setSort}
/>`,
    tests: [
      'Covers sorting, selection, role/removal callbacks, restricted permissions, invitation success/error/pending, duplicate lock, and focus restoration.',
      'Reference-app tests cover real adapter states and optimistic rollback.',
    ],
    changelog:
      'Introduced as the first beta product-specific coded pattern in @relay/product-access.',
  }),
} as const;
