// components/spaces/SpaceSearchToolbar.tsx
import { Search, X } from "lucide-react";

interface FilterOption<T extends string> {
  id: T;
  label: string;
  count?: number;
  icon?: React.ComponentType<{ className?: string }>;
  activeClass?: string;
}

interface SpaceSearchToolbarProps<T extends string> {
  search: string;
  onSearchChange: (value: string) => void;
  activeFilter: T;
  onFilterChange: (filter: T) => void;
  filterOptions: FilterOption<T>[];
  placeholder?: string;
}

export function SpaceSearchToolbar<T extends string>({
  search,
  onSearchChange,
  activeFilter,
  onFilterChange,
  filterOptions,
  placeholder = "Search spaces...",
}: SpaceSearchToolbarProps<T>) {
  return (
    <div className="pt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="h-10 w-full rounded-xl border border-border/80 bg-background/80 pl-10 pr-9 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {/* Filter Segment Controls */}
      <div className="flex flex-wrap items-center rounded-xl border border-border/80 bg-background/60 p-1">
        {filterOptions.map((option) => {
          if (option.count !== undefined && option.count < 0) return null;
          const Icon = option.icon;
          const isActive = activeFilter === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onFilterChange(option.id)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium transition-all ${
                isActive
                  ? option.activeClass || "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {Icon && <Icon className="size-3" />}
              {option.label}
              {option.count !== undefined && ` (${option.count})`}
            </button>
          );
        })}
      </div>
    </div>
  );
}
