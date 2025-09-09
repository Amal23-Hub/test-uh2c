"use client"

import React from "react"
import { ParticipationProvider } from "@/lib/participation-context"

export default function ParticipationManifestationDivisionRechercheLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ParticipationProvider>{children}</ParticipationProvider>
}


