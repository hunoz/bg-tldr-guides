import { useState, useEffect, useCallback } from "react"
import "./SideNav.css"

export interface NavItem {
  id: string
  label: string
  icon?: string
  /** Hash href for scroll-to-section links (e.g. "#overview") */
  href?: string
  /** If provided, called instead of scroll-to-section */
  onSelect?: () => void
}

export interface NavGroup {
  title?: string
  items: NavItem[]
}

interface SideNavProps {
  groups: NavGroup[]
}

export default function SideNav({ groups }: SideNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)

  const toggle = useCallback(() => setIsOpen((o) => !o), [])

  const scrollableItems = groups.flatMap((g) => g.items.filter((i) => !i.onSelect && i.href))

  // Sync active state from intersection observer and update URL hash
  useEffect(() => {
    if (scrollableItems.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
            history.replaceState(null, "", `#${entry.target.id}`)
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px" },
    )

    for (const item of scrollableItems) {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups])

  // On mount, scroll to hash if present
  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (!hash) return

    // Small delay to let the DOM render
    const timer = setTimeout(() => {
      const el = document.getElementById(hash)
      if (el) {
        el.scrollIntoView({ behavior: "smooth" })
        setActiveId(hash)
      }
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const handleClick = (e: React.MouseEvent, item: NavItem) => {
    if (item.onSelect) {
      item.onSelect()
    } else {
      e.preventDefault()
      const el = document.getElementById(item.id)
      if (el) {
        el.scrollIntoView({ behavior: "smooth" })
        setActiveId(item.id)
        history.pushState(null, "", `#${item.id}`)
      }
    }
    if (window.innerWidth < 768) setIsOpen(false)
  }

  return (
    <>
      <button
        className="sidenav-toggle"
        onClick={toggle}
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={isOpen}
      >
        <span className="sidenav-toggle-icon" aria-hidden="true">
          {isOpen ? "✕" : "☰"}
        </span>
      </button>

      <nav className={`sidenav ${isOpen ? "sidenav--open" : ""}`} aria-label="Page navigation">
        {groups.map((group, gi) => (
          <div className="sidenav-group" key={gi}>
            {group.title && <div className="sidenav-title">{group.title}</div>}
            <ul className="sidenav-list" role="list">
              {group.items.map((item) => (
                <li key={item.id}>
                  {item.href ? (
                    <a
                      href={item.href}
                      className={`sidenav-link ${activeId === item.id ? "sidenav-link--active" : ""}`}
                      onClick={(e) => handleClick(e, item)}
                    >
                      {item.icon && (
                        <span className="sidenav-link-icon" aria-hidden="true">{item.icon}</span>
                      )}
                      {item.label}
                    </a>
                  ) : (
                    <button
                      className={`sidenav-link ${activeId === item.id ? "sidenav-link--active" : ""}`}
                      onClick={(e) => handleClick(e, item)}
                    >
                      {item.icon && (
                        <span className="sidenav-link-icon" aria-hidden="true">{item.icon}</span>
                      )}
                      {item.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {isOpen && <div className="sidenav-backdrop" onClick={toggle} aria-hidden="true" />}
    </>
  )
}
