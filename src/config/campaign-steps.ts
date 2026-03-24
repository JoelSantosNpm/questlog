export interface CampaignStep {
  id: string
  field: string
  narrativeBefore: string
  narrativeAfter: string
  placeholder: string
  optional: boolean
}

export const CAMPAIGN_CREATION_STEPS: CampaignStep[] = [
  {
    id: 'name',
    field: 'name',
    narrativeBefore:
      'Toda gran leyenda tiene un inicio, y este es el de aquella que perdurará en los anales como la aventura de ',
    narrativeAfter: '.',
    placeholder: 'el nombre de tu gesta',
    optional: false,
  },
  {
    id: 'location',
    field: 'location', // Usamos el campo unificado del Schema
    narrativeBefore: 'Los héroes se reúnen en un lugar conocido como ',
    narrativeAfter: '.',
    placeholder: 'punto de partida (ej: la Ciudad de Neverwinter)',
    optional: true,
  },
]
