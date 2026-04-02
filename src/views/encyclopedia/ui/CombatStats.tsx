import { Shield, Heart, Activity } from 'lucide-react'
import { BestiaryItem, CastItem } from '../model/types'
import { StatBox } from './StatBox'

interface CombatStatsProps {
  item: BestiaryItem | CastItem
}

export const CombatStats = ({ item }: CombatStatsProps) => (
  <div className='space-y-4'>
    <h3 className='text-xs font-bold uppercase tracking-widest text-neutral-500'>Atributos</h3>
    <div className='grid grid-cols-3 gap-3'>
      <StatBox label='CA' value={item.ac} icon={<Shield className='h-3 w-3' />} />
      <StatBox
        label='PG'
        value={'maxHp' in item ? item.maxHp : 'Instancia'}
        icon={<Heart className='h-3 w-3' />}
      />
      <StatBox label='VEL' value={`${item.speed} pies`} icon={<Activity className='h-3 w-3' />} />
    </div>
    <div className='grid grid-cols-6 gap-2'>
      <StatBox label='FUE' value={item.strength} />
      <StatBox label='DES' value={item.dexterity} />
      <StatBox label='CON' value={item.constitution} />
      <StatBox label='INT' value={item.intelligence} />
      <StatBox label='SAB' value={item.wisdom} />
      <StatBox label='CAR' value={item.charisma} />
    </div>
  </div>
)
