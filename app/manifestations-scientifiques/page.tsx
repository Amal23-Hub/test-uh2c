"use client"

import type React from "react"
import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Search, Filter, Eye, Edit, Trash2, Upload, Calendar, MapPin, User, Users, Building2, Target, FileText, XCircle, ExternalLink, AlertTriangle, CheckCircle, Tag } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { etabUh2c } from "@/lib/etab-uh2c"
import { villesFrance } from "@/lib/villes-france"
import { villesEspagne } from "@/lib/villes-espagne"
import { villesAllemagne } from "@/lib/villes-allemagne"
import { villesItalie } from "@/lib/villes-italie"
import { villesCanada } from "@/lib/villes-canada"
import { villesEtatsUnis } from "@/lib/villes-etats-unis"
import { villesBelgique } from "@/lib/villes-belgique"
import { villesSuisse } from "@/lib/villes-suisse"

interface ManifestationScientifique {
  id: string
  intitule: string
  type: string
  dateDebut: string
  dateFin: string
  organisateur: string
  lieu: string
  pays: string
  ville: string
  lien: string
  indexation: string
  resume: string
  programme: File[]
  statut: "Programmée" | "En cours" | "Terminée"
  dateCreation: string
}

// Données de référence
const typesManifestation = [
  "Colloque",
  "Journée d'étude", 
  "Séminaire",
  "Workshop",
  "Conférence",
  "Symposium",
  "Congrès",
  "Autre"
]

const pays = [
  "Maroc",
  "France",
  "Espagne",
  "Allemagne",
  "Italie",
  "Canada",
  "États-Unis",
  "Belgique",
  "Suisse",
  "Autre"
]

const villes = [
  "Casablanca",
  "Rabat",
  "Fès",
  "Marrakech",
  "Agadir",
  "Tanger",
  "Meknès",
  "Oujda",
  "Kénitra",
  "Autre"
]

// Fonction pour obtenir la liste des villes selon le pays
const getVillesByPays = (pays: string): string[] => {
  switch (pays) {
    case "France":
      return villesFrance
    case "Espagne":
      return villesEspagne
    case "Allemagne":
      return villesAllemagne
    case "Italie":
      return villesItalie
    case "Canada":
      return villesCanada
    case "États-Unis":
      return villesEtatsUnis
    case "Belgique":
      return villesBelgique
    case "Suisse":
      return villesSuisse
    case "Maroc":
      return villes
    default:
      return villes
  }
}

