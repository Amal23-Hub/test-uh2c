"use client"

import type React from "react"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Filter, Eye, Edit, Trash2, Upload, ExternalLink, FileText, Check, Download, Printer } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

import { paysMonde, villesMonde } from "@/lib/pays-villes"
import { Textarea } from "@/components/ui/textarea"
import { etabUh2c } from "@/lib/etab-uh2c"
import { Alert } from "@/components/ui/alert"
import { DemandeParticipation, listeDemandesParticipationsManifestations } from "@/lib/demandes-participations-member"

import { useParticipation } from '@/lib/participation-context'



/***************Models+DATA****************/
export interface ImprimeDemandeParticipation{
  id: string,

  idDemandeParticipation: string,
  nomPrenomDemandeur: string,
  directeurTheseDoctorant: string,
  gsm: string,
  email: string,
  fonction: "Chercheur" | "Enseignant chercheur",
  etablissement: string,
  nomLaboratoire: string,
  discipline: string,
  natureManifestation: "Congrès" | "Conférence" | "Séminaire" | "Colloque" | "Workshop" | "Stage"
  naturePriseEnCharge: "Frais de séjour" | "Billet d’avion"   
  intituleManifestation: string,
  paysManifestation: string,
  villeManifestation: string,
  dateManifestation: string

  avisResponsableStructureRecherche: string,
  avisCommissionRechercheEtablissement: string,
  avisResponsableEtablissement: string,
  avisCommissionRechercheConseilUniversitaire: string,

  decisionFinaleDemandeParticipation: string,
  commentaireDecisionFinaleDemandeParticipation: string,
  dateDecisionFinaleDemandeParticipation: string,

  statutImprimeDemandeParticipation: "NonGénéré" | "Généré" | "EnSignature" | "Signé"
  dateGenerationImprimeParticipation: string
}















