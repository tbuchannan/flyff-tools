const between = (number: number, min: number, max: number) => {
  return Math.min(Math.max(number, min), max)
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
