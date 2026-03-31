import { EncyclopediaContainer } from '@/views/encyclopedia/ui/EncyclopediaContainer'
import { EncyclopediaStoreInitializer } from '@/views/encyclopedia/ui/EncyclopediaStoreInitializer'
import { SideTabs } from '@/views/encyclopedia/ui/SideTabs'
import {
  getBestiaryItems,
  getCharacterTemplates,
  getMuseumItems,
} from '@/views/encyclopedia/api/encyclopedia-queries'

export const dynamic = 'force-dynamic'

export default async function EncyclopediaPage() {
  const [bestiary, characters, museum] = await Promise.all([
    getBestiaryItems(),
    getCharacterTemplates(),
    getMuseumItems(),
  ])

  const allData = {
    bestiary,
    cast: characters,
    museum,
  }

  return (
    <div className='flex h-[calc(100vh-64px)] w-full overflow-hidden bg-neutral-950 font-sans'>
      <EncyclopediaStoreInitializer data={allData} />
      <SideTabs />
      <EncyclopediaContainer />
    </div>
  )
}