export default function ParticipationManifestationDivisionRecherche() {

/***************Traitement TS****************/
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<DemandeParticipation | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [yearFilter, setYearFilter] = useState<string>("all")
  const { toast } = useToast()
  
  const {demandesParticipations} = useParticipation()
  // const [formImprimeDemandeParticipation, setFormImprimeDemandeParticipation] = useState<ImprimeDemandeParticipation>()

  // ✅ Debug pour vérifier les données
  console.log('🔍 Nombre de demandes reçues:', demandesParticipations.length)
  console.log('📋 Demandes:', demandesParticipations)
  


  const filteredDemandesParticipationsManifestations = demandesParticipations.filter((item) => {
    const matchesSearch =
      item.intituleManifestation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.villeManifestation.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || item.natureManifestation === typeFilter
    const matchesYear = yearFilter === "all" || item.dateManifestation.startsWith(yearFilter)
    return matchesSearch && matchesType && matchesYear
  })
  
  
  // Obtenir la date actuelle pour limiter la sélection
  const getCurrentDate = () => new Date().toISOString().split('T')[0] // YYYY-MM-DD

  const years = Array.from(new Set(demandesParticipations.map((item) => item.dateManifestation.split("-")[0]))).sort()

  
  


  //partie génération document imprimé TO Décision:
  //variables
  const [showDocumentModal, setShowDocumentModal]=useState(false)
  const [selectedDemandeParticipation, setSelectedDemandeParticipation]=useState<DemandeParticipation|undefined>()
  const [newImprimeDemandeParticipation, setNewImprimeDemandeParticipation]=useState<ImprimeDemandeParticipation|undefined>()
  
  //methode handleGenerateDocument
  const handleGenerateDocument = (item: DemandeParticipation) => {
    try {
      setSelectedDemandeParticipation(item)
      setShowDocumentModal(true)
      
      if (item) {
        const newImprimeDemandeParticipation: ImprimeDemandeParticipation = {
          id: Date.now().toString(), // Correction: ajout des parenthèses
          idDemandeParticipation: item.id,
          nomPrenomDemandeur: item.nomPrenomDemandeur,
          directeurTheseDoctorant: item.directeurTheseDoctorant,
          gsm: item.gsm,
          email: item.email,
          fonction: item.fonction,
          etablissement: item.etablissement,
          nomLaboratoire: item.nomLaboratoire,
          discipline: item.discipline,
          natureManifestation: item.natureManifestation,
          naturePriseEnCharge: item.naturePriseEnCharge,
          intituleManifestation: item.intituleManifestation,
          paysManifestation: item.paysManifestation,
          villeManifestation: item.villeManifestation,
          dateManifestation: item.dateManifestation,

          avisResponsableStructureRecherche: "",
          avisCommissionRechercheEtablissement: "",
          avisResponsableEtablissement: "",
          avisCommissionRechercheConseilUniversitaire: "",
          decisionFinaleDemandeParticipation: "",
          commentaireDecisionFinaleDemandeParticipation: "",
          dateDecisionFinaleDemandeParticipation: "",

          statutImprimeDemandeParticipation: "Généré",
          dateGenerationImprimeParticipation: new Date().toISOString().split('T')[0]
        }
        
        console.log("Document généré:", newImprimeDemandeParticipation)
        toast({ 
          title: "Document généré avec succès",
          description: `Imprimé de demande généré pour ${item.nomPrenomDemandeur}`
        })
      }
    } catch (error) {
      console.error("Erreur lors de la génération du document:", error)
      toast({ 
        title: "Erreur",
        description: "Impossible de générer le document",
        variant: "destructive"
      })
    }
  }


  // methode handlePrintDocument
  const handlePrintDocument = () => {
    window.print()
  }
  
  // Simulation de téléchargement du document
  const handleDownloadDocument = () => {
    const content = generateDocumentContent()
    const blob = new Blob([content], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `décision-demande-participation-manifestation-${selectedDemandeParticipation?.id}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
  
  // methode generateDocumentContent
  const generateDocumentContent = () => {
    if (!newImprimeDemandeParticipation) return ""
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Décision sur demande participation manifestation - ${newImprimeDemandeParticipation.intituleManifestation}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            font-size: 11px;
            line-height: 1.3;
          }
          .header { 
            text-align: center; 
            border-bottom: 2px solid #333; 
            padding-bottom: 15px; 
            margin-bottom: 20px; 
          }
          .document-title {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 8px;
          }
          .project-info { 
            margin-bottom: 20px; 
            border: 1px solid #ccc;
            padding: 12px;
          }
          .info-row {
            display: flex;
            margin-bottom: 10px;
          }
          .info-label {
            font-weight: bold;
            width: 200px;
            min-width: 200px;
          }
          .info-value {
            flex: 1;
            border-bottom: 1px solid #ccc;
            padding-left: 10px;
          }
          .section-title {
            font-size: 13px;
            font-weight: bold;
            text-align: center;
            margin: 15px 0 12px 0;
            background-color: #f0f0f0;
            padding: 6px;
            border: 1px solid #ccc;
          }
          .table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          .table th {
            background-color: #1e3a8a;
            color: white;
            font-weight: bold;
            padding: 6px;
            border: 1px solid #ccc;
            text-align: left;
            font-size: 10px;
          }
          .table td {
            padding: 6px;
            border: 1px solid #ccc;
            font-size: 10px;
          }
          .table .total-row {
            background-color: #1e3a8a;
            color: white;
            font-weight: bold;
          }
          .table .total-row td {
            border: 1px solid #ccc;
          }
          .amount-cell {
            text-align: right;
            font-weight: bold;
          }
          .signature { 
            margin-top: 30px; 
            display: flex; 
            justify-content: space-between; 
          }
          .signature-box { 
            border: 1px solid #333; 
            padding: 8px; 
            width: 180px; 
            text-align: center; 
          }
          @media print { 
            body { margin: 15px; } 
            .table th, .table td { font-size: 9px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="document-title">Imprimé décision  N°${newImprimeDemandeParticipation.id} du Demande Participation manifestation N°${newImprimeDemandeParticipation.idDemandeParticipation}</div>
          <div class="document-title">Demande Participation manifestation N°${newImprimeDemandeParticipation.idDemandeParticipation}</div>
        </div>
        <div class="project-info">
          <div class="info-row">
            <div class="info-label">Université :</div>
            <div class="info-value">Université Hassan II de Casablanca</div>
          </div>
          <div class="info-row">
            <div class="info-label">Etablissement :</div>
            <div class="info-value">${newImprimeDemandeParticipation.etablissement}</div>
          </div>
          <div class="info-row">
            <div class="info-label">nomPrenomDemandeur :</div>
            <div class="info-value">${newImprimeDemandeParticipation.nomPrenomDemandeur}</div>
          </div>
          <div class="info-row">
            <div class="info-label">directeurTheseDoctorant :</div>
            <div class="info-value">${newImprimeDemandeParticipation.directeurTheseDoctorant}</div>
          </div>
          <div class="info-row">
            <div class="info-label">gsm :</div>
            <div class="info-value">${newImprimeDemandeParticipation.gsm}</div>
          </div>
          <div class="info-row">
            <div class="info-label">email :</div>
            <div class="info-value">${newImprimeDemandeParticipation.email}</div>
          </div>
          <div class="info-row">
            <div class="info-label">fonction :</div>
            <div class="info-value">${newImprimeDemandeParticipation.fonction}</div>
          </div>
          <div class="info-row">
            <div class="info-label">nom Laboratoire :</div>
            <div class="info-value">${newImprimeDemandeParticipation.nomLaboratoire}</div>
          </div>
          <div class="info-row">
            <div class="info-label">discipline :</div>
            <div class="info-value">${newImprimeDemandeParticipation.discipline}</div>
          </div>
          <div class="info-row">
            <div class="info-label">nature Manifestation :</div>
            <div class="info-value">${newImprimeDemandeParticipation.natureManifestation}</div>
          </div>
          <div class="info-row">
            <div class="info-label">nature PriseEnCharge :</div>
            <div class="info-value">${newImprimeDemandeParticipation.naturePriseEnCharge}</div>
          </div>

          <div class="info-row">
            <div class="info-label">pays Manifestation :</div>
            <div class="info-value">${newImprimeDemandeParticipation.paysManifestation}</div>
          </div>
          <div class="info-row">
            <div class="info-label">ville Manifestation :</div>
            <div class="info-value">${newImprimeDemandeParticipation.villeManifestation}</div>
          </div>
          <div class="info-row">
            <div class="info-label">date Manifestation :</div>
            <div class="info-value">${newImprimeDemandeParticipation.dateManifestation}</div>
          </div>
        </div>
        
            
        
        <div class="signature">
            <div class="signature-box">
              <p><strong>1. Responsable de la structure</strong></p>
              <p style="font-size: 10px; color: #666; margin-top: 5px;">AVIS MOTIVE DU RESPONSABLE DE LA STRUCTURE DE RECHERCHE</p>
            <p style="margin-top: 50px;">_________________</p>
            <p style="font-size: 10px; color: #666; margin-top: 5px;">Date: _______________</p>
          </div>
          <div class="signature-box">
            <p><strong>2. COMMISSION RECHERCHE DE L’ETABLISSEMENT</strong></p>
              <p style="font-size: 10px; color: #666; margin-top: 5px;">AVIS MOTIVE DE LA COMMISSION RECHERCHE DE L’ETABLISSEMENT</p>
            <p style="margin-top: 50px;">_________________</p>
            <p style="font-size: 10px; color: #666; margin-top: 5px;">Date: _______________</p>
          </div>
          <div class="signature-box">
              <p><strong>3. RESPONSABLE D’ETABLISSEMENT</strong></p>
              <p style="font-size: 10px; color: #666; margin-top: 5px;">AVIS DU RESPONSABLE D’ETABLISSEMENT</p>
              <p style="margin-top: 50px;">_________________</p>
              <p style="font-size: 10px; color: #666; margin-top: 5px;">Date: _______________</p>
            </div>
          
          <div class="signature-box">
            <p><strong>4. COMMISSION « RECHERCHE» DU CONSEIL D’UNIVERSITE</strong></p>
            <p style="font-size: 10px; color: #666; margin-top: 5px;">AVIS DE LA COMMISSION « RECHERCHE» DU CONSEIL D’UNIVERSITE</p>
            <p style="margin-top: 50px;">_________________</p>
            <p style="font-size: 10px; color: #666; margin-top: 5px;">Date: _______________</p>
          </div>
        </div>
        
        <div style="margin-top: 20px; text-align: center; border-top: 2px solid #007bff; padding-top: 15px;">
          <div class="signature-box" style="display: inline-block; margin: 0 20px;">
            <p><strong>5. Décision finale</strong></p>
            <p style="margin-top: 50px;">_________________</p>
            <p style="font-size: 10px; color: #666; margin-top: 5px;">Commentaire: _______________</p>
            <p style="font-size: 10px; color: #666; margin-top: 5px;">Date: _______________</p>
          </div>
        </div>

        
        
        <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 5px;">
          <p style="margin: 0; font-size: 11px; color: #495057; line-height: 1.4;">
            <strong>NOTE :</strong> Le Pôle Recherche est notifié et transmet ce document à la hiérarchie pour signature dans l'ordre suivant :<br/>
            • Responsable de la structure (Responsable de la structure d'appartenance)<br/>
            • Coordinateur du projet (Coordinateur du projet)<br/>
            • Chef d'établissement (Chef d'établissement)<br/>
            </strong> Une fois toutes les signatures obtenues, le document est soumis au Président pour signature finale.
          </p>
        </div>
        
      

        <div style="margin-top: 30px; text-align: center; font-size: 10px; color: #666;">
          <p>Document généré le ${new Date().toLocaleDateString('fr-FR')}</p>
        </div>
        
        
      </body>
      </html>
    `
  }
  



  
  




/***************Vue TSX****************/
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Manifestations Scientifiques-Division Recherche</h1>
              <p className="text-gray-600 mt-2">Prendre décisions sur demandes Participations aux manifestations non organisé à l'UH2C</p>
            </div>

            
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Liste des demandes de Participations aux manifestations non organisé à l'UH2C</CardTitle>
                </div>
              </CardHeader>
              
              <CardContent >
                <div className="flex gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Rechercher par intitulé ou ville..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-48">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les types</SelectItem>
                      <SelectItem value="Congrès">Congrès</SelectItem>
                      <SelectItem value="Conférence">Conférence</SelectItem>
                      <SelectItem value="Séminaire">Séminaire</SelectItem>
                      <SelectItem value="Colloque">Colloque</SelectItem>
                      <SelectItem value="Workshop">Workshop</SelectItem>
                      <SelectItem value="Stage">Stage</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Année" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes</SelectItem>
                      {years.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

              

                {//liste manifestations
                filteredDemandesParticipationsManifestations.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>nomPrenom Demandeur</TableHead>
                          <TableHead>directeur These Doctorant</TableHead>
                          <TableHead>gsm</TableHead>
                          <TableHead>email</TableHead>
                          <TableHead>fonction</TableHead>
                          <TableHead>etablissement</TableHead>
                          <TableHead>nom Laboratoire</TableHead>
                          <TableHead>discipline</TableHead>
                          <TableHead>nature Manifestation</TableHead>
                          <TableHead>nature PriseEnCharge</TableHead>
                          <TableHead>intitule Manifestation</TableHead>
                          <TableHead>pays Manifestation</TableHead>
                          <TableHead>ville Manifestation</TableHead>
                          <TableHead>date Manifestation</TableHead>
                          <TableHead>statut Demande Participation</TableHead>
                          <TableHead>Décision</TableHead>
                          <TableHead>Commentaire expert</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredDemandesParticipationsManifestations.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="max-w-xs">
                              <div className="truncate" title={item.nomPrenomDemandeur}>
                                {item.nomPrenomDemandeur}
                              </div>
                            </TableCell>
                            <TableCell>{item.directeurTheseDoctorant}</TableCell>
                            <TableCell>{item.gsm}</TableCell>
                            <TableCell>{item.email}</TableCell>
                            <TableCell>{item.fonction}</TableCell>
                            <TableCell>{item.etablissement}</TableCell>
                            <TableCell>{item.nomLaboratoire}</TableCell>
                            <TableCell>{item.discipline}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">{item.natureManifestation}</Badge>
                            </TableCell>
                            <TableCell>{item.naturePriseEnCharge}</TableCell>
                            <TableCell>{item.intituleManifestation}</TableCell>
                            <TableCell>{item.paysManifestation}</TableCell>
                            <TableCell>{item.villeManifestation}</TableCell>
                            <TableCell>{new Date(item.dateManifestation).toLocaleDateString("fr-FR")}</TableCell>

                            <TableCell>
                              EnCours
                            </TableCell>
                            <TableCell className="max-w-xs">
                              <div className="truncate">
                                ---
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="sm" onClick={() => handleGenerateDocument(item)}>
                                  Générer imprimé
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Aucune manifestation trouvée</p>
                    <p className="text-sm text-gray-400">
                      {searchTerm || typeFilter !== "all" || yearFilter !== "all"
                        ? "Essayez de modifier vos filtres"
                        : "Commencez par ajouter une nouvelle manifestation"}
                    </p>
                  </div>
                )}
      

      




                 {/* Modal d'aperçu du document */}
                 <div>
                  <Dialog open={showDocumentModal} onOpenChange={setShowDocumentModal}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-6 w-6 text-uh2c-blue" />
              Aperçu du document - Programme d'emploi
            </DialogTitle>
          </DialogHeader>
          {selectedDemandeParticipation !== undefined && (
            <div className="space-y-6">
              {/* Informations du document */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-blue-900 text-lg mb-2">Document prêt à imprimer</h3>
                    <p className="text-blue-800 text-sm">
                      Ce document contient toutes les informations de la demande participation manifestation sélectionnée.
                      Il peut être imprimé et signé par les parties concernées.
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-blue-600">Manifestation</div>
                    <div className="font-bold text-blue-900">{selectedDemandeParticipation.intituleManifestation}</div>
                    <div className="text-sm text-blue-600 mt-1">
                      
                    </div>
                  </div>
                </div>
              </div>


              
              {/* Aperçu du document */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                <div className="text-center border-b-2 border-gray-300 pb-4 mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">DECISION SUR DEMANDE PARTICIPATION MANIFESTATION </h1>
                  <h2 className="text-lg font-semibold text-gray-700 mb-1">Université Hassan II de Casablanca</h2>
                  <p className="text-gray-600">Division de la Recherche</p>
                </div>
                
                <div className="space-y-6">
                  {/* Informations du projet */}
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-3">Informations de manifestation</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="font-medium text-gray-700">intitulé :</span>
                        <p className="text-gray-900">{selectedDemandeParticipation.intituleManifestation}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">nomPrenom Demandeur :</span>
                        <p className="text-gray-900">{selectedDemandeParticipation.nomPrenomDemandeur}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">gsm :</span>
                        <p className="text-gray-900">{selectedDemandeParticipation.gsm}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">email :</span>
                        <p className="text-gray-900">{selectedDemandeParticipation.email}</p>
                      </div>


                      <div>
                        <span className="font-medium text-gray-700">fonction :</span>
                        <p className="text-gray-900">{selectedDemandeParticipation.fonction}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">directeurThese Doctorant :</span>
                        <p className="text-gray-900">{selectedDemandeParticipation.directeurTheseDoctorant}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">etablissement :</span>
                        <p className="text-gray-900">{selectedDemandeParticipation.etablissement}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">nom Laboratoire :</span>
                        <p className="text-gray-900">{selectedDemandeParticipation.nomLaboratoire} MAD</p>
                      </div>



                      <div>
                        <span className="font-medium text-gray-700">discipline :</span>
                        <p className="text-gray-900">{selectedDemandeParticipation.discipline}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">natureManifestation :</span>
                        <p className="text-gray-900">{selectedDemandeParticipation.natureManifestation}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">nature PriseEnCharge :</span>
                        <p className="text-gray-900">{selectedDemandeParticipation.naturePriseEnCharge}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">pays Manifestation :</span>
                        <p className="text-gray-900">{selectedDemandeParticipation.paysManifestation} MAD</p>
                      </div>
                    </div>

                    

                      <div>
                        <span className="font-medium text-gray-700">ville Manifestation :</span>
                        <p className="text-gray-900">{selectedDemandeParticipation.villeManifestation}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">date Manifestation :</span>
                        <p className="text-gray-900">{selectedDemandeParticipation.dateManifestation}</p>
                      </div>
                  </div>


                  {/* Rubriques d'emploi */}
                  <div>
                    <div className="space-y-4">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-700 ml-4">ville Manifestation :</span>
                            <span className="font-medium text-gray-900">{selectedDemandeParticipation.villeManifestation}</span>
                          </div>
                                 
                        </div>
                      </div>
                    </div>
                  </div>

                  

                  {/* Processus de signature */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-gray-900 text-lg mb-3">Processus de signature</h4>
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* Signataires par défaut */}
                        <div className="text-center p-3 bg-white rounded border border-gray-200">
                          <p className="text-sm font-medium text-gray-800 mb-1">1. Responsable de la structure</p>
                          <p className="text-xs text-gray-600 mb-2">AVIS MOTIVE DU RESPONSABLE DE LA STRUCTURE DE RECHERCHE</p>
                          <div className="text-sm text-gray-600 border-t border-gray-200 pt-2">
                            _________________
                          </div>
                        </div>
                        <div className="text-center p-3 bg-white rounded border border-gray-200">
                          <p className="text-sm font-medium text-gray-800 mb-1">2. COMMISSION RECHERCHE DE L’ETABLISSEMENT</p>
                          <p className="text-xs text-gray-600 mb-2">AVIS MOTIVE DE LA COMMISSION RECHERCHE DE L’ETABLISSEMENT </p>
                          <div className="text-sm text-gray-600 border-t border-gray-200 pt-2">
                            _________________
                          </div>
                        </div>
                        <div className="text-center p-3 bg-white rounded border border-gray-200">
                          <p className="text-sm font-medium text-gray-800 mb-1">3. RESPONSABLE D’ETABLISSEMENT</p>
                          <p className="text-xs text-gray-600 mb-2">AVIS DU RESPONSABLE D’ETABLISSEMENT</p>
                          <div className="text-sm text-gray-600 border-t border-gray-200 pt-2">
                            _________________
                          </div>
                        </div>
                        <div className="text-center p-3 bg-white rounded border border-gray-200">
                          <p className="text-sm font-medium text-gray-800 mb-1">4. COMMISSION « RECHERCHE» DU CONSEIL D’UNIVERSITE</p>
                          <p className="text-xs text-gray-600 mb-2">AVIS DE LA COMMISSION « RECHERCHE» DU CONSEIL D’UNIVERSITE</p>
                          <div className="text-sm text-gray-600 border-t border-gray-200 pt-2">
                            _________________
                          </div>
                        </div>
                      </div>
                      

                      <div className="text-center p-3 bg-white rounded border border-gray-200">
                        <p className="text-sm font-medium text-gray-800 mb-2">5. Décision finale</p>
                        <div className="text-sm text-gray-600 border-t border-gray-200 pt-2">
                          _________________
                        </div>

                        <p className="text-sm font-medium text-gray-800 mb-2">Commentaire décision</p>
                        <div className="text-sm text-gray-600 border-t border-gray-200 pt-2">
                          _________________
                        </div>
                      </div>
                    </div>
                  </div>



                  {/* Date de génération */}
                  <div className="text-center text-sm text-gray-500">
                    <p>Document généré le {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Actions du document */}
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowDocumentModal(false)}>
                  Fermer
                </Button>
                <Button variant="outline" onClick={handleDownloadDocument}>
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
                <Button onClick={handlePrintDocument}>
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimer et signer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
                 </div>
                 
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}



