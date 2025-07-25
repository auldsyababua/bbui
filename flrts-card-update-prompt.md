# FLRTS App Card Update - Magic Patterns Prompt

## Objective
Update the FLRTS app card on the main dashboard to include a 2x2 grid of quick action links within the card itself.

## Component: AppCard_FLRTS

### Design Requirements
- The FLRTS card should be visually distinct from other app cards
- Include a 2x2 grid of quick links inside the card
- Each link should have an icon and label
- The card should maintain the same size as other app cards
- Links should be clearly clickable with hover states

### Implementation with shadcn/ui

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, CheckSquare, ListTodo, Bell } from "lucide-react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"

// FLRTS App Card Component
const AppCard_FLRTS = ({ disabled = false }) => {
  const flrtsLinks = [
    {
      title: "Field Reports",
      icon: FileText,
      href: "/field-reports",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Lists",
      icon: ListTodo,
      href: "/lists",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Tasks",
      icon: CheckSquare,
      href: "/tasks-and-reminders",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Reminders",
      icon: Bell,
      href: "/tasks-and-reminders",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all",
      disabled && "opacity-60 cursor-not-allowed",
      !disabled && "hover:shadow-lg"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="p-2 w-12 h-12 rounded-lg bg-primary/10 text-primary">
            <FileText className="w-8 h-8" />
          </div>
        </div>
        <CardTitle className="mt-4">FLRTS</CardTitle>
        <CardDescription className="line-clamp-2">
          Field Reports, Lists, Tasks & Reminders - All in one place
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-3">
          {flrtsLinks.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.title}
                to={link.href}
                className={cn(
                  "flex flex-col items-center justify-center p-3 rounded-lg transition-all",
                  "hover:scale-105 hover:shadow-sm",
                  link.bgColor,
                  disabled && "pointer-events-none"
                )}
              >
                <Icon className={cn("w-6 h-6 mb-1", link.color)} />
                <span className={cn("text-xs font-medium", link.color)}>
                  {link.title}
                </span>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
```

### Visual Specifications

1. **Card Structure**:
   - Standard card header with FLRTS title and description
   - Main FLRTS icon in top left (using FileText or custom FLRTS icon)
   - 2x2 grid of links in the card content area

2. **Link Grid Layout**:
   - Top Left: Field Reports (blue theme)
   - Top Right: Lists (green theme)
   - Bottom Left: Tasks (purple theme)
   - Bottom Right: Reminders (orange theme)

3. **Each Link Button**:
   - Rounded corners (rounded-lg)
   - Subtle background color matching the theme
   - Icon centered above text
   - Icon size: 24px (w-6 h-6)
   - Text size: 12px (text-xs)
   - Padding: 12px (p-3)
   - Hover effect: slight scale (scale-105) and shadow

4. **Responsive Behavior**:
   - On mobile: Grid remains 2x2 but with smaller padding
   - Links should be minimum 44px tap targets
   - Text may wrap on very small screens

5. **States**:
   - Default: Subtle colored backgrounds
   - Hover: Scale up slightly, add shadow
   - Active: Scale down slightly (scale-95)
   - Disabled: Reduced opacity, no hover effects

### Alternative Compact Version

If the 2x2 grid feels too cramped, here's a horizontal pill-based design:

```tsx
<CardContent className="pt-0">
  <div className="flex flex-wrap gap-2">
    {flrtsLinks.map((link) => {
      const Icon = link.icon
      return (
        <Link
          key={link.title}
          to={link.href}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
            "hover:scale-105",
            link.bgColor,
            link.color,
            disabled && "pointer-events-none"
          )}
        >
          <Icon className="w-3.5 h-3.5" />
          <span>{link.title}</span>
        </Link>
      )
    })}
  </div>
</CardContent>
```

### Integration Notes

1. **Routing**: Ensure React Router is configured with these routes:
   - `/field-reports` → Field Reports page
   - `/tasks-and-reminders` → Combined Tasks & Reminders page
   - `/lists` → Lists management page

2. **Click Behavior**: 
   - Clicking the card header/title does nothing
   - Only the 4 link buttons navigate to their respective pages

3. **Consistency**:
   - The FLRTS card should have the same height as other app cards
   - Use the same hover shadow effect as other cards
   - Maintain the same spacing and typography