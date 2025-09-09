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

import { useParticipation } from '@/lib/participation-context'





//DATA chercheurs
const chercheurs: string[] = [
  "Naciri Mohamed", "Kadiri Jawad", "Amrani Lamia", "yhyawi Fouad", "Amrawi Imane"
]








export default function ParticipationManifestationMember() {

/***************Traitement****************/
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [yearFilter, setYearFilter] = useState<string>("all")
  const { toast } = useToast()

  const { addDemandeParticipation } = useParticipation()
  const {demandesParticipations} = useParticipation()

  const [nomPrenomUserConnecte, setNomPrenomUserConnecte]=useState<string>("Elkanoun Mohamed")
  //NB IU: dév StateManagG SécG FrontG(nomPrenomUserConnecte-username)!!!

  
  const filteredDemandesParticipations = demandesParticipations.filter((item) => {
    const matchesSearch =
      item.nomPrenomDemandeur.includes(nomPrenomUserConnecte)
      item.intituleManifestation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.villeManifestation.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || item.natureManifestation === typeFilter
    const matchesYear = yearFilter === "all" || item.dateManifestation.startsWith(yearFilter)
    return matchesSearch && matchesType && matchesYear
  })
  

  

  

  // Obtenir la date actuelle pour limiter la sélection
  const getCurrentDate = () => new Date().toISOString().split('T')[0] // YYYY-MM-DD

  const years = Array.from(new Set(demandesParticipations.map((item) => item.dateManifestation.split("-")[0]))).sort()

  



  /* Traitements Globaes demandes participations manifestations */
  const [isModalOpenParticipation, setIsModalOpenParticipation] = useState(false)
  //const [selected, setSelected] = useState<string[]>([]);

  const [formDataParticipation, setFormDataParticipation] = useState({
    nomPrenomDemandeur: "",
    directeurTheseDoctorant: "",
    gsm: "",
    email: "",
    fonction: "Chercheur" as "Chercheur" | "Enseignant chercheur",
    etablissement: "",
    nomLaboratoire: "",
    discipline: "",
    natureManifestation: "Congrès" as "Congrès" | "Conférence" | "Séminaire" | "Colloque" | "Workshop" | "Stage",
    naturePriseEnCharge: "Frais de séjour" as "Frais de séjour" | "Billet d’avion",
    intituleManifestation: "",
    paysManifestation: "",
    villeManifestation: "",
    dateManifestation: ""
  })

  const resetFormDataParticipation = () => {
    setFormDataParticipation({
      nomPrenomDemandeur: "",
      directeurTheseDoctorant: "",
      gsm: "",
      email: "",
      fonction: "Chercheur" as "Chercheur" | "Enseignant chercheur",
      etablissement: "",
      nomLaboratoire: "",
      discipline: "",
      natureManifestation: "Congrès" as "Congrès" | "Conférence" | "Séminaire" | "Colloque" | "Workshop" | "Stage",
      naturePriseEnCharge: "Frais de séjour" as "Frais de séjour" | "Billet d’avion",   
      intituleManifestation: "",
      paysManifestation: "",
      villeManifestation: "",
      dateManifestation: ""
    })
  }
  
  //méthode traitements envoyer demande participation
  const handleSubmitDemandeParticipation = (e: React.FormEvent) => {
    e.preventDefault()

    //validations
    //

    const newDemandeParticipation: DemandeParticipation = {
      id: Date.now().toString(),
      nomPrenomDemandeur: formDataParticipation.nomPrenomDemandeur,
      directeurTheseDoctorant: formDataParticipation.directeurTheseDoctorant,
      gsm: formDataParticipation.gsm,
      email: formDataParticipation.email,
      fonction: formDataParticipation.fonction,
      etablissement: formDataParticipation.etablissement,
      nomLaboratoire: formDataParticipation.nomLaboratoire,
      discipline: formDataParticipation.discipline,
      natureManifestation: formDataParticipation.natureManifestation,
      naturePriseEnCharge: formDataParticipation.naturePriseEnCharge,   
      intituleManifestation: formDataParticipation.intituleManifestation,
      paysManifestation: formDataParticipation.paysManifestation,
      villeManifestation: formDataParticipation.villeManifestation,
      dateManifestation: formDataParticipation.dateManifestation
    }

    console.log(newDemandeParticipation.nomPrenomDemandeur+"-----"+newDemandeParticipation.dateManifestation)
    console.log("******************************************************************")
    
    // Vérifiez que la fonction existe
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

    toast({title: "Nouvelle demande participation manifestation ajoutée"})


    setIsModalOpenParticipation(false)
    resetFormDataParticipation()
  }
  
  




/***************vue****************/
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Manifestations Scientifiques</h1>
              <p className="text-gray-600 mt-2">Demander Participations aux manifestations non organisé à l'UH2C</p>
            </div>

            

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Liste des Demandes personnels de Participation aux manifestations</CardTitle>
                  <Dialog open={isModalOpenParticipation} onOpenChange={setIsModalOpenParticipation}>
                    <DialogTrigger asChild>
                      <Button onClick={resetFormDataParticipation}>
                        <Plus className="h-4 w-4 mr-2" />
                        Demander participation manifestation
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Demander participation à une manifestation</DialogTitle>
                      </DialogHeader>

                      <form onSubmit={handleSubmitDemandeParticipation} className="space-y-6">
                        <div className="grid grid-cols-3 gap-6">
                          <div>
                            <Label htmlFor="nomPrenomDemandeur">nom Prenom Demandeur *</Label>
                            <Input
                              id="nomPrenomDemandeur"
                              value={formDataParticipation.nomPrenomDemandeur}
                              onChange={(e) => setFormDataParticipation((prev) => ({ ...prev, nomPrenomDemandeur: e.target.value }))}
                              required
                            />
                          </div>

                          <div>
                            <Label htmlFor="directeurTheseDoctorant">directeur These Doctorant</Label>
                            <Input
                              id="directeurTheseDoctorant"
                              value={formDataParticipation.directeurTheseDoctorant}
                              onChange={(e) => setFormDataParticipation((prev) => ({ ...prev, directeurTheseDoctorant: e.target.value }))}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-6">
                          <div>
                            <Label htmlFor="gsm">gsm</Label>
                            <Input
                              id="gsm"
                              value={formDataParticipation.gsm}
                              onChange={(e) => setFormDataParticipation((prev) => ({ ...prev, gsm: e.target.value }))}
                              required
                            />
                          </div>

                          <div>
                            <Label htmlFor="directeurTheseDoctorant">email</Label>
                            <Input
                              id="email"
                              value={formDataParticipation.email}
                              onChange={(e) => setFormDataParticipation((prev) => ({ ...prev, email: e.target.value }))}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-6">
                          <div>
                            <Label htmlFor="fonction">fonction</Label>
                            <Select
                              value={formDataParticipation.fonction}
                              onValueChange={(value: "Chercheur" | "Enseignant chercheur") =>
                                setFormDataParticipation((prev) => ({ ...prev, fonction: value }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Chercheur">Chercheur</SelectItem>
                                <SelectItem value="Enseignant chercheur">Enseignant chercheur</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="etablissement">etablissement</Label>
                            <Select
                              value={formDataParticipation.etablissement}
                              onValueChange={(value: string ) =>
                                setFormDataParticipation((prev) => ({ ...prev, etablissement: value }))
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
                        </div>

                        <div className="grid grid-cols-3 gap-6">
                          <div>
                            <Label htmlFor="nomLaboratoire">nom Laboratoire</Label>
                            <Input
                              id="nomLaboratoire"
                              value={formDataParticipation.nomLaboratoire}
                              onChange={(e) => setFormDataParticipation((prev) => ({ ...prev, nomLaboratoire: e.target.value }))}
                              required
                            />
                          </div>

                          <div>
                            <Label htmlFor="discipline">discipline</Label>
                            <Input
                              id="discipline"
                              value={formDataParticipation.discipline}
                              onChange={(e) => setFormDataParticipation((prev) => ({ ...prev, discipline: e.target.value }))}
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-6">
                          <div>
                            <Label htmlFor="natureManifestation">nature Manifestation</Label>
                            <Select
                              value={formDataParticipation.natureManifestation}
                              onValueChange={(value: "Congrès" | "Conférence" | "Séminaire" | "Colloque" | "Workshop" | "Stage") =>
                                setFormDataParticipation((prev) => ({ ...prev, natureManifestation: value }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Congrès">Congrès</SelectItem>
                                <SelectItem value="Conférence">Conférence</SelectItem>
                                <SelectItem value="Séminaire">Séminaire</SelectItem>
                                <SelectItem value="Colloque">Colloque</SelectItem>
                                <SelectItem value="Workshop">Workshop</SelectItem>
                                <SelectItem value="Stage">Stage</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="naturePriseEnCharge">nature PriseEnCharge</Label>
                            <Select
                              value={formDataParticipation.naturePriseEnCharge}
                              onValueChange={(value: "Frais de séjour" | "Billet d’avion") =>
                                setFormDataParticipation((prev) => ({ ...prev, naturePriseEnCharge: value }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Frais de séjour">Frais de séjour</SelectItem>
                                <SelectItem value="Billet d’avion">Billet d’avion</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-6">
                          <div>
                            <Label htmlFor="intituleManifestation">intitule Manifestation</Label>
                            <Input
                              id="intituleManifestation"
                              value={formDataParticipation.intituleManifestation}
                              onChange={(e) => setFormDataParticipation((prev) => ({ ...prev, intituleManifestation: e.target.value }))}
                            />
                          </div>

                          <div>
                            <Label htmlFor="paysManifestation">pays Manifestation</Label>
                            <Select
                              value={formDataParticipation.paysManifestation}
                              onValueChange={(value: string) =>
                                setFormDataParticipation((prev) => ({ ...prev, paysManifestation: value }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un pays" />
                              </SelectTrigger>
                              <SelectContent>
                                {paysMonde.map((p) => (
                                  <SelectItem key={p} value={p}>
                                    {p}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-6">
                          <div>
                            <Label htmlFor="villeManifestation">villeManifestation</Label>
                            <Select
                              value={formDataParticipation.villeManifestation}
                              onValueChange={(value: string) =>
                                setFormDataParticipation((prev) => ({ ...prev, villeManifestation: value }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner une ville" />
                              </SelectTrigger>
                              <SelectContent>
                                {villesMonde.map((v) => (
                                  <SelectItem key={v} value={v}>
                                    {v}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label htmlFor="dateManifestation">date Manifestation</Label>
                            <Input
                              id="dateManifestation"                                                                                                                                                                        
                              type="date"
                              value={formDataParticipation.dateManifestation}
                              onChange={(e) => setFormDataParticipation((prev) => ({ ...prev, dateManifestation: e.target.value }))}
                            />
                          </div>
                        </div>


                        <div className="flex justify-end space-x-2">
                          <Button type="button" variant="outline" onClick={() => setIsModalOpenParticipation(false)}>
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
                filteredDemandesParticipations.length > 0 ? (
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
                                          {filteredDemandesParticipations.map((item) => (
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
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
