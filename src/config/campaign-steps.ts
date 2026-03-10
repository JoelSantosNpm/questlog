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
      'Todo comienza con un nombre que perdurará entre las leyendas. La aventura de ',
    narrativeAfter: '.',
    placeholder: 'el nombre de tu gesta',
    optional: false,
  },
  {
    id: 'startingPoint',
    field: 'startingPoint',
    narrativeBefore: 'Los héroes se reúnen en un lugar conocido como ',
    narrativeAfter: ',',
    placeholder: 'punto de partida',
    optional: true,
  },
  {
    id: 'landName',
    field: 'landName',
    narrativeBefore: 'ubicada en las lejanas tierras de ',
    narrativeAfter: '.',
    placeholder: 'un reino, una ciudad...',
    optional: true,
  },
  {
    id: 'atmosphere',
    field: 'atmosphere',
    narrativeBefore:
      'Incluso allí el aire que respiran tiene un sabor único, como si el viento susurrara historias de antaño. La atmósfera es ',
    narrativeAfter: '.',
    placeholder: 'describe el "vibe" del lugar',
    optional: true,
  },
  {
    id: 'rumors',
    field: 'rumors',
    narrativeBefore: 'Y no es de extrañar, pues se oyen rumores de que ',
    narrativeAfter: '.',
    placeholder: 'un secreto o peligro que acecha',
    optional: true,
  },
]
