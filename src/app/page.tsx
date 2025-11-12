"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Camera, Upload, Bug, Leaf, AlertTriangle, CheckCircle, Info } from 'lucide-react'

// Base de dados de pragas comuns
const pragasDatabase = [
  {
    id: 1,
    nome: "Lagarta-do-Cartucho",
    nomecientifico: "Spodoptera frugiperda",
    cultura: ["Milho", "Sorgo", "Arroz"],
    sintomas: ["Furos nas folhas", "Raspagem do limbo foliar", "Presença de fezes escuras"],
    caracteristicas: ["Lagarta verde-acinzentada", "Listras longitudinais", "Cabeça marrom"],
    danos: "Pode causar perdas de até 60% na produção se não controlada",
    controle: {
      biologico: "Trichogramma pretiosum, Telenomus remus",
      quimico: "Inseticidas à base de Clorantraniliprole",
      cultural: "Rotação de culturas, eliminação de plantas daninhas"
    },
    prevencao: "Monitoramento semanal, uso de feromônios para captura de adultos",
    severidade: "Alta"
  },
  {
    id: 2,
    nome: "Pulgão-Verde",
    nomecientifico: "Myzus persicae",
    cultura: ["Soja", "Feijão", "Tomate", "Pimentão"],
    sintomas: ["Folhas amareladas", "Enrolamento das folhas", "Melada pegajosa"],
    caracteristicas: ["Insetos pequenos verdes", "Colônias na parte inferior das folhas", "Reprodução rápida"],
    danos: "Transmite viroses e enfraquece a planta",
    controle: {
      biologico: "Joaninhas, crisopídeos, fungos entomopatogênicos",
      quimico: "Inseticidas sistêmicos (Imidacloprido)",
      cultural: "Eliminação de hospedeiros alternativos"
    },
    prevencao: "Inspeção regular das plantas, controle de formigas",
    severidade: "Média"
  },
  {
    id: 3,
    nome: "Broca-do-Colmo",
    nomecientifico: "Diatraea saccharalis",
    cultura: ["Cana-de-açúcar", "Milho"],
    sintomas: ["Furos no colmo", "Quebra do colmo", "Presença de serragem"],
    caracteristicas: ["Lagarta branca-amarelada", "Cabeça marrom", "Galerias no interior do colmo"],
    danos: "Redução significativa na produção e qualidade",
    controle: {
      biologico: "Cotesia flavipes, Trichogramma galloi",
      quimico: "Inseticidas granulados no sulco de plantio",
      cultural: "Destruição de restos culturais"
    },
    prevencao: "Plantio de variedades resistentes, controle biológico preventivo",
    severidade: "Alta"
  },
  {
    id: 4,
    nome: "Ácaro-Rajado",
    nomecientifico: "Tetranychus urticae",
    cultura: ["Algodão", "Soja", "Feijão", "Tomate"],
    sintomas: ["Pontos amarelados nas folhas", "Teia fina", "Folhas bronzeadas"],
    caracteristicas: ["Ácaros muito pequenos", "Coloração esverdeada com manchas", "Teias características"],
    danos: "Desfolha prematura e redução da fotossíntese",
    controle: {
      biologico: "Ácaros predadores (Phytoseiulus macropilis)",
      quimico: "Acaricidas específicos",
      cultural: "Irrigação adequada, evitar estresse hídrico"
    },
    prevencao: "Monitoramento com lupa, manutenção da umidade",
    severidade: "Média"
  },
  {
    id: 5,
    nome: "Mosca-Branca",
    nomecientifico: "Bemisia tabaci",
    cultura: ["Tomate", "Soja", "Algodão", "Feijão"],
    sintomas: ["Amarelecimento das folhas", "Melada", "Fumagina"],
    caracteristicas: ["Insetos pequenos brancos", "Voam quando perturbados", "Ovos na parte inferior das folhas"],
    danos: "Transmissão de viroses, enfraquecimento da planta",
    controle: {
      biologico: "Encarsia formosa, Eretmocerus mundus",
      quimico: "Inseticidas sistêmicos e de contato",
      cultural: "Barreiras físicas, plantas armadilhas"
    },
    prevencao: "Armadilhas amarelas, eliminação de plantas daninhas",
    severidade: "Alta"
  }
]

