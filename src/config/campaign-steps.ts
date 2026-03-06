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
    narrativeBefore: 'Esta crónica será recordada como ',
    narrativeAfter: '.',
    placeholder: 'el nombre de tu gesta',
    optional: false,
  },
  {
    id: 'landName',
    field: 'landName',
    narrativeBefore: 'Nuestra historia nos transporta a los confines de ',
    narrativeAfter: '.',
    placeholder: 'un reino, un plano o una ciudad',
    optional: true,
  },
  {
    id: 'startingPoint',
    field: 'startingPoint',
    narrativeBefore: 'El destino aguarda a los héroes en ',
    narrativeAfter: ',',
    placeholder: 'el lugar donde todo empieza',
    optional: true,
  },
  {
    id: 'atmosphere',
    field: 'atmosphere',
    narrativeBefore: ' donde se respira una atmósfera ',
    narrativeAfter: '.',
    placeholder: 'describe el "vibe" del lugar',
    optional: true,
  },
  {
    id: 'rumors',
    field: 'rumors',
    narrativeBefore: 'Y entre las sombras, se rumorea que ',
    narrativeAfter: '.',
    placeholder: 'un secreto o peligro que acecha',
    optional: true,
  },
]
