import { PortalCarousel } from '@/app/components/portal/portal-carousel'
import { campaigns } from '@/app/data/mock-campaigns'

export default function Home() {
  return (
    <div className='relative flex h-full w-full flex-col items-center justify-center overflow-hidden'>
      <PortalCarousel campaigns={campaigns} />
    </div>
  )
}