export default function ManifestationsScientifiques() {
  const [manifestations, setManifestations] = useState<ManifestationScientifique[]>([
    {
      id: "1",
      intitule: "Conférence Internationale sur l'Intelligence Artificielle",
      type: "Colloque",
      dateDebut: "2024-06-15",
      dateFin: "2024-06-17",
      organisateur: "UH2C",
      lieu: "Faculté des Sciences Ben M'Sik",
      pays: "Maroc",
      ville: "Casablanca",
      lien: "https://conference-ia.uh2c.ma",
      indexation: "En cours",
      resume: "Conférence internationale sur les dernières avancées en intelligence artificielle",
      programme: [],
      statut: "Programmée",
      dateCreation: "2024-01-15"
    },
    {
      id: "2",
      intitule: "Séminaire sur les Technologies Émergentes",
      type: "Séminaire",
      dateDebut: "2024-07-20",
      dateFin: "2024-07-21",
      organisateur: "Autre",
      lieu: "Centre de Conférences",
      pays: "France",
      ville: "Paris",
      lien: "https://seminaire-tech.fr",
      indexation: "Indexée",
      resume: "Séminaire dédié aux technologies émergentes et leur impact sur la société",
      programme: [],
      statut: "En cours",
      dateCreation: "2024-02-10"
    }
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingManifestation, setEditingManifestation] = useState<ManifestationScientifique | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("")
  const [filterStatut, setFilterStatut] = useState("")
  const [selectedManifestations, setSelectedManifestations] = useState<string[]>([])
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    intitule: "",
    type: "",
    dateDebut: "",
    dateFin: "",
    organisateur: "",
    lieu: "",
    pays: "",
    ville: "",
    lien: "",
    indexation: "",
    resume: "",
    programme: [] as File[]
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation basique
    if (!formData.intitule || !formData.type || !formData.dateDebut || !formData.dateFin || 
        !formData.organisateur || !formData.lieu || !formData.pays || !formData.ville) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      })
      return
    }

    // Validation des dates
    const dateDebut = new Date(formData.dateDebut)
    const dateFin = new Date(formData.dateFin)
    
    if (dateFin < dateDebut) {
      toast({
        title: "Erreur",
        description: "La date de fin doit être postérieure à la date de début",
        variant: "destructive"
      })
      return
    }

    const newManifestation: ManifestationScientifique = {
      id: editingManifestation?.id || Date.now().toString(),
      intitule: formData.intitule,
      type: formData.type,
      dateDebut: formData.dateDebut,
      dateFin: formData.dateFin,
      organisateur: formData.organisateur,
      lieu: formData.lieu,
      pays: formData.pays,
      ville: formData.ville,
      lien: formData.lien,
      indexation: formData.indexation,
      resume: formData.resume,
      programme: formData.programme,
      statut: "Programmée",
      dateCreation: editingManifestation?.dateCreation || new Date().toISOString().split('T')[0]
    }

    if (editingManifestation) {
      setManifestations(manifestations.map(m => m.id === editingManifestation.id ? newManifestation : m))
      toast({
        title: "Succès",
        description: "Manifestation mise à jour avec succès"
      })
    } else {
      setManifestations([...manifestations, newManifestation])
      toast({
        title: "Succès", 
        description: "Manifestation ajoutée avec succès"
      })
    }

    // Reset form
    setFormData({
      intitule: "",
      type: "",
      dateDebut: "",
      dateFin: "",
      organisateur: "",
      lieu: "",
      pays: "",
      ville: "",
      lien: "",
      indexation: "",
      resume: "",
      programme: []
    })
    setIsDialogOpen(false)
    setEditingManifestation(null)
  }

  const handleEdit = (manifestation: ManifestationScientifique) => {
    setEditingManifestation(manifestation)
    setFormData({
      intitule: manifestation.intitule,
      type: manifestation.type,
      dateDebut: manifestation.dateDebut,
      dateFin: manifestation.dateFin,
      organisateur: manifestation.organisateur,
      lieu: manifestation.lieu,
      pays: manifestation.pays,
      ville: manifestation.ville,
      lien: manifestation.lien,
      indexation: manifestation.indexation,
      resume: manifestation.resume,
      programme: manifestation.programme
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setManifestations(manifestations.filter(m => m.id !== id))
    toast({
      title: "Succès",
      description: "Manifestation supprimée avec succès"
    })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData({...formData, programme: [...formData.programme, ...files]})
  }

  const removeFile = (index: number) => {
    setFormData({
      ...formData,
      programme: formData.programme.filter((_, i) => i !== index)
    })
  }

  const filteredManifestations = manifestations.filter(manifestation => {
    const matchesSearch = manifestation.intitule.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         manifestation.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         manifestation.ville.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = !filterType || manifestation.type === filterType
    const matchesStatut = !filterStatut || manifestation.statut === filterStatut
    
    return matchesSearch && matchesType && matchesStatut
  })

  const handleSelectManifestation = (id: string) => {
    setSelectedManifestations(prev => 
      prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedManifestations.length === filteredManifestations.length) {
      setSelectedManifestations([])
    } else {
      setSelectedManifestations(filteredManifestations.map(m => m.id))
    }
  }

  const handleBulkDelete = () => {
    setManifestations(manifestations.filter(m => !selectedManifestations.includes(m.id)))
    setSelectedManifestations([])
    toast({
      title: "Succès",
      description: `${selectedManifestations.length} manifestation(s) supprimée(s)`
    })
  }

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "Programmée":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200"><Calendar className="w-3 h-3 mr-1" />{statut}</Badge>
      case "En cours":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><AlertTriangle className="w-3 h-3 mr-1" />{statut}</Badge>
      case "Terminée":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />{statut}</Badge>
      default:
        return <Badge variant="outline">{statut}</Badge>
    }
  }

  const getIndexationBadge = (indexation: string) => {
    switch (indexation) {
      case "Indexée":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />{indexation}</Badge>
      case "En cours":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><AlertTriangle className="w-3 h-3 mr-1" />{indexation}</Badge>
      case "Non indexée":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="w-3 h-3 mr-1" />{indexation}</Badge>
      default:
        return <Badge variant="outline">{indexation}</Badge>
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Manifestations Scientifiques</h1>
              <p className="text-gray-600">Gérez vos manifestations scientifiques et événements de recherche</p>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 flex gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Rechercher une manifestation..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrer par type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous les types</SelectItem>
                    {typesManifestation.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterStatut} onValueChange={setFilterStatut}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous les statuts</SelectItem>
                    <SelectItem value="Programmée">Programmée</SelectItem>
                    <SelectItem value="En cours">En cours</SelectItem>
                    <SelectItem value="Terminée">Terminée</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                {selectedManifestations.length > 0 && (
                  <Button variant="destructive" onClick={handleBulkDelete}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer ({selectedManifestations.length})
                  </Button>
                )}
                
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setEditingManifestation(null)
                      setFormData({
                        intitule: "",
                        type: "",
                        dateDebut: "",
                        dateFin: "",
                        organisateur: "",
                        lieu: "",
                        pays: "",
                        ville: "",
                        lien: "",
                        indexation: "",
                        resume: "",
                        programme: []
                      })
                    }}>
                      <Plus className="w-4 h-4 mr-2" />
                      Nouvelle manifestation
                    </Button>
                  </DialogTrigger>
                  
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingManifestation ? "Modifier la manifestation" : "Nouvelle manifestation scientifique"}
                      </DialogTitle>
                      <DialogDescription>
                        Remplissez tous les champs obligatoires (*) et assurez-vous que les dates sont cohérentes
                      </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="intitule" className="text-sm font-medium">
                            Intitulé <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="intitule"
                            value={formData.intitule}
                            onChange={(e) => setFormData({...formData, intitule: e.target.value})}
                            placeholder="Nom de la manifestation"
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="type" className="text-sm font-medium">
                            Type <span className="text-red-500">*</span>
                          </Label>
                          <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Sélectionner un type" />
                            </SelectTrigger>
                            <SelectContent>
                              {typesManifestation.map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="dateDebut" className="text-sm font-medium">
                            Date de début <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="dateDebut"
                            type="date"
                            value={formData.dateDebut}
                            onChange={(e) => setFormData({...formData, dateDebut: e.target.value})}
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="dateFin" className="text-sm font-medium">
                            Date de fin <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="dateFin"
                            type="date"
                            value={formData.dateFin}
                            onChange={(e) => setFormData({...formData, dateFin: e.target.value})}
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="organisateur" className="text-sm font-medium">
                            Organisateur <span className="text-red-500">*</span>
                          </Label>
                          <Select 
                            value={formData.organisateur} 
                            onValueChange={(value) => setFormData({...formData, organisateur: value, lieu: ""})}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Sélectionner un organisateur" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="UH2C">UH2C</SelectItem>
                              <SelectItem value="Autre">Autre</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="lieu" className="text-sm font-medium">
                            Lieu <span className="text-red-500">*</span>
                          </Label>
                          {formData.organisateur === "UH2C" ? (
                            <Select value={formData.lieu} onValueChange={(value) => setFormData({...formData, lieu: value})}>
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Sélectionner un établissement UH2C" />
                              </SelectTrigger>
                              <SelectContent>
                                {etabUh2c.map(etab => (
                                  <SelectItem key={etab} value={etab}>{etab}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input
                              id="lieu"
                              value={formData.lieu}
                              onChange={(e) => setFormData({...formData, lieu: e.target.value})}
                              placeholder="Lieu de la manifestation"
                              className="mt-1"
                            />
                          )}
                        </div>

                        <div>
                          <Label htmlFor="pays" className="text-sm font-medium">
                            Pays <span className="text-red-500">*</span>
                          </Label>
                          <Select 
                            value={formData.pays} 
                            onValueChange={(value) => setFormData({...formData, pays: value, ville: ""})}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Sélectionner un pays" />
                            </SelectTrigger>
                            <SelectContent>
                              {pays.map(paysItem => (
                                <SelectItem key={paysItem} value={paysItem}>{paysItem}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="ville" className="text-sm font-medium">
                            Ville <span className="text-red-500">*</span>
                          </Label>
                          <Select value={formData.ville} onValueChange={(value) => setFormData({...formData, ville: value})}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder={`Sélectionner une ville ${formData.pays ? `de ${formData.pays}` : ''}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {getVillesByPays(formData.pays).map((ville) => (
                                <SelectItem key={ville} value={ville}>{ville}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="md:col-span-2">
                          <Label htmlFor="lien" className="text-sm font-medium">
                            Lien / site web
                          </Label>
                          <Input
                            id="lien"
                            value={formData.lien}
                            onChange={(e) => setFormData({...formData, lien: e.target.value})}
                            placeholder="Lien vers la page ou l'appel à communication"
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="indexation" className="text-sm font-medium">
                            Indexation
                          </Label>
                          <Select value={formData.indexation} onValueChange={(value) => setFormData({...formData, indexation: value})}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Statut d'indexation" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="En cours">En cours</SelectItem>
                              <SelectItem value="Indexée">Indexée</SelectItem>
                              <SelectItem value="Non indexée">Non indexée</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="resume" className="text-sm font-medium">
                          Résumé / Objectifs
                        </Label>
                        <Textarea
                          id="resume"
                          value={formData.resume}
                          onChange={(e) => setFormData({...formData, resume: e.target.value})}
                          placeholder="Présentation de la manifestation"
                          className="mt-1"
                          rows={4}
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium">
                          Programme / pièces jointes
                        </Label>
                        <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 mb-2">
                            Glissez-déposez vos fichiers ici ou cliquez pour sélectionner des fichiers
                          </p>
                          <p className="text-xs text-gray-500">PDF, DOC, DOCX acceptés</p>
                          <Input
                            type="file"
                            multiple
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileUpload}
                            className="mt-2"
                          />
                        </div>
                        
                        {formData.programme.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {formData.programme.map((file, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                <div className="flex items-center">
                                  <FileText className="w-4 h-4 text-gray-500 mr-2" />
                                  <span className="text-sm">{file.name}</span>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFile(index)}
                                >
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Annuler
                        </Button>
                        <Button type="submit">
                          {editingManifestation ? "Modifier la manifestation" : "Ajouter la manifestation"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Manifestations List */}
            <div className="space-y-4">
              {filteredManifestations.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Calendar className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune manifestation trouvée</h3>
                    <p className="text-gray-500 text-center mb-4">
                      {searchTerm || filterType || filterStatut 
                        ? "Aucune manifestation ne correspond à vos critères de recherche."
                        : "Commencez par ajouter votre première manifestation scientifique."
                      }
                    </p>
                    {!searchTerm && !filterType && !filterStatut && (
                      <Button onClick={() => setIsDialogOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Ajouter une manifestation
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Table Header */}
                  <Card>
                    <CardContent className="p-0">
                      <div className="flex items-center justify-between p-4 border-b">
                        <div className="flex items-center">
                          <Checkbox
                            checked={selectedManifestations.length === filteredManifestations.length && filteredManifestations.length > 0}
                            onCheckedChange={handleSelectAll}
                          />
                          <span className="ml-2 text-sm font-medium text-gray-700">
                            {selectedManifestations.length > 0 
                              ? `${selectedManifestations.length} sélectionné(s)` 
                              : `${filteredManifestations.length} manifestation(s)`
                            }
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Manifestations */}
                  {filteredManifestations.map((manifestation) => (
                    <Card key={manifestation.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            <Checkbox
                              checked={selectedManifestations.includes(manifestation.id)}
                              onCheckedChange={() => handleSelectManifestation(manifestation.id)}
                            />
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                    {manifestation.intitule}
                                  </h3>
                                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                                    <div className="flex items-center">
                                      <Tag className="w-4 h-4 mr-1" />
                                      {manifestation.type}
                                    </div>
                                    <div className="flex items-center">
                                      <Calendar className="w-4 h-4 mr-1" />
                                      {new Date(manifestation.dateDebut).toLocaleDateString('fr-FR')} - {new Date(manifestation.dateFin).toLocaleDateString('fr-FR')}
                                    </div>
                                    <div className="flex items-center">
                                      <MapPin className="w-4 h-4 mr-1" />
                                      {manifestation.ville}, {manifestation.pays}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  {getStatutBadge(manifestation.statut)}
                                  {getIndexationBadge(manifestation.indexation)}
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <div className="flex items-center mb-2">
                                    <Building2 className="w-4 h-4 mr-2 text-gray-500" />
                                    <span className="font-medium">Organisateur:</span>
                                    <span className="ml-2">{manifestation.organisateur}</span>
                                  </div>
                                  <div className="flex items-center mb-2">
                                    <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                                    <span className="font-medium">Lieu:</span>
                                    <span className="ml-2">{manifestation.lieu}</span>
                                  </div>
                                  {manifestation.lien && (
                                    <div className="flex items-center">
                                      <ExternalLink className="w-4 h-4 mr-2 text-gray-500" />
                                      <a 
                                        href={manifestation.lien} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 underline"
                                      >
                                        Site web
                                      </a>
                                    </div>
                                  )}
                                </div>
                                
                                <div>
                                  {manifestation.resume && (
                                    <div>
                                      <span className="font-medium">Résumé:</span>
                                      <p className="text-gray-600 mt-1 line-clamp-3">{manifestation.resume}</p>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {manifestation.programme.length > 0 && (
                                <div className="mt-4">
                                  <span className="font-medium text-sm">Pièces jointes:</span>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    {manifestation.programme.map((file, index) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        <FileText className="w-3 h-3 mr-1" />
                                        {file.name}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 ml-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(manifestation)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(manifestation.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}