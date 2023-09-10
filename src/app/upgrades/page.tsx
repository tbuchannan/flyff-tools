'use client'
import Image from 'next/image'
import { FormEvent, useState } from 'react'

const MAX_PRICE = 1000000

enum MaterialType {
  Eron,
  Mineral,
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

let RATES = [0.9, 0.85, 0.8, 0.54, 0.405, 0.27, 0.18, 0.09, 0.045, 0.018]

const ACTUAL_RATES = [
  0.8888889, 0.8235294, 0.75, 0.3473699, 0.2062258, 0.0978264, 0.0456201, 0.0120164, 0.0030891,
  0.0005029,
]

const MINERALS_REQUIRED = {
  '0': 10,
  '1': 14,
  '2': 20,
  '3': 27,
  '4': 38,
  '5': 54,
  '6': 75,
  '7': 105,
  '8': 148,
  '9': 207,
}

export default function Home() {
  const [mineralPrice, setMineralPrice] = useState(0)
  const [eronPrice, setEronPrice] = useState(0)
  const [isFWC, setIsFWC] = useState(false)

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
  console.log(isFWC)
  return (
    <div className='flex flex-col justify-between h-screen gap-1 p-8'>
      <div className='flex gap-4'>
        <div className='flex justify-items-stretch gap-4'>
          <div>Mineral Price:</div>
          <input
            className='border-0 focus:border-transparent text-black '
            onChange={(e) => handlePriceChange(e, MaterialType.Mineral)}
            type='number'
            value={mineralPrice}
          />
        </div>
        <div className='flex justify-items-stretch gap-4'>
          <div>Erons Price: </div>
          <div>
            <input
              className='border-0 focus:border-transparent text-black '
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

      <div className='flex flex-col justify-center items-center'>
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
