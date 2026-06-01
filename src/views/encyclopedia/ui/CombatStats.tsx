'use client'

import { useTranslations } from 'next-intl'
import { MAIN_STATS, SMALL_STATS, signed } from '../config/stats'
import { BestiaryItem, CastItem } from '../model/types'
import { StatBox } from './StatBox'

interface CombatStatsProps {
  item: BestiaryItem | CastItem
}

function formatCR(challenge: number): string {
  if (challenge === 0.125) return '1/8'
  if (challenge === 0.25) return '1/4'
  if (challenge === 0.5) return '1/2'
  return String(challenge)
}

export const CombatStats = ({ item }: CombatStatsProps) => {
  const t = useTranslations('Encyclopedia.combatStats')
  const monster = item.section === 'bestiary' ? (item as BestiaryItem) : null
  const character = item.section === 'cast' ? (item as CastItem) : null
  const abilities = monster?.abilities ?? character?.abilities
  const abilitiesList = Array.isArray(abilities)
    ? (abilities as Array<{ name?: string; description?: string }>)
    : null

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='mb-3 section-label'>{t('statsHeading')}</h3>
        <div className='flex justify-around'>
          {MAIN_STATS.map(({ label, title, key }) => (
            <StatBox key={key} label={label} title={title} value={signed(item[key] as number)} />
          ))}
          <StatBox
            label={t('properties.hitPointsAbbr')}
            title={t('properties.hitPoints')}
            value={signed(item.maxHp)}
          />
        </div>
      </div>

      <div className=' space-y-1'>
        {SMALL_STATS.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className='flex justify-center gap-2 sm:gap-5'>
            {row.map(({ label, title, key }) => (
              <StatBox
                key={key}
                size='sm'
                label={label}
                title={title}
                value={signed(item[key] as number)}
              />
            ))}
          </div>
        ))}
      </div>

      <div className='grid grid-cols-2 gap-3'>
        {monster && (
          <>
            <div className='info-tile'>
              <span className='text-[10px] font-bold uppercase text-neutral-500'>
                {t('properties.type')}
              </span>
              <p className='mt-1 font-medium capitalize text-neutral-200'>{monster.type}</p>
            </div>
            <div className='rounded-lg border border-amber-800/30 bg-amber-950/20 p-3'>
              <span className='text-[10px] font-bold uppercase text-amber-600/70'>
                {t('properties.challenge')}
              </span>
              <p className='mt-1 font-mono font-bold text-amber-400'>
                {t('properties.challengeValue', { value: formatCR(monster.challenge) })}
              </p>
            </div>
          </>
        )}
        <div className='info-tile'>
          <span className='text-[10px] font-bold uppercase text-neutral-500'>
            {t('properties.race')}
          </span>
          <p className='mt-1 font-medium capitalize text-neutral-200'>{item.race}</p>
        </div>
        <div className='info-tile'>
          <span className='text-[10px] font-bold uppercase text-neutral-500'>
            {t('properties.class')}
          </span>
          <p className='mt-1 font-medium capitalize text-neutral-200'>{item.characterClass}</p>
        </div>
      </div>

      {abilitiesList && abilitiesList.length > 0 && (
        <div>
          <h3 className='mb-3 section-label'>{t('abilitiesHeading')}</h3>
          <div className='space-y-2'>
            {abilitiesList.map((ability, i) => (
              <div key={ability.name || `ability-${i}`} className='info-tile'>
                {ability.name && (
                  <p className='text-xs font-bold text-amber-400/80'>{ability.name}</p>
                )}
                {ability.description && (
                  <p className='mt-1 text-xs leading-relaxed text-neutral-400'>
                    {ability.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