export default function PragaIdentificador() {
  const [activeTab, setActiveTab] = useState("identificar")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [cultura, setCultura] = useState("")
  const [sintomas, setSintomas] = useState<string[]>([])
  const [resultados, setResultados] = useState<typeof pragasDatabase>([])
  const [showResults, setShowResults] = useState(false)

  const culturas = ["Milho", "Soja", "Feijão", "Tomate", "Algodão", "Cana-de-açúcar", "Arroz", "Sorgo", "Pimentão"]
  const sintomasDisponiveis = [
    "Furos nas folhas",
    "Folhas amareladas", 
    "Enrolamento das folhas",
    "Presença de fezes escuras",
    "Melada pegajosa",
    "Pontos amarelados",
    "Teia fina",
    "Quebra do colmo",
    "Presença de serragem",
    "Folhas bronzeadas"
  ]

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const toggleSintoma = (sintoma: string) => {
    setSintomas(prev => 
      prev.includes(sintoma) 
        ? prev.filter(s => s !== sintoma)
        : [...prev, sintoma]
    )
  }

  const identificarPraga = () => {
    let matches = pragasDatabase

    // Filtrar por cultura se selecionada
    if (cultura) {
      matches = matches.filter(praga => 
        praga.cultura.includes(cultura)
      )
    }

    // Filtrar por sintomas se selecionados
    if (sintomas.length > 0) {
      matches = matches.filter(praga => 
        sintomas.some(sintoma => 
          praga.sintomas.some(s => s.includes(sintoma))
        )
      )
    }

    // Ordenar por relevância (número de sintomas coincidentes)
    matches.sort((a, b) => {
      const scoreA = sintomas.filter(sintoma => 
        a.sintomas.some(s => s.includes(sintoma))
      ).length
      const scoreB = sintomas.filter(sintoma => 
        b.sintomas.some(s => s.includes(sintoma))
      ).length
      return scoreB - scoreA
    })

    setResultados(matches)
    setShowResults(true)
  }

  const getSeveridadeColor = (severidade: string) => {
    switch (severidade) {
      case "Alta": return "bg-red-500"
      case "Média": return "bg-yellow-500"
      case "Baixa": return "bg-green-500"
      default: return "bg-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-green-600 rounded-full">
              <Bug className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-green-800">AgroDefender</h1>
          </div>
          <p className="text-lg text-green-700">
            Identifique pragas na sua lavoura e receba orientações de controle
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="identificar" className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Identificar
            </TabsTrigger>
            <TabsTrigger value="pragas" className="flex items-center gap-2">
              <Bug className="w-4 h-4" />
              Base de Pragas
            </TabsTrigger>
            <TabsTrigger value="prevencao" className="flex items-center gap-2">
              <Leaf className="w-4 h-4" />
              Prevenção
            </TabsTrigger>
          </TabsList>

          {/* Tab Identificar */}
          <TabsContent value="identificar">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Identificação de Pragas
                </CardTitle>
                <CardDescription>
                  Faça upload de uma foto ou selecione características observadas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Upload de Imagem */}
                <div className="space-y-4">
                  <Label htmlFor="image-upload" className="text-base font-medium">
                    Foto da Praga ou Dano (Opcional)
                  </Label>
                  <div className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      {selectedImage ? (
                        <img 
                          src={selectedImage} 
                          alt="Imagem selecionada" 
                          className="max-w-full h-48 mx-auto object-cover rounded-lg"
                        />
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-12 h-12 mx-auto text-green-500" />
                          <p className="text-green-600">Clique para fazer upload da imagem</p>
                          <p className="text-sm text-gray-500">PNG, JPG até 10MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Seleção de Cultura */}
                <div className="space-y-2">
                  <Label className="text-base font-medium">Cultura Afetada</Label>
                  <Select value={cultura} onValueChange={setCultura}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a cultura" />
                    </SelectTrigger>
                    <SelectContent>
                      {culturas.map(cult => (
                        <SelectItem key={cult} value={cult}>{cult}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Seleção de Sintomas */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Sintomas Observados</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {sintomasDisponiveis.map(sintoma => (
                      <Button
                        key={sintoma}
                        variant={sintomas.includes(sintoma) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleSintoma(sintoma)}
                        className="justify-start h-auto p-3 text-left"
                      >
                        <CheckCircle className={`w-4 h-4 mr-2 ${sintomas.includes(sintoma) ? 'text-white' : 'text-gray-400'}`} />
                        {sintoma}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Botão Identificar */}
                <Button 
                  onClick={identificarPraga}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
                  size="lg"
                >
                  <Bug className="w-5 h-5 mr-2" />
                  Identificar Praga
                </Button>

                {/* Resultados */}
                {showResults && (
                  <div className="space-y-4 mt-6">
                    <h3 className="text-xl font-semibold text-green-800">
                      Possíveis Pragas Identificadas ({resultados.length})
                    </h3>
                    
                    {resultados.length === 0 ? (
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          Nenhuma praga encontrada com os critérios selecionados. 
                          Tente ajustar a cultura ou sintomas.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <div className="grid gap-4">
                        {resultados.map(praga => (
                          <Card key={praga.id} className="border-l-4 border-l-green-500">
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                <div>
                                  <CardTitle className="text-lg">{praga.nome}</CardTitle>
                                  <CardDescription className="italic">
                                    {praga.nomecientifico}
                                  </CardDescription>
                                </div>
                                <Badge className={`${getSeveridadeColor(praga.severidade)} text-white`}>
                                  {praga.severidade}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div>
                                <h4 className="font-medium text-green-800 mb-2">Culturas Afetadas:</h4>
                                <div className="flex flex-wrap gap-1">
                                  {praga.cultura.map(cult => (
                                    <Badge key={cult} variant="outline">{cult}</Badge>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-medium text-green-800 mb-2">Danos:</h4>
                                <p className="text-sm text-gray-700">{praga.danos}</p>
                              </div>

                              <div>
                                <h4 className="font-medium text-green-800 mb-2">Controle Recomendado:</h4>
                                <div className="space-y-2 text-sm">
                                  <div>
                                    <span className="font-medium text-blue-700">Biológico:</span> {praga.controle.biologico}
                                  </div>
                                  <div>
                                    <span className="font-medium text-red-700">Químico:</span> {praga.controle.quimico}
                                  </div>
                                  <div>
                                    <span className="font-medium text-green-700">Cultural:</span> {praga.controle.cultural}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Base de Pragas */}
          <TabsContent value="pragas">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bug className="w-5 h-5" />
                    Base de Conhecimento - Pragas Comuns
                  </CardTitle>
                  <CardDescription>
                    Informações detalhadas sobre as principais pragas agrícolas
                  </CardDescription>
                </CardHeader>
              </Card>

              {pragasDatabase.map(praga => (
                <Card key={praga.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{praga.nome}</CardTitle>
                        <CardDescription className="italic text-base">
                          {praga.nomecientifico}
                        </CardDescription>
                      </div>
                      <Badge className={`${getSeveridadeColor(praga.severidade)} text-white`}>
                        {praga.severidade}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-green-800 mb-2">Culturas Afetadas:</h4>
                        <div className="flex flex-wrap gap-1">
                          {praga.cultura.map(cult => (
                            <Badge key={cult} variant="outline">{cult}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-green-800 mb-2">Características:</h4>
                        <ul className="text-sm space-y-1">
                          {praga.caracteristicas.map((carac, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="w-1 h-1 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                              {carac}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-green-800 mb-2">Sintomas:</h4>
                      <ul className="text-sm space-y-1">
                        {praga.sintomas.map((sintoma, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                            {sintoma}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Alert className="border-orange-200 bg-orange-50">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <AlertDescription className="text-orange-800">
                        <strong>Danos:</strong> {praga.danos}
                      </AlertDescription>
                    </Alert>

                    <div>
                      <h4 className="font-medium text-green-800 mb-3">Estratégias de Controle:</h4>
                      <div className="grid gap-3">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <h5 className="font-medium text-blue-800 mb-1">Controle Biológico</h5>
                          <p className="text-sm text-blue-700">{praga.controle.biologico}</p>
                        </div>
                        <div className="p-3 bg-red-50 rounded-lg">
                          <h5 className="font-medium text-red-800 mb-1">Controle Químico</h5>
                          <p className="text-sm text-red-700">{praga.controle.quimico}</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <h5 className="font-medium text-green-800 mb-1">Controle Cultural</h5>
                          <p className="text-sm text-green-700">{praga.controle.cultural}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-emerald-50 rounded-lg">
                      <h5 className="font-medium text-emerald-800 mb-1 flex items-center gap-2">
                        <Leaf className="w-4 h-4" />
                        Prevenção
                      </h5>
                      <p className="text-sm text-emerald-700">{praga.prevencao}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tab Prevenção */}
          <TabsContent value="prevencao">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="w-5 h-5" />
                    Prevenção e Manejo Integrado
                  </CardTitle>
                  <CardDescription>
                    Práticas preventivas para reduzir a incidência de pragas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="border-green-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-green-800">Monitoramento</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            Inspeção semanal das culturas
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            Uso de armadilhas com feromônios
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            Registro de ocorrências
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            Monitoramento climático
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="border-blue-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-blue-800">Controle Cultural</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            Rotação de culturas
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            Eliminação de restos culturais
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            Controle de plantas daninhas
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            Época adequada de plantio
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="border-purple-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-purple-800">Controle Biológico</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                            Preservação de inimigos naturais
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                            Liberação de parasitoides
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                            Uso de fungos entomopatogênicos
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                            Plantas refugio para predadores
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="border-orange-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-orange-800">Boas Práticas</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            Uso racional de defensivos
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            Alternância de princípios ativos
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            Calibração de equipamentos
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            Respeito ao período de carência
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  <Alert className="border-emerald-200 bg-emerald-50">
                    <Leaf className="h-4 w-4 text-emerald-600" />
                    <AlertDescription className="text-emerald-800">
                      <strong>Dica Importante:</strong> O manejo integrado de pragas (MIP) combina 
                      diferentes estratégias de controle, priorizando métodos sustentáveis e 
                      reduzindo a dependência de defensivos químicos.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}