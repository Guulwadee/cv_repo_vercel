import Link from 'next/link';

export default function TemplatesGallery({ params }: { params: { locale: string } }) {
  const templates = ['CREATIVE', 'MODERN', 'CLASSIC', 'PROFESSIONAL', 'MINIMALIST'];
  return (
    <div>
      <h1 className="text-xl font-semibold">Templates</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {templates.map((t) => (
          <div key={t} className="border rounded-xl p-3">
            <div className="text-sm">{t}</div>
            <div className="text-xs text-slate-600">Blue accents, print-ready</div>
            <Link
              href={`/${params.locale}/resumes`}
              className="text-brand-700 text-sm inline-block mt-2"
            >
              Use
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
