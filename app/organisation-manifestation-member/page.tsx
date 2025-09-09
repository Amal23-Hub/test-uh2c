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
import { Plus, Search, Filter, Eye, Edit, Trash2, Upload, ExternalLink, FileText, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

import { paysMonde, villesMonde } from "@/lib/pays-villes"
import { Textarea } from "@/components/ui/textarea"
import { etabUh2c } from "@/lib/etab-uh2c"
import { DemandeParticipation, listeDemandesParticipationsManifestations } from "@/lib/demandes-participations-member"

import { useOrganisation } from "@/lib/organisation-context"
import { DemandeOrganisation } from "@/lib/models/demande-organisation-member"



/***************DATA****************/
//DATA chercheurs
const chercheurs: string[] = [
  "Naciri Mohamed", "Kadiri Jawad", "Amrani Lamia", "yhyawi Fouad", "Amrawi Imane"
]

//liste demandes organisation
const listeDemandesOrganisation: DemandeOrganisation[] = []

//nomPrenom coordinateur Manif uh2c connecté
const nomPrenomCoordinateurConnecte: string="Yousfi"

//liste partenaires
const publicCible: string[] = ["Enseignant","Doctorants","industriels","ect"]








export default function OrganisationManifestationMember() {

/***************Composant****************/
  const [isModalOpenOrganisation, setIsModalOpenOrganisation] = useState(false)
  const [editingItem, setEditingItem] = useState<DemandeOrganisation | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [yearFilter, setYearFilter] = useState<string>("all")
  const { toast } = useToast()

  const [demandesOrganisation, setDemandesOrganisation] = useState<DemandeOrganisation[]>(listeDemandesOrganisation)

  const [selectedOrganisateurs, setSelectedOrganisateurs] = useState<string[]>([]);

  const [selectedPublicCible, setSelectedPublicCible] = useState<string[]>([]);
  
  //const [selected, setSelected] = useState<string[]>([]);

  const [formDataOrganisation, setFormDataOrganisation] = useState({
    intitule: "",
    type: "Colloque" as "Colloque" | "journée d’étude" | "séminaire" | "atelier",
    lieu: "",
    dateDebut: "",
    dateFin: "",

    nomPrenomCoordinateur: "",
    nomsEnseignantsOrganisateursUh2c: "",
    statutIndexation: "EnCours" as "EnCours" | "Obtenu", 
    partenaires: "",
    publicCible: "",
  
    resume: "",
    justificatifs: [] as File []
  })

  const resetFormDataOrganisation = () => {
    setFormDataOrganisation({
      intitule: "",
    type: "Colloque" as "Colloque" | "journée d’étude" | "séminaire" | "atelier",
    lieu: "",
    dateDebut: "",
    dateFin: "",

    nomPrenomCoordinateur: nomPrenomCoordinateurConnecte,
    nomsEnseignantsOrganisateursUh2c: "",
    statutIndexation: "EnCours" as "EnCours" | "Obtenu", 
    partenaires: "",
    publicCible: "",
  
    resume: "",
    justificatifs: []
    })
    
    setEditingItem(null)
  }

  
  const filteredDemandesOrganisations = demandesOrganisation.filter((item) => {
    const matchesSearch =
      item.intitule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.lieu.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || item.type === typeFilter
    const matchesYear = yearFilter === "all" || item.dateDebut.startsWith(yearFilter)
    return matchesSearch && matchesType && matchesYear
  })

  const handleEdit = (item: DemandeOrganisation) => {
    setEditingItem(item)
    
    setIsModalOpenOrganisation(true)
  }

  const handleDelete = (id: string) => {
    setDemandesOrganisation((prev) => prev.filter((item) => item.id !== id))
    toast({ title: "DemandeOrganisation supprimée avec succès" })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormDataOrganisation((prev) => ({
        ...prev,
        justificatifs: Array.from(e.target.files || []),
      }))
    }
  }

  // Obtenir la date actuelle pour limiter la sélection
  const getCurrentDate = () => new Date().toISOString().split('T')[0] // YYYY-MM-DD

  const years = Array.from(new Set(demandesOrganisation.map((item) => item.dateDebut.split("-")[0]))).sort()
  
  //méthode trait handleChangeOrganisateurs form dde organisation
  const handleChangeOrganisateurs= (event: any) => {
    const value = event.target.value;
    setSelectedOrganisateurs((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value+" /"]
    );
  };

  //méthode trait handleChangePublicCible form dde organisation
  const handleChangePublicCible= (event: any) => {
    const value = event.target.value;
    setSelectedPublicCible((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value+" /"]
    );
  };


  
  
  //traitement envoyer demande organisation
  const handleSubmitDemandeOrganisation = (e: React.FormEvent) => {
    e.preventDefault()

    //validations
    //

    const newDemandeOrganisation: DemandeOrganisation = {
      
      id: Date.now().toString(),
      intitule: formDataOrganisation.intitule,
      type: formDataOrganisation.type,
      lieu: formDataOrganisation.lieu,
      dateDebut: formDataOrganisation.dateDebut,
      dateFin: formDataOrganisation.dateFin,

      nomPrenomCoordinateur: formDataOrganisation.nomPrenomCoordinateur,
      nomsEnseignantsOrganisateursUh2c: selectedOrganisateurs,
      statutIndexation: formDataOrganisation.statutIndexation, 
      partenaires: formDataOrganisation.partenaires,
      publicCible: selectedPublicCible,
  
     resume: formDataOrganisation.resume,
     justificatifs: formDataOrganisation.justificatifs.map((f) => f.name)
    }
    
    // déboggages
    console.log(newDemandeOrganisation.nomPrenomCoordinateur+"-----"+newDemandeOrganisation.dateDebut)
    console.log("******************************************************************")

    setDemandesOrganisation(prev => [...prev, newDemandeOrganisation])
    
    /*
    if (addDemandeParticipation) {
      addDemandeParticipation(newDemandeParticipation);
      console.log('Demande ajoutée:', newDemandeParticipation); // Debug
    } else {
      console.error('addDemandeParticipation non disponible');
    }

    
    demandesParticipations.map(((ddeParticip) => {
      console.log('Demande participation:', ddeParticip)
      console.log("-------------------")
    }))
    */

    toast({title: "Nouvelle demande participation manifestation ajoutée"})


    setIsModalOpenOrganisation(false)
    resetFormDataOrganisation()

    
  }
  
  




/***************Template****************/
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Manifestations Scientifiques</h1>
              <p className="text-gray-600 mt-2">Demander l'organisation d'une manifestation à l'UH2C / Liste demandes organisation manifestations à l'UH2C</p>
            </div>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Liste demandes organisation manifestations à l'UH2C</CardTitle>
                  <Dialog open={isModalOpenOrganisation} onOpenChange={setIsModalOpenOrganisation}>
                    <DialogTrigger asChild>
                      <Button onClick={resetFormDataOrganisation}>
                        <Plus className="h-4 w-4 mr-2" />
                        Demander l'organisation d'une manifestation à l'UH2C
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          Demander l'organisation d'une manifestation à l'UH2C
                        </DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSubmitDemandeOrganisation} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <Label htmlFor="intitule">Intitulé *</Label>
                            <Input
                              id="intitule"
                              value={formDataOrganisation.intitule}
                              onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, intitule: e.target.value }))}
                              required
                            />
                          </div>

                          <div>
                            <Label htmlFor="type">Type</Label>
                            <Select
                              value={formDataOrganisation.type}
                              onValueChange={(value: "Colloque" | "journée d’étude" | "séminaire" | "atelier") =>
                                setFormDataOrganisation((prev) => ({ ...prev, type: value }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Colloque">Colloque</SelectItem>
                                <SelectItem value="journée d’étude">journée d’étude</SelectItem>
                                <SelectItem value="séminaire">séminaire</SelectItem>
                                <SelectItem value="atelier">atelier</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <Label htmlFor="lieu">Lieu</Label>
                              // Composant Select pour les établissements UH2C
                              <Select
                              value={formDataOrganisation.lieu}
                              onValueChange={(value: string ) =>
                                setFormDataOrganisation((prev) => ({ ...prev, lieu: value }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {etabUh2c.map((etab) => ( 
                                  <SelectItem key={etab} value={etab}>{etab}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="dateDebut">Date début</Label>
                            <Input
                              id="dateDebut"
                              type="date"
                              value={formDataOrganisation.dateDebut}
                              onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, dateDebut: e.target.value }))}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <Label htmlFor="dateFin">Date fin</Label>
                            <Input
                              id="dateFin"
                              type="date"
                              value={formDataOrganisation.dateFin}
                              onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, dateFin: e.target.value }))}
                            />
                          </div>

                          <div>
                            <label htmlFor="nomPrenomCoordinateur">nomPrenom Coordinateur</label>
                            <Input
                              id="nomPrenomCoordinateur"
                              type="text"
                              value={nomPrenomCoordinateurConnecte}
                              readOnly 
                              className="bg-gray-100"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-6">
                          <div>
                            <Label>Noms Enseignants Organisateurs UH2C</Label>
                            <div className="space-y-2 max-h-32 overflow-y-auto border rounded-md p-2">
                              {chercheurs.map((chercheur) => (
                                <div key={chercheur} className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id={`org-${chercheur}`}
                                    value={chercheur}
                                    checked={selectedOrganisateurs.includes(chercheur)}
                                    onChange={handleChangeOrganisateurs}
                                    className="rounded border-gray-300"
                                  />
                                  <label htmlFor={`org-${chercheur}`} className="text-sm">
                                    {chercheur}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="statutIndexation">statut Indexation</Label>
                            <Select
                              value={formDataOrganisation.statutIndexation}
                              onValueChange={(value: "EnCours" | "Obtenu") =>
                                setFormDataOrganisation((prev) => ({ ...prev, statutIndexation: value }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="EnCours">EnCours</SelectItem>
                                <SelectItem value="Obtenu">Obtenu</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>       
                        </div>
                         
                        <div className="grid grid-cols-3 gap-6">
                          <div>
                            <Label htmlFor="partenaires">Partenaires</Label>
                            <Input
                              id="partenaires"
                              type="text"
                              value={formDataOrganisation.partenaires}
                              onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, partenaires: e.target.value }))}
                            />
                          </div>

                          <div>
                            <Label>Public Cible</Label>
                            <div className="space-y-2 max-h-32 overflow-y-auto border rounded-md p-2">
                              {publicCible.map((pubC) => (
                                <div key={pubC} className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id={`pub-${pubC}`}
                                    value={pubC}
                                    checked={selectedPublicCible.includes(pubC)}
                                    onChange={handleChangePublicCible}
                                    className="rounded border-gray-300"
                                  />
                                  <label htmlFor={`pub-${pubC}`} className="text-sm">
                                    {pubC}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>


                          
                        </div> 
                        

                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <Label htmlFor="resume">Resume</Label>
                            <Textarea
                              id="resume"
                              value={formDataOrganisation.resume}
                              onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, resume: e.target.value }))}
                            />
                          </div>

                          <div>
                            <Label htmlFor="justificatifs">
                              Pices Jointes 
                              <span className={`ml-1 ${formDataOrganisation.justificatifs.length === 0 ? 'text-red-600' : 'text-gray-500'}`}>
                                {formDataOrganisation.justificatifs.length === 0 ? '*' : ''}
                              </span>
                            </Label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 hover:bg-gray-50 cursor-pointer">
                              <input
                                type="file"
                                multiple
                                onChange={handleFileUpload}
                                className="hidden"
                                id="file-upload"
                              />
                              <label htmlFor="file-upload" className="cursor-pointer">
                                <div className="space-y-3">
                                  <div className="mx-auto w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                                    <FileText className="h-8 w-8 text-gray-400" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-600">
                                      Cliquez pour télécharger ou glissez-déposez
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                      PDF, DOC, DOCX jusqu'à 10MB
                                    </p>
                                  </div>
                                </div>
                                <div>
                               </div>
                                
                              </label>
                              {formDataOrganisation.justificatifs.length > 0 && (
                                <div className="mt-4 space-y-2">
                                  {formDataOrganisation.justificatifs.map((file, index) => (
                                    <div key={index} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                                      <FileText className="h-5 w-5 text-blue-600" />
                                      <span className="flex-1 text-sm text-gray-700 truncate">
                                        {file.name}
                                      </span>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          const newFiles = formDataOrganisation.justificatifs.filter((_, i) => i !== index)
                                          setFormDataOrganisation(prev => ({ ...prev, piecesJointes: newFiles }))
                                        }}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                          <Button type="button" variant="outline" onClick={() => setIsModalOpenOrganisation(false)}>
                            Annuler
                          </Button>
                          <Button type="submit">Envoyer</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
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
                      <SelectItem value="Organisée">Organisée</SelectItem>
                      <SelectItem value="Participation">Participation</SelectItem>
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
                filteredDemandesOrganisations.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Intitulé</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Lieu</TableHead>
                          <TableHead>Date début</TableHead>
                          <TableHead>Date fin</TableHead>
                          <TableHead>nomPrenom Coordinateur</TableHead>
                          <TableHead>noms EnseignantsOrganisateurs Uh2c</TableHead>
                          <TableHead>statutIndexation</TableHead>
                          <TableHead>partenaires</TableHead>
                          <TableHead>public Cible</TableHead>
                          <TableHead>indexation</TableHead>
                          <TableHead>Resumé\Objectifs</TableHead>
                          <TableHead>Justif\Programme</TableHead>
                          <TableHead>statut Demande Participation</TableHead>
                          <TableHead>Décision</TableHead>
                          <TableHead>Commentaire expert</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredDemandesOrganisations.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="max-w-xs">
                              <div className="truncate" title={item.intitule}>
                                {item.intitule}
                              </div>
                              <div className="text-sm text-gray-500">{item.type}</div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">{item.type}</Badge>
                            </TableCell>
                            <TableCell>{item.lieu}</TableCell>
                            <TableCell>{new Date(item.dateDebut).toLocaleDateString("fr-FR")}</TableCell>
                            <TableCell>{new Date(item.dateFin).toLocaleDateString("fr-FR")}</TableCell>
                            <TableCell className="max-w-xs">
                              <div className="truncate" title={item.nomPrenomCoordinateur}>
                                {item.nomPrenomCoordinateur}
                              </div>
                            </TableCell>
                            <TableCell>{item.nomsEnseignantsOrganisateursUh2c}</TableCell>
                            <TableCell>{item.statutIndexation}</TableCell>
                            <TableCell>{item.partenaires}</TableCell>
                            <TableCell>{item.publicCible}</TableCell>
                            <TableCell className="max-w-xs">
                              <div className="truncate" title={item.resume}>
                                {item.resume}
                              </div>
                            </TableCell>
                            <TableCell>
                              {item.justificatifs.length > 0 ? (
                                <Badge variant="outline">{item.justificatifs.length} fichier(s)</Badge>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                            
                            <TableCell>
                                EnCours
                            </TableCell>
                            <TableCell className="max-w-xs">
                              <div className="truncate">
                                ---
                              </div>
                            </TableCell>
                            <TableCell className="max-w-xs">
                              <div className="truncate">
                                ---
                              </div>
                            </TableCell>
        
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Aucune Demande organisation trouvée</p>
                    <p className="text-sm text-gray-400">
                      {searchTerm || typeFilter !== "all" || yearFilter !== "all"
                        ? "Essayez de modifier vos filtres"
                        : "Commencez par ajouter une nouvelle manifestation"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
