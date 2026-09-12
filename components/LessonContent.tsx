interface Block {
  type: 'h3' | 'h4' | 'p' | 'ul';
  content: string | string[];
}

function parseContent(content: string): Block[] {
  const lines = content.split('\n');
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      blocks.push({ type: 'p', content: paragraph.join(' ') });
      paragraph = [];
    }
  };
  const flushList = () => {
    if (list.length > 0) {
      blocks.push({ type: 'ul', content: [...list] });
      list = [];
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }
    if (line.startsWith('### ')) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'h4', content: line.slice(4) });
    } else if (line.startsWith('## ')) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'h3', content: line.slice(3) });
    } else if (line.startsWith('- ')) {
      flushParagraph();
      list.push(line.slice(2));
    } else {
      flushList();
      paragraph.push(line);
    }
  }
  flushParagraph();
  flushList();
  return blocks;
}

export default function LessonContent({ content }: { content: string }) {
  const blocks = parseContent(content);

  return (
    <div className="space-y-3 rounded-2xl border border-border bg-card p-6 text-sm leading-relaxed">
      {blocks.map((block, index) => {
        if (block.type === 'h3') {
          return (
            <h3 key={index} className="!mt-6 text-base font-semibold text-foreground first:!mt-0">
              {block.content as string}
            </h3>
          );
        }
        if (block.type === 'h4') {
          return (
            <h4 key={index} className="!mt-4 text-sm font-semibold text-pink-dark">
              {block.content as string}
            </h4>
          );
        }
        if (block.type === 'ul') {
          return (
            <ul key={index} className="list-disc space-y-1 pl-5 opacity-80">
              {(block.content as string[]).map((item, itemIndex) => (
                <li key={itemIndex}>{item}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={index} className="opacity-80">
            {block.content as string}
          </p>
        );
      })}
    </div>
  );
}
