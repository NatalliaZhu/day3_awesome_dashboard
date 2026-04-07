"use client"

import type { FormEvent } from "react"
import { useState } from "react"

import "./trello.css"

type ColumnId = "todo" | "progress" | "done"

/** April 2026 mini-calendar (Monday-first columns, matches original layout). */
const CALENDAR_YEAR = 2026
const CALENDAR_MONTH_INDEX = 3 // April (0-based)

function formatLocalISODate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

function formatLongEnglishDate(d: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d)
}

function april2026GridCells(): { day: number | null }[] {
  const first = new Date(CALENDAR_YEAR, CALENDAR_MONTH_INDEX, 1)
  const padCount = (first.getDay() + 6) % 7
  const daysInMonth = 30
  const cells: { day: number | null }[] = []
  for (let i = 0; i < padCount; i++) cells.push({ day: null })
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d })
  return cells
}

const INITIAL: Record<ColumnId, string[]> = {
  todo: [
    "Launch campaigns on GEOs for Arrow",
    "Analyze the competitors",
    "Run A/B test for new embedding-based lookalike segments",
    "Review LTV model feature importance for embedding dims",
  ],
  progress: ["Cursor Challenge", "Launching campaigns on SSPs"],
  done: ["Initialize repository", "Choose tech stack"],
}

function ListColumn({
  title,
  columnId,
  inputId,
  cards,
  onAdd,
}: {
  title: string
  columnId: ColumnId
  inputId: string
  cards: string[]
  onAdd: (columnId: ColumnId, text: string) => void
}) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const input = form.elements.namedItem("title") as HTMLInputElement | null
    if (!input) return
    const text = input.value.trim()
    if (!text) return
    onAdd(columnId, text)
    input.value = ""
    input.focus()
  }

  return (
    <article className="list">
      <h2>{title}</h2>
      <ul className="list__cards">
        {cards.map((text, i) => (
          <li key={`${columnId}-${i}`} className="card">
            {text}
          </li>
        ))}
      </ul>
      <form className="add-card" action="#" method="post" onSubmit={handleSubmit}>
        <label className="visually-hidden" htmlFor={inputId}>
          New task in {title}
        </label>
        <input
          id={inputId}
          className="add-card__input"
          type="text"
          name="title"
          placeholder="Add a task…"
          maxLength={500}
          autoComplete="off"
        />
        <button type="submit" className="add-card__btn">
          Add
        </button>
      </form>
    </article>
  )
}

export default function TrelloPage() {
  const [lists, setLists] = useState(INITIAL)
  const today = new Date()
  const dateTimeAttr = formatLocalISODate(today)
  const dateLabel = formatLongEnglishDate(today)
  const todayIsShownMonth =
    today.getFullYear() === CALENDAR_YEAR &&
    today.getMonth() === CALENDAR_MONTH_INDEX
  const todayDom = today.getDate()
  const calendarCells = april2026GridCells()

  function addCard(columnId: ColumnId, text: string) {
    setLists((prev) => ({
      ...prev,
      [columnId]: [...prev[columnId], text],
    }))
  }

  return (
    <div className="trello-legacy">
      <header className="site-header">
        <div className="header-top">
          <div className="header-left">
            <div className="header-title-block">
              <h1>My Trello Board</h1>
              <p className="header-meta">
                <span className="header-meta__place">Location: Moscow</span>
                <span className="header-meta__sep" aria-hidden="true">
                  ·
                </span>
                <span className="header-meta__date">
                  Date:{" "}
                  <time dateTime={dateTimeAttr} suppressHydrationWarning>
                    {dateLabel}
                  </time>
                </span>
              </p>
            </div>
            <span className="header-emojis" aria-hidden="true">
              💖 ✨ 🌸 📋 💕
            </span>
          </div>
        </div>
      </header>

      <main>
        <section className="board">
          <ListColumn
            title="To Do"
            columnId="todo"
            inputId="add-todo"
            cards={lists.todo}
            onAdd={addCard}
          />
          <ListColumn
            title="In Progress"
            columnId="progress"
            inputId="add-progress"
            cards={lists.progress}
            onAdd={addCard}
          />
          <ListColumn
            title="Done"
            columnId="done"
            inputId="add-done"
            cards={lists.done}
            onAdd={addCard}
          />
        </section>
      </main>

      <aside className="mini-calendar mini-calendar--corner" aria-label="Календарь, апрель 2026">
        <div className="mini-calendar__title">Апрель 2026</div>
        <div className="mini-calendar__weekdays">
          <span>Пн</span>
          <span>Вт</span>
          <span>Ср</span>
          <span>Чт</span>
          <span>Пт</span>
          <span>Сб</span>
          <span>Вс</span>
        </div>
        <div className="mini-calendar__grid">
          {calendarCells.map((cell, i) => {
            if (cell.day === null) {
              return (
                <span
                  key={`pad-${i}`}
                  className="mini-calendar__pad"
                  aria-hidden="true"
                />
              )
            }
            const isToday =
              todayIsShownMonth && cell.day === todayDom
            return (
              <span
                key={`day-${cell.day}`}
                className={isToday ? "is-today" : undefined}
              >
                {cell.day}
              </span>
            )
          })}
        </div>
      </aside>
    </div>
  )
}
