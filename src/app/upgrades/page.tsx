'use client'
import { ItemInput } from '@/components/item-input'
import Image from 'next/image'
import { FormEvent, useReducer } from 'react'
import { initialState, upgradeReducer } from './reducer'

const MAX_PRICE = 1000000

enum MaterialType {
  Eron,
  Mineral,
}

enum GearType {
  Helmet,
  Chest,
  Gloves,
  Boots,
}

const OLD_RATES = {
  '0': 90,
  '1': 85,
  '2': 80,
  '3': 54,
  '4': 40.5,
  '5': 27,
  '6': 18,
  '7': 9,
  '8': 4.5,
  '9': 1.8,
}

const LOW_SPRO_RATES_ARR = [0.9, 0.85, 0.8, 0.54, 0.405, 0.27, 0.18, 0.09, 0.045, 0.018]
const LOW_SPRO_RATES_FWC_ARR = [1, 1, 1, 1, 0.81, 0.54, 0.36, 0.18, 0.09, 0.036]

const SPRO_RATES = [
  0.8888889, 0.8235294, 0.75, 0.3473699, 0.2062258, 0.0978264, 0.0456201, 0.0120164, 0.0030891,
  0.0005029,
]

const SPRO_RATES_FWC = [1, 1, 1, 1, 0.765432, 0.34737, 0.166328, 0.04562, 0.012016, 0.001988]

type UpgradeLevelType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
type UpgradeLevelMap<T> = { [LEVEL in UpgradeLevelType]: T }

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

  const between = (number: number, min: number, max: number) => {
    return Math.min(Math.max(number, min), max)
  }

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

  // https://gaming.stackexchange.com/a/290788
  const percentageFromChance = (chance: number) => {
    let pProcOnN = 0.0
    let pProcByN = 0.0
    let sumNpProcOnN = 0.0

    let maxFails = Number(Math.ceil(1.0 / chance))

    for (let i = 1; i < maxFails + 1; i++) {
      pProcOnN = Math.min(1.0, i * chance) * (1.0 - pProcByN)
      pProcByN += pProcOnN
      sumNpProcOnN += i * pProcOnN
    }

    return 1.0 / sumNpProcOnN
  }

  const chanceFromReadablePercentage = (percentage: number) => {
    let upperChance = percentage
    let lowerChance = 0.0
    let middleChance = 0.0
    let maxChance = 1.0

    while (true) {
      middleChance = (upperChance + lowerChance) / 2.0
      let tempPercentage = percentageFromChance(middleChance)

      if (Math.abs(tempPercentage - maxChance) <= 0) break

      if (tempPercentage > percentage) {
        upperChance = middleChance
      } else {
        lowerChance = middleChance
      }

      maxChance = tempPercentage
    }

    return middleChance
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

    const rates = state.isFWC
      ? state.lowSpro
        ? LOW_SPRO_RATES_FWC_ARR
        : SPRO_RATES_FWC
      : SPRO_RATES

    let current: UpgradeLevelType

    for (let i = 0; i < 1000; i++) {
      current = start
      let tempEronTotal = 0
      let tempMineralTotal = 0
      let numberOfAttempts = 1

      let tryTotal = 0
      let tempRates = [...rates]

      while (current < end) {
        let num = Math.random()
        tryTotal++
        tempEronTotal += MINERALS_REQUIRED[current]
        tempMineralTotal += MINERALS_REQUIRED[current]
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
    }

    let triesSum = totalTries.reduce((acc, curr) => acc + curr, 0)
    let mineralSum = mineralCosts.reduce((acc, curr) => acc + curr, 0)
    let eronSum = eronCosts.reduce((acc, curr) => acc + curr, 0)

    dispatch({ type: 'SET_TOTAL_ERONS', value: Math.floor(eronSum / eronCosts.length) })
    dispatch({ type: 'SET_TOTAL_MINERALS', value: Math.floor(mineralSum / mineralCosts.length) })
    dispatch({ type: 'SET_TOTAL_TRIES', value: Math.floor(triesSum / totalTries.length) })
  }

  const reset = () => {
    dispatch({ type: 'RESET_TOTALS' })
  }

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

  const rates = state.isFWC
    ? state.lowSpro
      ? LOW_SPRO_RATES_FWC_ARR
      : SPRO_RATES_FWC
    : state.lowSpro
    ? LOW_SPRO_RATES_ARR
    : SPRO_RATES
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
            className='border-0 focus:border-transparent text-black '
            onChange={() => dispatch({ type: 'SET_IS_FWC', value: !state.isFWC })}
            type='checkbox'
            checked={state.isFWC}
          />
        </div>
        <div className='flex justify-items-stretch gap-4'>
          <div>Low Spros?:</div>
          <input
            className='border-0 focus:border-transparent text-black '
            onChange={() => dispatch({ type: 'SET_LOW_SPRO', value: !state.lowSpro })}
            type='checkbox'
            checked={state.lowSpro}
          />
        </div>
      </div>

      <div className='flex gap-24 my-16 justify-center'>
        <div className='select-none'>
          <Image
            alt='helmet'
            className='ml-4 cursor-pointer'
            src='/helmet.png'
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
            src='/chest.png'
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
            src='/gloves.png'
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
            src='/boots.png'
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
            Penya:{' '}
            {new Intl.NumberFormat('en-US', {
              style: 'decimal',
            }).format(
              state.totalErons * state.eronPrice + state.totalMinerals * state.mineralPrice,
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
      <div className='flex flex-col justify-center items-center mt-auto'>
        <div>UPGRADE RATES?</div>
        {rates.map((rate, index) => (
          <div key={`${rate}-${index}`} className='flex justify-between w-36'>
            <span>(+{index + 1})</span>
            <span>{(rate * 100).toFixed(4)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
