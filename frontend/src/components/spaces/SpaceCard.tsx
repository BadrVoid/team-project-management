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
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ">

      <div className=" absolute inset-0 -m-1 rounded-2xl border-2 border-primary/20 bg-primary/5 opacity-0 transition-all duration-300 group-hover:opacity-100  " />

      <div className="relative p-6">
        {/* Top */}
        <div className="flex justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              {isPublic ? (
                <Globe2 className="size-5" />
              ) : (
                <Lock className="size-5" />
              )}
            </div>

            <div>
              {/* Name */}
              <h3 className="text-lg font-semibold">{space.name}</h3>

              {/* Visibility */}
              <div className="mt-1.5">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                    isPublic
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
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

          {/* Actions */}
          <div className="relative z-10 flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(space)}
              aria-label={`Edit ${space.name}`}
              className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-primary/10 hover:text-primary"
            >
              <Pencil className="size-4" />
            </button>

            <button
              type="button"
              onClick={() => onDelete(space)}
              aria-label={`Delete ${space.name}`}
              className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="mt-5 min-h-12 line-clamp-2 text-sm leading-6 text-muted-foreground">
          {space.description || "No description provided."}
        </p>

        {/* Bottom */}
        <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
          <span></span>

          <Link
            to={`/spaces/${space.id}`}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-primary transition-colors duration-300 "
          >
            Open Space
            <ArrowRight className="size-4 transition-transform duration-300 " />
          </Link>
        </div>
      </div>
    </div>
  );
}
