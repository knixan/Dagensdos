"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import { updateUserRole } from "@/lib/actions/admin";
import { ROLES } from "@/lib/roles";

type Props = {
  id: string;
  initialRole: string;
};

const OPTIONS = ROLES;

export default function RoleSelect({ id, initialRole }: Props) {
  const [role, setRole] = useState(initialRole.toLowerCase());
  const [loading, setLoading] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newRole = e.target.value;
    const prev = role;
    setRole(newRole);
    setLoading(true);

    try {
      const result = await updateUserRole(id, newRole);

      if (!result.ok) {
        setRole(prev);
        toast.error("Kunde inte uppdatera roll: " + result.error);
      } else {
        toast.success(`Rollen uppdaterad till ${newRole}`);
      }
    } catch {
      setRole(prev);
      toast.error("Nätverksfel vid uppdatering av roll");
    } finally {
      setLoading(false);
    }
  }

  return (
    <select
      value={role}
      onChange={handleChange}
      disabled={loading}
      className="border rounded px-2 py-1 text-sm"
      aria-label="Ändra roll"
    >
      {OPTIONS.map((o) => (
        <option key={o} value={o}>
          {o.charAt(0).toUpperCase() + o.slice(1)}
        </option>
      ))}
    </select>
  );
}
