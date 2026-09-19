import { Link } from "react-router-dom";
import { ArrowRight, Globe2, Lock, Pencil, Trash2 } from "lucide-react";

import type { SpaceResponse } from "@/api/types";

interface SpaceCardProps {
  space: SpaceResponse;
  onEdit: (space: SpaceResponse) => void;
  onDelete: (space: SpaceResponse) => void;
}

export function SpaceCard({ space, onEdit, onDelete }: SpaceCardProps) {
  const isPublic = space.visibility === "PUBLIC";

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card/90 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-card hover:shadow-xl hover:shadow-primary/5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3.5">
          {/* Main Visibility Icon Badge */}
          <div
            className={`flex size-11 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-105 ${
              isPublic
                ? "bg-sky-500/10 text-sky-600 dark:text-sky-400"
                : "bg-slate-500/10 text-slate-600 dark:text-slate-400"
            }`}
          >
            {isPublic ? (
              <Globe2 className="size-5" />
            ) : (
              <Lock className="size-5" />
            )}
          </div>

          <div className="space-y-1">
            {/* Title */}
            <h3 className="text-base font-semibold tracking-tight text-foreground line-clamp-1 transition-colors group-hover:text-primary">
              {space.name}
            </h3>

            {/* Visibility Tag */}
            <div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors ${
                  isPublic
                    ? "border border-sky-500 bg-sky-500/10 text-cyan-600  "
                    : "border border-slate-500 bg-slate-500/10 text-cyan-600  "
                }`}
              >
                {isPublic ? (
                  <Globe2 className="size-3" />
                ) : (
                  <Lock className="size-3" />
                )}
                {isPublic ? "Public" : "Private"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="relative z-10 flex items-center gap-1.5">
          {/* Edit Button */}
          <button
            type="button"
            onClick={() => onEdit(space)}
            aria-label={`Edit ${space.name}`}
            className="flex size-8 items-center justify-center rounded-lg border border-transparent text-muted-foreground transition-all duration-200 hover:border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 active:scale-95"
          >
            <Pencil className="size-4" />
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={() => onDelete(space)}
            aria-label={`Delete ${space.name}`}
            className="flex size-8 items-center justify-center rounded-lg border border-transparent text-muted-foreground transition-all duration-200 hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive active:scale-95"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="mt-4 min-h-12 line-clamp-2 text-sm leading-relaxed text-muted-foreground/90">
        {space.description || "No description provided."}
      </p>

      {/* Footer & CTA */}
      <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
        <span className="text-xs font-medium text-muted-foreground/60">
          Workspace
        </span>

        {/* Open Space CTA Button */}
        <Link
          to={`/spaces/${space.id}`}
          className="group/btn flex items-center gap-1.5 rounded-xl border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-sm font-medium text-primary transition-all duration-200 hover:border-primary/40 hover:bg-primary/10 hover:shadow-sm active:scale-95"
        >
          Open Space
          <ArrowRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
