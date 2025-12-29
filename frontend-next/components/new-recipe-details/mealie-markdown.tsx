export default function MealieMarkdown({ content }: { content: string }) {
  const parseHtml = (text: string) => {
    if (!text) return "";

    let formatted = text
      // 1. Headings
      .replace(/^### (.*$)/gim, '<h3 class="text-md font-bold">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-lg font-bold">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-xl font-black">$1</h1>')

      // 2. Bold, Italics & Underline
      .replace(/\*\*(.*)\*\*/gim, '<strong class="font-bold">$1</strong>')
      .replace(/\*(.*)\*/gim, '<em class="italic">$1</em>')
      .replace(/__(.*)__/gim, '<u class="decoration-1">$1</u>')

      // 3. Links
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" class="text-blue-600 underline hover:text-blue-800 transition-colors" target="_blank">$1</a>'
      )

      // 4. Lists: Convert single lines to <li>
      .replace(/^\s*[\*|-]\s+(.*)$/gim, '<li class="ml-5 list-disc">$1</li>');

    // 5. Wrap groups of <li> into a <ul>
    // This looks for consecutive <li> tags and wraps them once
    formatted = formatted.replace(
      /(<li.*?>.*?<\/li>)+/g,
      '<ul class="my-4 space-y-1">$1</ul>'
    );

    // 6. Line Breaks (only if NOT inside a list or heading to keep spacing tight)
    return formatted.replace(/\n(?!(?:<\/h|<\/li|<\/ul))/g, "<br />");
  };

  // We must do this to comply with Mealie's markdown output
  return (
    <div
      className="
        text-gray-800
        leading-relaxed
        [&_img]:max-w-full
        [&_img]:h-auto
        [&_img]:rounded-xl
        [&_img]:my-6
        [&_img]:shadow-md
        [&_img]:block
      "
      dangerouslySetInnerHTML={{ __html: parseHtml(content) }}
    />
  );
}
