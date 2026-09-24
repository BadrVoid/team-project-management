import type { ReactNode } from "react";

interface PermissionButtonProps {
  allowed: boolean;
  children: ReactNode;
}

export function PermissionButton({
  allowed,
  children,
}: PermissionButtonProps) {
  if (!allowed) {
    return null;
  }

  return <>{children}</>;
}