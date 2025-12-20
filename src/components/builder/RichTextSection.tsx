export function RichTextSection(props: {
  title?: string;
  content?: string;
  className?: string;
}) {
  return (
    <section className={props.className || ''}>
      <div className="container mx-auto px-4 py-16">
        {props.title && (
          <h2 className="text-3xl md:text-4xl font-headline font-bold mb-6">
            {props.title}
          </h2>
        )}
        {props.content && (
          <div 
            className="prose prose-lg max-w-none text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: props.content }}
          />
        )}
      </div>
    </section>
  );
}

