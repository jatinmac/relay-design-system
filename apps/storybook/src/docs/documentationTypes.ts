export interface DocumentationSection {
  title: string;
  paragraphs?: ReadonlyArray<string>;
  bullets?: ReadonlyArray<string>;
  code?: string;
}

export interface DocumentationContent {
  eyebrow: string;
  title: string;
  status?: string;
  summary: string;
  sections: ReadonlyArray<DocumentationSection>;
}
