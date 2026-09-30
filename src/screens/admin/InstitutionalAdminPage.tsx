'use client'

import { useEffect, useState } from 'react'
import { Check, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react'
import { PageMeta } from '@/components/common/PageMeta'
import { tenantService } from '@/services/tenantService'
import type {
  CardsBlock,
  ContentBlock,
  HeadingBlock,
  HighlightBlock,
  InstitutionalPage,
  KeyValueBlock,
  ListBlock,
  ParagraphBlock,
  PeopleBlock,
  PersonBlock,
} from '@/content/institucional/types'

const inputCls = 'mt-1 w-full rounded-theme border border-black/10 px-4 py-2.5 focus:border-primary'
const smallInputCls = 'w-full rounded-theme border border-black/10 px-3 py-2 text-sm focus:border-primary'

/** Rotulos amigaveis para o seletor de tipo de bloco. */
const BLOCK_LABELS: Record<ContentBlock['type'], string> = {
  heading: 'Subtítulo',
  paragraph: 'Parágrafo',
  list: 'Lista',
  highlight: 'Destaque (Missão/Visão)',
  keyValue: 'Ficha (chave e valor)',
  people: 'Pessoas (cargo e nome)',
  cards: 'Cards',
  person: 'Pessoa em destaque',
}

/** Cria um bloco vazio do tipo escolhido. */
function emptyBlock(type: ContentBlock['type']): ContentBlock {
  switch (type) {
    case 'heading':
      return { type: 'heading', text: '' }
    case 'paragraph':
      return { type: 'paragraph', text: '' }
    case 'list':
      return { type: 'list', title: '', items: [''], variant: 'bullet' }
    case 'highlight':
      return { type: 'highlight', title: '', text: '' }
    case 'keyValue':
      return { type: 'keyValue', title: '', rows: [{ label: '', value: '' }] }
    case 'people':
      return { type: 'people', title: '', members: [{ role: '', name: '' }] }
    case 'cards':
      return { type: 'cards', title: '', cards: [{ title: '', description: '' }] }
    case 'person':
      return { type: 'person', name: '', role: '', note: '' }
  }
}

function slugify(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const emptyPage = (order: number): InstitutionalPage => ({
  slug: '',
  title: '',
  subtitle: '',
  order,
  blocks: [],
})

/**
 * Admin > Institucional (Sobre): editor de subpaginas e blocos por tenant.
 * Permite criar/remover/reordenar subpaginas e, dentro de cada uma, montar
 * o conteudo com blocos (paragrafo, lista, ficha, pessoas, cards...).
 */
export function InstitutionalAdminPage() {
  const [pages, setPages] = useState<InstitutionalPage[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    tenantService
      .getAdminInstitutional()
      .then((data) => {
        if (active && data) setPages(data)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  // ---- Subpaginas ----
  function patchPage(pi: number, patch: Partial<InstitutionalPage>) {
    setPages((ps) => ps.map((p, i) => (i === pi ? { ...p, ...patch } : p)))
  }

  function addPage() {
    setPages((ps) => [...ps, emptyPage(ps.length + 1)])
  }

  function removePage(pi: number) {
    setPages((ps) => ps.filter((_, i) => i !== pi))
  }

  function movePage(pi: number, dir: -1 | 1) {
    setPages((ps) => {
      const next = [...ps]
      const target = pi + dir
      if (target < 0 || target >= next.length) return ps
      ;[next[pi], next[target]] = [next[target], next[pi]]
      return next
    })
  }

  // ---- Blocos de uma subpagina ----
  function patchBlock(pi: number, bi: number, patch: Partial<ContentBlock>) {
    setPages((ps) =>
      ps.map((p, i) =>
        i === pi
          ? { ...p, blocks: p.blocks.map((b, j) => (j === bi ? ({ ...b, ...patch } as ContentBlock) : b)) }
          : p,
      ),
    )
  }

  function addBlock(pi: number, type: ContentBlock['type']) {
    setPages((ps) =>
      ps.map((p, i) => (i === pi ? { ...p, blocks: [...p.blocks, emptyBlock(type)] } : p)),
    )
  }

  function removeBlock(pi: number, bi: number) {
    setPages((ps) =>
      ps.map((p, i) => (i === pi ? { ...p, blocks: p.blocks.filter((_, j) => j !== bi) } : p)),
    )
  }

  function moveBlock(pi: number, bi: number, dir: -1 | 1) {
    setPages((ps) =>
      ps.map((p, i) => {
        if (i !== pi) return p
        const blocks = [...p.blocks]
        const target = bi + dir
        if (target < 0 || target >= blocks.length) return p
        ;[blocks[bi], blocks[target]] = [blocks[target], blocks[bi]]
        return { ...p, blocks }
      }),
    )
  }

  async function save() {
    // Normaliza slug (a partir do titulo) e a ordem (posicao na lista).
    const normalized: InstitutionalPage[] = pages.map((p, i) => ({
      ...p,
      slug: p.slug || slugify(p.title),
      order: i + 1,
    }))
    setSaving(true)
    setError(null)
    try {
      const updated = await tenantService.updateAdminInstitutional(normalized)
      setPages(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      setError('Não foi possível salvar. Verifique os campos e sua conexão.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <PageMeta title="Sobre (Admin)" />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Sobre</h1>
          <p className="mt-1 text-ink-muted">
            Monte as subpáginas institucionais (Histórico, Diretoria, Convênios...) e seus blocos de conteúdo.
          </p>
        </div>
        <button onClick={save} disabled={saving || loading} className="btn-primary inline-flex items-center gap-1.5">
          {saved && <Check className="h-4 w-4" aria-hidden />}
          {saving ? 'Salvando...' : saved ? 'Salvo' : 'Salvar'}
        </button>
      </div>

      {error && (
        <p className="mt-4 rounded-2xl bg-secondary/10 px-4 py-2 text-sm text-secondary-dark">{error}</p>
      )}

      {loading ? (
        <p className="mt-8 text-ink-muted">Carregando...</p>
      ) : (
        <div className="mt-8 max-w-3xl space-y-6">
          {pages.length === 0 && (
            <p className="rounded-2xl border border-dashed border-black/10 px-4 py-8 text-center text-ink-muted">
              Nenhuma subpágina cadastrada. Adicione a primeira abaixo.
            </p>
          )}

          {pages.map((page, pi) => (
            <section key={pi} className="card p-6">
              {/* Cabecalho da subpagina */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-sm font-semibold text-ink">Título</span>
                      <input
                        value={page.title}
                        onChange={(e) => patchPage(pi, { title: e.target.value })}
                        placeholder="Ex.: Histórico"
                        className={inputCls}
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-ink">
                        Slug (URL) <span className="font-normal text-ink-muted">— opcional</span>
                      </span>
                      <input
                        value={page.slug}
                        onChange={(e) => patchPage(pi, { slug: slugify(e.target.value) })}
                        placeholder="gerado do título"
                        className={inputCls}
                      />
                    </label>
                  </div>
                  <label className="mt-3 block">
                    <span className="text-sm font-semibold text-ink">Subtítulo</span>
                    <input
                      value={page.subtitle ?? ''}
                      onChange={(e) => patchPage(pi, { subtitle: e.target.value })}
                      className={inputCls}
                    />
                  </label>
                </div>

                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => movePage(pi, -1)}
                    disabled={pi === 0}
                    title="Mover para cima"
                    className="rounded-lg border border-black/10 p-1.5 text-ink-muted disabled:opacity-30 hover:text-primary"
                  >
                    <ChevronUp className="h-4 w-4" aria-hidden />
                  </button>
                  <button
                    onClick={() => movePage(pi, 1)}
                    disabled={pi === pages.length - 1}
                    title="Mover para baixo"
                    className="rounded-lg border border-black/10 p-1.5 text-ink-muted disabled:opacity-30 hover:text-primary"
                  >
                    <ChevronDown className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              </div>

              {/* Blocos */}
              <div className="mt-5 space-y-4 border-t border-black/5 pt-5">
                <p className="section-label">Blocos de conteúdo</p>

                {page.blocks.map((block, bi) => (
                  <div key={bi} className="rounded-2xl border border-black/5 bg-surface-alt/40 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        {BLOCK_LABELS[block.type]}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveBlock(pi, bi, -1)}
                          disabled={bi === 0}
                          title="Subir bloco"
                          className="rounded-lg p-1.5 text-ink-muted disabled:opacity-30 hover:text-primary"
                        >
                          <ChevronUp className="h-4 w-4" aria-hidden />
                        </button>
                        <button
                          onClick={() => moveBlock(pi, bi, 1)}
                          disabled={bi === page.blocks.length - 1}
                          title="Descer bloco"
                          className="rounded-lg p-1.5 text-ink-muted disabled:opacity-30 hover:text-primary"
                        >
                          <ChevronDown className="h-4 w-4" aria-hidden />
                        </button>
                        <button
                          onClick={() => removeBlock(pi, bi)}
                          title="Remover bloco"
                          className="rounded-lg p-1.5 text-secondary-dark hover:bg-secondary/10"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden />
                        </button>
                      </div>
                    </div>

                    <BlockEditor
                      block={block}
                      onChange={(patch) => patchBlock(pi, bi, patch)}
                    />
                  </div>
                ))}

                <AddBlockControl onAdd={(type) => addBlock(pi, type)} />
              </div>

              <button
                onClick={() => removePage(pi)}
                className="mt-5 inline-flex items-center gap-1.5 text-sm text-secondary-dark hover:underline"
              >
                <Trash2 className="h-4 w-4" aria-hidden /> Remover subpágina
              </button>
            </section>
          ))}

          <button
            onClick={addPage}
            className="inline-flex items-center gap-1.5 rounded-theme border border-dashed border-primary/40 px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5"
          >
            <Plus className="h-4 w-4" aria-hidden /> Adicionar subpágina
          </button>
        </div>
      )}
    </>
  )
}

/** Seletor + botao para adicionar um novo bloco. */
function AddBlockControl({ onAdd }: { onAdd: (type: ContentBlock['type']) => void }) {
  const [type, setType] = useState<ContentBlock['type']>('paragraph')
  return (
    <div className="flex items-center gap-2">
      <select
        value={type}
        onChange={(e) => setType(e.target.value as ContentBlock['type'])}
        className={smallInputCls + ' max-w-[220px]'}
      >
        {(Object.keys(BLOCK_LABELS) as ContentBlock['type'][]).map((t) => (
          <option key={t} value={t}>{BLOCK_LABELS[t]}</option>
        ))}
      </select>
      <button
        onClick={() => onAdd(type)}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
      >
        <Plus className="h-4 w-4" aria-hidden /> Adicionar bloco
      </button>
    </div>
  )
}

/** Editor especifico por tipo de bloco. */
function BlockEditor({
  block,
  onChange,
}: {
  block: ContentBlock
  onChange: (patch: Partial<ContentBlock>) => void
}) {
  switch (block.type) {
    case 'heading':
      return (
        <input
          value={(block as HeadingBlock).text}
          onChange={(e) => onChange({ text: e.target.value } as Partial<HeadingBlock>)}
          placeholder="Texto do subtítulo"
          className={smallInputCls}
        />
      )

    case 'paragraph':
      return (
        <textarea
          rows={4}
          value={(block as ParagraphBlock).text}
          onChange={(e) => onChange({ text: e.target.value } as Partial<ParagraphBlock>)}
          placeholder="Escreva o parágrafo..."
          className={smallInputCls}
        />
      )

    case 'highlight': {
      const b = block as HighlightBlock
      return (
        <div className="space-y-2">
          <input
            value={b.title}
            onChange={(e) => onChange({ title: e.target.value } as Partial<HighlightBlock>)}
            placeholder="Título (ex.: Missão)"
            className={smallInputCls}
          />
          <textarea
            rows={3}
            value={b.text}
            onChange={(e) => onChange({ text: e.target.value } as Partial<HighlightBlock>)}
            placeholder="Texto do destaque"
            className={smallInputCls}
          />
        </div>
      )
    }

    case 'person': {
      const b = block as PersonBlock
      return (
        <div className="grid gap-2 sm:grid-cols-2">
          <input
            value={b.name}
            onChange={(e) => onChange({ name: e.target.value } as Partial<PersonBlock>)}
            placeholder="Nome"
            className={smallInputCls}
          />
          <input
            value={b.role}
            onChange={(e) => onChange({ role: e.target.value } as Partial<PersonBlock>)}
            placeholder="Cargo"
            className={smallInputCls}
          />
          <input
            value={b.note ?? ''}
            onChange={(e) => onChange({ note: e.target.value } as Partial<PersonBlock>)}
            placeholder="Observação (opcional)"
            className={smallInputCls + ' sm:col-span-2'}
          />
          <input
            value={b.photoUrl ?? ''}
            onChange={(e) => onChange({ photoUrl: e.target.value } as Partial<PersonBlock>)}
            placeholder="URL da foto (opcional)"
            className={smallInputCls + ' sm:col-span-2'}
          />
        </div>
      )
    }

    case 'list':
      return <ListEditor block={block as ListBlock} onChange={onChange} />

    case 'keyValue':
      return <KeyValueEditor block={block as KeyValueBlock} onChange={onChange} />

    case 'people':
      return <PeopleEditor block={block as PeopleBlock} onChange={onChange} />

    case 'cards':
      return <CardsEditor block={block as CardsBlock} onChange={onChange} />

    default:
      return null
  }
}

// ---- Editores de blocos com sub-itens ----

function ListEditor({ block, onChange }: { block: ListBlock; onChange: (p: Partial<ContentBlock>) => void }) {
  const setItem = (i: number, v: string) =>
    onChange({ items: block.items.map((it, j) => (j === i ? v : it)) } as Partial<ListBlock>)
  const addItem = () => onChange({ items: [...block.items, ''] } as Partial<ListBlock>)
  const removeItem = (i: number) => onChange({ items: block.items.filter((_, j) => j !== i) } as Partial<ListBlock>)

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          value={block.title ?? ''}
          onChange={(e) => onChange({ title: e.target.value } as Partial<ListBlock>)}
          placeholder="Título da lista (opcional)"
          className={smallInputCls}
        />
        <select
          value={block.variant ?? 'bullet'}
          onChange={(e) => onChange({ variant: e.target.value as 'bullet' | 'check' } as Partial<ListBlock>)}
          className={smallInputCls + ' max-w-[130px]'}
        >
          <option value="bullet">• Marcador</option>
          <option value="check">✓ Check</option>
        </select>
      </div>
      {block.items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input value={item} onChange={(e) => setItem(i, e.target.value)} placeholder={`Item ${i + 1}`} className={smallInputCls} />
          <button onClick={() => removeItem(i)} className="rounded-lg p-2 text-secondary-dark hover:bg-secondary/10">
            <Trash2 className="h-4 w-4" aria-hidden />
          </button>
        </div>
      ))}
      <button onClick={addItem} className="text-sm font-semibold text-primary">+ Item</button>
    </div>
  )
}

function KeyValueEditor({ block, onChange }: { block: KeyValueBlock; onChange: (p: Partial<ContentBlock>) => void }) {
  const setRow = (i: number, patch: Partial<{ label: string; value: string }>) =>
    onChange({ rows: block.rows.map((r, j) => (j === i ? { ...r, ...patch } : r)) } as Partial<KeyValueBlock>)
  const addRow = () => onChange({ rows: [...block.rows, { label: '', value: '' }] } as Partial<KeyValueBlock>)
  const removeRow = (i: number) => onChange({ rows: block.rows.filter((_, j) => j !== i) } as Partial<KeyValueBlock>)

  return (
    <div className="space-y-2">
      <input
        value={block.title ?? ''}
        onChange={(e) => onChange({ title: e.target.value } as Partial<KeyValueBlock>)}
        placeholder="Título (opcional)"
        className={smallInputCls}
      />
      {block.rows.map((row, i) => (
        <div key={i} className="flex gap-2">
          <input value={row.label} onChange={(e) => setRow(i, { label: e.target.value })} placeholder="Rótulo" className={smallInputCls} />
          <input value={row.value} onChange={(e) => setRow(i, { value: e.target.value })} placeholder="Valor" className={smallInputCls} />
          <button onClick={() => removeRow(i)} className="rounded-lg p-2 text-secondary-dark hover:bg-secondary/10">
            <Trash2 className="h-4 w-4" aria-hidden />
          </button>
        </div>
      ))}
      <button onClick={addRow} className="text-sm font-semibold text-primary">+ Linha</button>
    </div>
  )
}

function PeopleEditor({ block, onChange }: { block: PeopleBlock; onChange: (p: Partial<ContentBlock>) => void }) {
  const setMember = (i: number, patch: Partial<{ role: string; name: string }>) =>
    onChange({ members: block.members.map((m, j) => (j === i ? { ...m, ...patch } : m)) } as Partial<PeopleBlock>)
  const addMember = () => onChange({ members: [...block.members, { role: '', name: '' }] } as Partial<PeopleBlock>)
  const removeMember = (i: number) => onChange({ members: block.members.filter((_, j) => j !== i) } as Partial<PeopleBlock>)

  return (
    <div className="space-y-2">
      <input
        value={block.title ?? ''}
        onChange={(e) => onChange({ title: e.target.value } as Partial<PeopleBlock>)}
        placeholder="Título (ex.: Diretoria)"
        className={smallInputCls}
      />
      {block.members.map((m, i) => (
        <div key={i} className="flex gap-2">
          <input value={m.role} onChange={(e) => setMember(i, { role: e.target.value })} placeholder="Cargo" className={smallInputCls} />
          <input value={m.name} onChange={(e) => setMember(i, { name: e.target.value })} placeholder="Nome" className={smallInputCls} />
          <button onClick={() => removeMember(i)} className="rounded-lg p-2 text-secondary-dark hover:bg-secondary/10">
            <Trash2 className="h-4 w-4" aria-hidden />
          </button>
        </div>
      ))}
      <button onClick={addMember} className="text-sm font-semibold text-primary">+ Pessoa</button>
    </div>
  )
}

function CardsEditor({ block, onChange }: { block: CardsBlock; onChange: (p: Partial<ContentBlock>) => void }) {
  const setCard = (i: number, patch: Partial<{ title: string; description: string }>) =>
    onChange({ cards: block.cards.map((c, j) => (j === i ? { ...c, ...patch } : c)) } as Partial<CardsBlock>)
  const addCard = () => onChange({ cards: [...block.cards, { title: '', description: '' }] } as Partial<CardsBlock>)
  const removeCard = (i: number) => onChange({ cards: block.cards.filter((_, j) => j !== i) } as Partial<CardsBlock>)

  return (
    <div className="space-y-2">
      <input
        value={block.title ?? ''}
        onChange={(e) => onChange({ title: e.target.value } as Partial<CardsBlock>)}
        placeholder="Título (opcional)"
        className={smallInputCls}
      />
      {block.cards.map((c, i) => (
        <div key={i} className="rounded-xl border border-black/5 p-3">
          <div className="flex gap-2">
            <input value={c.title} onChange={(e) => setCard(i, { title: e.target.value })} placeholder="Título do card" className={smallInputCls} />
            <button onClick={() => removeCard(i)} className="rounded-lg p-2 text-secondary-dark hover:bg-secondary/10">
              <Trash2 className="h-4 w-4" aria-hidden />
            </button>
          </div>
          <textarea
            rows={2}
            value={c.description}
            onChange={(e) => setCard(i, { description: e.target.value })}
            placeholder="Descrição"
            className={smallInputCls + ' mt-2'}
          />
        </div>
      ))}
      <button onClick={addCard} className="text-sm font-semibold text-primary">+ Card</button>
    </div>
  )
}
