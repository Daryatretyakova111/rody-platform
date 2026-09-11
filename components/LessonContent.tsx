export default function LessonContent({ content }: { content: string }) {
  const paragraphs = content.split(/\n\n+/).filter(Boolean);

  return (
    <div className="space-y-3 rounded-2xl border border-border bg-card p-6 text-sm leading-relaxed opacity-90">
      {paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  );
}
