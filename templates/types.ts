export type LocalizedText = { en: string; so: string };

export interface ResumeDTO {
  id: string;
  title: LocalizedText;
  template: 'CREATIVE' | 'MODERN' | 'CLASSIC' | 'PROFESSIONAL' | 'MINIMALIST';
  theme: any;
  locale: 'en' | 'so';
  sections: {
    id: string;
    kind: string;
    order: number;
    entries: Array<{
      id: string;
      title?: LocalizedText | null;
      subtitle?: LocalizedText | null;
      body?: LocalizedText | null;
      meta?: any;
      startDate?: string | null;
      endDate?: string | null;
      ongoing?: boolean;
    }>;
  }[];
  watermark: boolean;
}

export type ExportMode = 'EN' | 'SO' | 'BILINGUAL';

export interface TemplateProps {
  resume: ResumeDTO;
  exportMode: ExportMode;
}
