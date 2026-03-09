import { PortalCarousel } from '@/components/portal/portal-carousel'
import { getUserCampaigns } from '@/data/campaign-queries'
import { Campaign as PortalCampaign } from '@/types/portal'

export default async function Home() {
  const dbCampaigns = await getUserCampaigns()

  const allCampaigns: PortalCampaign[] = [
    ...dbCampaigns,
    {
      id: 'new-campaign',
      name: 'Nueva Campaña',
      variant: 'new',
    },
  ]

  return (
    <div className='relative flex h-full w-full flex-col items-center justify-center overflow-hidden'>
      <PortalCarousel campaigns={allCampaigns} />
    </div>
  )
}
