import { Shield, Heart, Activity } from 'lucide-react'
import { BestiaryItem, CastItem } from '../model/types'
import { StatBox } from './StatBox'

interface CombatStatsProps {
  item: BestiaryItem | CastItem
}

export const CombatStats = ({ item }: CombatStatsProps) => (
  <div className='space-y-4'>
    <h3 className='text-xs font-bold uppercase tracking-widest text-neutral-500'>Atributos</h3>
    <div className='flex justify-around'>
      <StatBox label='CA' value={item.ac} icon={<Shield className='h-3 w-3' />} />
      <StatBox
        label='PG'
        value={'maxHp' in item ? item.maxHp : '—'}
        icon={<Heart className='h-3 w-3' />}
      />
      <StatBox label='VEL' value={item.speed} icon={<Activity className='h-3 w-3' />} />
    </div>
    <div className='flex flex-wrap justify-center gap-1'>
      <StatBox size='sm' label='FUE' value={item.strength} />
      <StatBox size='sm' label='DES' value={item.dexterity} />
      <StatBox size='sm' label='CON' value={item.constitution} />
      <StatBox size='sm' label='INT' value={item.intelligence} />
      <StatBox size='sm' label='SAB' value={item.wisdom} />
      <StatBox size='sm' label='CAR' value={item.charisma} />
    </div>
  </div>
)
