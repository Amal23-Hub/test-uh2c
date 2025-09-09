//model DemandeParticipation
export interface DemandeParticipation{
  id: string,
  nomPrenomDemandeur: string,
  directeurTheseDoctorant: string,
  gsm: string,
  email: string,
  fonction: "Chercheur" | "Enseignant chercheur",
  etablissement: string,
  nomLaboratoire: string,
  discipline: string,
  natureManifestation: "Congrès" | "Conférence" | "Séminaire" | "Colloque" | "Workshop" | "Stage",
  naturePriseEnCharge: "Frais de séjour" | "Billet d’avion",   
  intituleManifestation: string,
  paysManifestation: string,
  villeManifestation: string,
  dateManifestation: string
}

//DATA liste demandes participations à manifestations non organisées à UH2C
export const listeDemandesParticipationsManifestations: DemandeParticipation[] = [];