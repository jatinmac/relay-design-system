import type { Meta, StoryObj } from '@storybook/react-vite';

import { DocumentationPage } from './docs/DocumentationPage';
import { systemDocumentation } from './docs/systemDocumentation';

const meta = {
  title: 'Documentation/System',
  parameters: {
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const GettingStarted: Story = {
  name: '01 Getting started',
  render: () => (
    <DocumentationPage content={systemDocumentation.gettingStarted} />
  ),
};

export const PrinciplesAndArchitecture: Story = {
  name: '02 Principles and architecture',
  render: () => (
    <DocumentationPage content={systemDocumentation.principlesArchitecture} />
  ),
};

export const BrandVersusProduct: Story = {
  name: '03 Brand versus product',
  render: () => (
    <DocumentationPage content={systemDocumentation.brandProduct} />
  ),
};

export const TokenTaxonomyAndNaming: Story = {
  name: '04 Token taxonomy and naming',
  render: () => (
    <DocumentationPage content={systemDocumentation.tokenTaxonomy} />
  ),
};

export const ThemesColorAndDensity: Story = {
  name: '05 Themes, color, and density',
  render: () => <DocumentationPage content={systemDocumentation.themes} />,
};

export const Typography: Story = {
  name: '06 Typography',
  render: () => <DocumentationPage content={systemDocumentation.typography} />,
};

export const LayoutAndResponsiveness: Story = {
  name: '07 Layout and responsiveness',
  render: () => <DocumentationPage content={systemDocumentation.layout} />,
};

export const MotionAndReducedMotion: Story = {
  name: '08 Motion and reduced motion',
  render: () => <DocumentationPage content={systemDocumentation.motion} />,
};

export const Accessibility: Story = {
  name: '09 Accessibility',
  render: () => (
    <DocumentationPage content={systemDocumentation.accessibility} />
  ),
};

export const UniversalComponents: Story = {
  name: '10 Universal components',
  render: () => (
    <DocumentationPage content={systemDocumentation.universalComponents} />
  ),
};

export const ProductSpecificComponents: Story = {
  name: '11 Product-specific components',
  render: () => (
    <DocumentationPage content={systemDocumentation.productComponents} />
  ),
};

export const CodedAndDocumentedPatterns: Story = {
  name: '12 Coded and documented patterns',
  render: () => <DocumentationPage content={systemDocumentation.patterns} />,
};

export const ApiIntegrationBoundaries: Story = {
  name: '13 API-integration boundaries',
  render: () => <DocumentationPage content={systemDocumentation.integration} />,
};

export const TestingStrategy: Story = {
  name: '14 Testing strategy',
  render: () => <DocumentationPage content={systemDocumentation.testing} />,
};

export const ContributionWorkflow: Story = {
  name: '15 Contribution workflow',
  render: () => (
    <DocumentationPage content={systemDocumentation.contribution} />
  ),
};

export const VersioningAndLifecycle: Story = {
  name: '16 Versioning and lifecycle',
  render: () => <DocumentationPage content={systemDocumentation.lifecycle} />,
};

export const AiAgentUsage: Story = {
  name: '17 AI-agent usage',
  render: () => <DocumentationPage content={systemDocumentation.aiAgents} />,
};

export const Changelog: Story = {
  name: '18 Changelog',
  render: () => <DocumentationPage content={systemDocumentation.changelog} />,
};
