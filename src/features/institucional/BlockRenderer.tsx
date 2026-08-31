import type { ContentBlock } from '@/content/institucional/types'

/** Renderiza um bloco de conteudo institucional no estilo do design atual. */
export function Block({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'heading':
      return <h2 className="mt-10 text-2xl font-extrabold text-ink">{block.text}</h2>

    case 'paragraph':
      return <p className="mt-4 leading-relaxed text-ink-muted">{block.text}</p>

    case 'list':
      return (
        <div className="mt-6">
          {block.title && <h3 className="font-extrabold text-ink">{block.title}</h3>}
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {block.items.map((item) => (
              <li key={item} className="flex items-start gap-2 text-ink-muted">
                <span className="mt-1 text-primary">{block.variant === 'check' ? '✓' : '•'}</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )

    case 'highlight':
      return (
        <div className="mt-6 rounded-3xl border border-primary/15 bg-primary/5 p-6">
          <div className="flex items-center gap-2">
            {block.icon && <span className="text-xl">{block.icon}</span>}
            <h3 className="text-lg font-extrabold text-primary">{block.title}</h3>
          </div>
          <p className="mt-2 leading-relaxed text-ink">{block.text}</p>
        </div>
      )

    case 'keyValue':
      return (
        <div className="mt-6 card overflow-hidden">
          {block.title && (
            <div className="border-b border-black/5 px-6 py-4">
              <h3 className="font-extrabold text-ink">{block.title}</h3>
            </div>
          )}
          <dl className="divide-y divide-black/5">
            {block.rows.map((row) => (
              <div key={row.label} className="grid gap-1 px-6 py-3 sm:grid-cols-3">
                <dt className="text-sm font-semibold text-ink-muted">{row.label}</dt>
                <dd className="text-ink sm:col-span-2">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )

    case 'people':
      return (
        <div className="mt-6 card overflow-hidden">
          {block.title && (
            <div className="border-b border-black/5 bg-surface-alt px-6 py-4">
              <h3 className="font-extrabold text-ink">{block.title}</h3>
            </div>
          )}
          <ul className="divide-y divide-black/5">
            {block.members.map((m, i) => (
              <li key={`${m.role}-${m.name}-${i}`} className="grid gap-1 px-6 py-3 sm:grid-cols-2">
                <span className="text-sm font-semibold text-ink-muted">{m.role}</span>
                <span className="font-medium text-ink">{m.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )

    case 'cards':
      return (
        <div className="mt-6">
          {block.title && <h3 className="font-extrabold text-ink">{block.title}</h3>}
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {block.cards.map((c) => (
              <div key={c.title} className="card p-6">
                {c.icon && (
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-xl">
                    {c.icon}
                  </div>
                )}
                <h4 className="mt-4 font-extrabold text-ink">{c.title}</h4>
                <p className="mt-2 text-sm text-ink-muted">{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      )

    case 'person':
      return (
        <div className="mt-6 card flex items-center gap-5 p-6">
          <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full bg-primary/10 text-2xl text-primary">
            {block.photoUrl ? (
              <img src={block.photoUrl} alt={block.name} className="h-full w-full object-cover" />
            ) : (
              '👤'
            )}
          </div>
          <div>
            <p className="text-lg font-extrabold text-ink">{block.name}</p>
            <p className="text-primary">{block.role}</p>
            {block.note && <p className="mt-1 text-sm text-ink-muted">{block.note}</p>}
          </div>
        </div>
      )

    default:
      return null
  }
}

export function BlockRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </>
  )
}
