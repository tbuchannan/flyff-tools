'use client'
import { ItemInput } from '@/components/item-input'
import Image from 'next/image'
import { FormEvent, useReducer } from 'react'

import { UpgradeRates } from '../components'
import {
  LOW_SPRO_RATES_ARR,
  LOW_SPRO_RATES_FWC_ARR,
  MAX_PRICE,
  MAX_SIMULATIONS,
  SPRO_RATES,
  SPRO_RATES_FWC,
  UPGRADE_COSTS,
} from '../constants'
import { initialState, upgradeReducer } from './reducer'
import { MaterialType, GearType, UpgradeLevelMap, UpgradeLevelType } from './types'

const MINERALS_REQUIRED: UpgradeLevelMap<number> = {
  0: 10,
  1: 14,
  2: 20,
  3: 27,
  4: 38,
  5: 54,
  6: 75,
  7: 105,
  8: 148,
  9: 207,
}

export default function Upgrades() {
  const [state, dispatch] = useReducer(upgradeReducer, initialState)

  const rates = state.isFWC
    ? state.lowSpro
      ? LOW_SPRO_RATES_FWC_ARR
      : SPRO_RATES_FWC
    : state.lowSpro
    ? LOW_SPRO_RATES_ARR
    : SPRO_RATES

  const handlePriceChange = (e: FormEvent<HTMLInputElement>, material: MaterialType) => {
    let flooredNum = Math.floor(Number(e.currentTarget.value)) ?? 0

    if (flooredNum < MAX_PRICE) {
      switch (material) {
        case MaterialType.Eron:
          dispatch({ type: 'SET_ERON_PRICE', value: flooredNum })
          break
        case MaterialType.Mineral:
          dispatch({ type: 'SET_MINERAL_PRICE', value: flooredNum })
          break
      }
    }
  }

  const changeUpgrade = (gear: GearType, mod: number) => {
    let newUpgrade
    switch (gear) {
      case GearType.Helmet:
        newUpgrade = state.helmetUpgrade + mod
        if (newUpgrade >= 0 && newUpgrade <= 10)
          dispatch({ type: 'SET_HELMET_UPGRADE', value: newUpgrade })
        break
      case GearType.Chest:
        newUpgrade = state.chestUpgrade + mod
        if (newUpgrade >= 0 && newUpgrade <= 10)
          dispatch({ type: 'SET_CHEST_UPGRADE', value: newUpgrade })
        break
      case GearType.Gloves:
        newUpgrade = state.glovesUpgrade + mod
        if (newUpgrade >= 0 && newUpgrade <= 10)
          dispatch({ type: 'SET_GLOVES_UPGRADE', value: newUpgrade })
        break
      case GearType.Boots:
        newUpgrade = state.bootsUpgrade + mod
        if (newUpgrade >= 0 && newUpgrade <= 10)
          dispatch({ type: 'SET_BOOTS_UPGRADE', value: newUpgrade })
        break
      default:
        break
    }
  }

  const simulate = (start: UpgradeLevelType, end: UpgradeLevelType, item: GearType) => {
    if (start >= end) return

    let mineralCosts = []
    let eronCosts = []
    let totalTries = []
    let upgradeCosts = []

    let current: UpgradeLevelType

    for (let i = 0; i < MAX_SIMULATIONS; i++) {
      current = start
      let tempEronTotal = 0
      let tempMineralTotal = 0
      let numberOfAttempts = 1
      let upgradeCostTotal = 0

      let tryTotal = 0
      let tempRates = [...rates]

      while (current < end) {
        let num = Math.random()
        tryTotal++
        tempEronTotal += MINERALS_REQUIRED[current]
        tempMineralTotal += MINERALS_REQUIRED[current]
        upgradeCostTotal += UPGRADE_COSTS[current]
        if (num <= tempRates[current]) {
          current++
        } else if (state.lowSpro) {
          current += current > 0 ? -1 : 0
        } else {
          numberOfAttempts++
          tempRates[current] = rates[current] * numberOfAttempts
        }
      }
      totalTries.push(tryTotal)
      mineralCosts.push(tempMineralTotal)
      eronCosts.push(tempEronTotal)
      upgradeCosts.push(upgradeCostTotal)
    }

    let triesSum = totalTries.reduce((acc, curr) => acc + curr, 0)
    let mineralSum = mineralCosts.reduce((acc, curr) => acc + curr, 0)
    let eronSum = eronCosts.reduce((acc, curr) => acc + curr, 0)
    let upgradeSum = upgradeCosts.reduce((acc, curr) => acc + curr, 0)

    dispatch({
      type: 'SET_TOTAL_ERONS',
      value: Math.floor(eronSum / eronCosts.length),
    })
    dispatch({
      type: 'SET_TOTAL_MINERALS',
      value: Math.floor(mineralSum / mineralCosts.length),
    })
    dispatch({
      type: 'SET_TOTAL_TRIES',
      value: Math.floor(triesSum / totalTries.length),
    })
    dispatch({
      type: 'SET_RAW_PENYA',
      value: Math.floor(upgradeSum / upgradeCosts.length),
    })
  }

  const reset = () => dispatch({ type: 'RESET_TOTALS' })

  const calculate = () => {
    reset()
    simulate(
      state.helmetUpgrade as UpgradeLevelType,
      state.helmetGoal as UpgradeLevelType,
      GearType.Helmet,
    )
    simulate(
      state.chestUpgrade as UpgradeLevelType,
      state.chestGoal as UpgradeLevelType,
      GearType.Chest,
    )
    simulate(
      state.glovesUpgrade as UpgradeLevelType,
      state.glovesGoal as UpgradeLevelType,
      GearType.Gloves,
    )
    simulate(
      state.bootsUpgrade as UpgradeLevelType,
      state.bootsGoal as UpgradeLevelType,
      GearType.Boots,
    )
  }

  return (
    <div className='flex flex-col gap-1 p-8 w-[50rem] h-[50rem] m-auto'>
      <div className='flex gap-4 justify-center'>
        <div className='flex justify-items-stretch gap-4'>
          <div>Mineral Price:</div>
          <input
            className='border-0 focus:border-transparent text-black w-24'
            onChange={(e) => handlePriceChange(e, MaterialType.Mineral)}
            type='number'
            value={state.mineralPrice}
          />
        </div>
        <div className='flex justify-items-stretch gap-4'>
          <div>Erons Price: </div>
          <div>
            <input
              className='border-0 focus:border-transparent text-black w-24'
              onChange={(e) => handlePriceChange(e, MaterialType.Eron)}
              type='number'
              value={state.eronPrice}
            />
          </div>
        </div>
        <div className='flex justify-items-stretch gap-4'>
          <div>FWC?:</div>
          <input
            checked={state.isFWC}
            className='border-0 focus:border-transparent text-black'
            onChange={() => dispatch({ type: 'SET_IS_FWC', value: !state.isFWC })}
            type='checkbox'
          />
        </div>
        <div className='flex justify-items-stretch gap-4'>
          <div>Low Spros?:</div>
          <input
            checked={state.lowSpro}
            className='border-0 focus:border-transparent text-black '
            onChange={() => dispatch({ type: 'SET_LOW_SPRO', value: !state.lowSpro })}
            type='checkbox'
          />
        </div>
      </div>

      <div className='flex gap-24 my-16 justify-center'>
        <div className='select-none'>
          <Image
            alt='helmet'
            className='ml-4 cursor-pointer'
            src='/rm-helm.png'
            width={32}
            height={32}
            onClick={() => changeUpgrade(GearType.Helmet, 1)}
            onContextMenu={(e) => {
              e.preventDefault()
              return changeUpgrade(GearType.Helmet, -1)
            }}
          />
          <div className='flex gap-4'>
            <span>Start:</span>
            <ItemInput
              value={state.helmetUpgrade}
              onChange={(num) => dispatch({ type: 'SET_HELMET_UPGRADE', value: num })}
            />
          </div>
          <div className='flex justify-between'>
            <span>Goal:</span>
            <ItemInput
              value={state.helmetGoal}
              onChange={(num) => dispatch({ type: 'SET_HELMET_GOAL', value: num })}
            />
          </div>
        </div>

        <div className='select-none'>
          <Image
            alt='chest'
            className='ml-4 cursor-pointer'
            onClick={() => changeUpgrade(GearType.Chest, 1)}
            onContextMenu={(e) => {
              e.preventDefault()
              return changeUpgrade(GearType.Chest, -1)
            }}
            src='/rm-chest.png'
            width={32}
            height={32}
          />
          <div className='flex justify-between'>
            <span>Start:</span>
            <ItemInput
              value={state.chestUpgrade}
              onChange={(num) => dispatch({ type: 'SET_CHEST_UPGRADE', value: num })}
            />
          </div>

          <div className='flex justify-between'>
            <span>Goal:</span>
            <ItemInput
              value={state.chestGoal}
              onChange={(num) => dispatch({ type: 'SET_CHEST_GOAL', value: num })}
            />
          </div>
        </div>
        <div className='select-none'>
          <Image
            alt='gloves'
            className='ml-4 cursor-pointer'
            onClick={() => changeUpgrade(GearType.Gloves, 1)}
            onContextMenu={(e) => {
              e.preventDefault()
              return changeUpgrade(GearType.Gloves, -1)
            }}
            src='/rm-hands.png'
            width={32}
            height={32}
          />
          <div className='flex justify-between'>
            <span>Start:</span>
            <ItemInput
              value={state.glovesUpgrade}
              onChange={(num) => dispatch({ type: 'SET_GLOVES_UPGRADE', value: num })}
            />
          </div>
          <div className='flex justify-between'>
            <span>Goal:</span>
            <ItemInput
              value={state.glovesGoal}
              onChange={(num) => dispatch({ type: 'SET_GLOVES_GOAL', value: num })}
            />
          </div>
        </div>

        <div className='select-none'>
          <Image
            alt='boots'
            className='ml-4 cursor-pointer'
            src='/rm-boots.png'
            onClick={() => changeUpgrade(GearType.Boots, 1)}
            onContextMenu={(e) => {
              e.preventDefault()
              return changeUpgrade(GearType.Boots, -1)
            }}
            width={32}
            height={32}
          />
          <div className='flex justify-between'>
            <span>Start:</span>
            <ItemInput
              value={state.bootsUpgrade}
              onChange={(num) => dispatch({ type: 'SET_BOOTS_UPGRADE', value: num })}
            />
          </div>
          <div className='flex justify-between'>
            <span>Goal:</span>
            <ItemInput
              value={state.bootsGoal}
              onChange={(num) => dispatch({ type: 'SET_BOOTS_GOAL', value: num })}
            />
          </div>
        </div>
      </div>
      <div>
        <button className='border p-2 rounded-lg mr-2' onClick={calculate}>
          Calculate
        </button>
        <button className='border p-2 rounded-lg' onClick={reset}>
          reset
        </button>
        <div className='flex flex-col'>
          <span>
            Total Minerals:{' '}
            {new Intl.NumberFormat('en-US', {
              style: 'decimal',
            }).format(state.totalMinerals)}
          </span>
          <span>
            Total Erons:{' '}
            {new Intl.NumberFormat('en-US', {
              style: 'decimal',
            }).format(state.totalErons)}
          </span>
          <span>
            Mats + Upgrade Cost:{' '}
            {new Intl.NumberFormat('en-US', {
              style: 'decimal',
            }).format(
              state.totalErons * state.eronPrice +
                state.totalMinerals * state.mineralPrice +
                state.rawPenya,
            )}
          </span>
          <span>
            Upgrade Costs:{' '}
            {new Intl.NumberFormat('en-US', {
              style: 'decimal',
            }).format(
              state.totalErons * state.eronPrice +
                state.totalMinerals * state.mineralPrice +
                state.rawPenya,
            )}
          </span>
          <span>
            Total Tries:{' '}
            {new Intl.NumberFormat('en-US', {
              style: 'decimal',
            }).format(state.totalTries)}
          </span>
        </div>
      </div>
      <UpgradeRates rates={rates} />
    </div>
  )
}
