'use client'
import { ItemInput } from '@/components/item-input'
import Image from 'next/image'
import { FormEvent, useState } from 'react'

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

const OLD_RATES_ARR = [0.9, 0.85, 0.8, 0.54, 0.405, 0.27, 0.18, 0.09, 0.045, 0.018]

const ACTUAL_RATES = [
  0.8888889, 0.8235294, 0.75, 0.3473699, 0.2062258, 0.0978264, 0.0456201, 0.0120164, 0.0030891,
  0.0005029,
]

const ACTUAL_RATES_FWC = [
  1, 1, 1, 0.6947398, 0.4124516, 0.1956528, 0.0912402, 0.0240328, 0.0061782, 0.0010058,
]

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

const initialState = {
  mineralPrice: 0,
  eronPrice: 0,
  isFWC: false,
  helmetUpgrade: 0,
  chestUpgrade: 0,
  glovesUpgrade: 0,
  bootsUpgrade: 0,
  helmetGoal: 0,
  chestGoal: 0,
  glovesGoal: 0,
  bootsGoal: 0,
  totalErons: 0,
  totalMinerals: 0,
}

export default function Upgrades() {
  const [mineralPrice, setMineralPrice] = useState(0)
  const [eronPrice, setEronPrice] = useState(0)
  const [isFWC, setIsFWC] = useState(false)
  const [helmetUpgrade, setHelmetUpgrade] = useState(0)
  const [chestUpgrade, setChestUpgrade] = useState(0)
  const [glovesUpgrade, setGlovesUpgrade] = useState(0)
  const [bootsUpgrade, setBootsUpgrade] = useState(0)
  const [helmetGoal, setHelmetGoal] = useState(0)
  const [chestGoal, setChestGoal] = useState(0)
  const [glovesGoal, setGlovesGoal] = useState(0)
  const [bootsGoal, setBootsGoal] = useState(0)
  const [totalErons, setTotalErons] = useState(0)
  const [totalMinerals, setTotalMinerals] = useState(0)

  const between = (number: number, min: number, max: number) => {
    return Math.min(Math.max(number, min), max)
  }

  const handlePriceChange = (e: FormEvent<HTMLInputElement>, material: MaterialType) => {
    let flooredNum = Math.floor(Number(e.currentTarget.value)) ?? 0

    if (flooredNum < MAX_PRICE) {
      switch (material) {
        case MaterialType.Eron:
          setEronPrice(flooredNum)
          break
        case MaterialType.Mineral:
          setMineralPrice(flooredNum)
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
    console.log('asd')
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
        newUpgrade = helmetUpgrade + mod
        if (newUpgrade >= 0 && newUpgrade <= 10) setHelmetUpgrade(newUpgrade)
        break
      case GearType.Chest:
        newUpgrade = chestUpgrade + mod
        if (newUpgrade >= 0 && newUpgrade <= 10) setChestUpgrade(newUpgrade)
        break
      case GearType.Gloves:
        newUpgrade = glovesUpgrade + mod
        if (newUpgrade >= 0 && newUpgrade <= 10) setGlovesUpgrade(newUpgrade)
        break
      case GearType.Boots:
        newUpgrade = bootsUpgrade + mod
        if (newUpgrade >= 0 && newUpgrade <= 10) setBootsUpgrade(newUpgrade)
        break
      default:
        break
    }
  }

  const simulate = (start: UpgradeLevelType, end: UpgradeLevelType, item: GearType) => {
    if (start > end) return

    let current = start
    let tempEronTotal = 0
    let tempMineralTotal = 0
    const rates = isFWC ? ACTUAL_RATES_FWC : ACTUAL_RATES

    while (current < end) {
      let num = Math.random()
      tempEronTotal += MINERALS_REQUIRED[current]
      tempMineralTotal += MINERALS_REQUIRED[current]
      if (num <= rates[current]) current++
    }

    setTotalErons((item) => item + tempEronTotal)
    setTotalMinerals((item) => item + tempMineralTotal)

    switch (item) {
      case GearType.Helmet:
        setHelmetUpgrade(current)
        break
      case GearType.Chest:
        setChestUpgrade(current)
        break
      case GearType.Gloves:
        setGlovesUpgrade(current)
        break
      case GearType.Boots:
        setBootsUpgrade(current)
        break
    }
  }

  const reset = () => {
    // setHelmetGoal(0)
    setHelmetUpgrade(0)
    // setChestGoal(0)
    setChestUpgrade(0)
    // setGlovesGoal(0)
    setGlovesUpgrade(0)
    // setBootsGoal(0)
    setBootsUpgrade(0)

    setTotalErons(0)
    setTotalMinerals(0)
  }

  const calculate = () => {
    simulate(helmetUpgrade as UpgradeLevelType, helmetGoal as UpgradeLevelType, GearType.Helmet)
    simulate(chestUpgrade as UpgradeLevelType, chestGoal as UpgradeLevelType, GearType.Chest)
    simulate(glovesUpgrade as UpgradeLevelType, glovesGoal as UpgradeLevelType, GearType.Gloves)
    simulate(bootsUpgrade as UpgradeLevelType, bootsGoal as UpgradeLevelType, GearType.Boots)
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
            value={mineralPrice}
          />
        </div>
        <div className='flex justify-items-stretch gap-4'>
          <div>Erons Price: </div>
          <div>
            <input
              className='border-0 focus:border-transparent text-black w-24'
              onChange={(e) => handlePriceChange(e, MaterialType.Eron)}
              type='number'
              value={eronPrice}
            />
          </div>
        </div>
        <div className='flex justify-items-stretch gap-4'>
          <div>FWC?:</div>
          <input
            className='border-0 focus:border-transparent text-black '
            onChange={() => setIsFWC(!isFWC)}
            type='checkbox'
            checked={isFWC}
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
            <span>Current:</span>
            <ItemInput value={helmetUpgrade} onChange={setHelmetUpgrade} />
          </div>
          <div className='flex justify-between'>
            <span>Goal:</span>
            <ItemInput value={helmetGoal} onChange={setHelmetGoal} />
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
            <span>Current:</span>
            <ItemInput value={chestUpgrade} onChange={setChestUpgrade} />
          </div>

          <div className='flex justify-between'>
            <span>Goal:</span>
            <ItemInput value={chestGoal} onChange={setChestGoal} />
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
            <span>Current:</span>
            <ItemInput value={glovesUpgrade} onChange={setGlovesUpgrade} />
          </div>
          <div className='flex justify-between'>
            <span>Goal:</span>
            <ItemInput value={glovesGoal} onChange={setGlovesGoal} />
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
            <span>Current:</span>
            <ItemInput value={bootsUpgrade} onChange={setBootsUpgrade} />
          </div>
          <div className='flex justify-between'>
            <span>Goal:</span>
            <ItemInput value={bootsGoal} onChange={setBootsGoal} />
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
            }).format(totalMinerals)}
          </span>
          <span>
            Total Erons:{' '}
            {new Intl.NumberFormat('en-US', {
              style: 'decimal',
            }).format(totalErons)}
          </span>
          <span>
            Penya:{' '}
            {new Intl.NumberFormat('en-US', {
              style: 'decimal',
            }).format(totalErons * eronPrice + totalMinerals * mineralPrice)}
          </span>
        </div>
      </div>
      <div className='flex flex-col justify-center items-center mt-auto'>
        <div>UPGRADE RATES?</div>
        {ACTUAL_RATES.map((rate, index) => (
          <div key={`${rate}-${index}`} className='flex justify-between w-36'>
            <span>(+{index + 1})</span>
            <span>
              {isFWC ? parseFloat(between(rate * 200, 0, 100).toFixed(8)) : (rate * 100).toFixed(4)}
              %
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
