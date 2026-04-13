import {
  EncyclopediaContainer,
  EncyclopediaStoreInitializer,
  SideTabs,
  getBestiaryItems,
  getCharacterTemplates,
  getMuseumItems,
} from '@/views/encyclopedia'

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
    <div className='relative flex w-full font-sans'>
      <div className='absolute inset-0 bg-black/60' />
      <div className='relative flex w-full'>
        <EncyclopediaStoreInitializer data={allData} />
        <SideTabs />
        <EncyclopediaContainer />
      </div>
    </div>
  )
}
