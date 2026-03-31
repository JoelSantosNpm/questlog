import { EncyclopediaContainer } from '@/components/encyclopedia/EncyclopediaContainer'
import { EncyclopediaStoreInitializer } from '@/components/encyclopedia/EncyclopediaStoreInitializer'
import { SideTabs } from '@/components/encyclopedia/SideTabs'
import {
  getBestiaryItems,
  getCharacterTemplates,
  getMuseumItems,
} from '@/data/encyclopedia-queries'

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
