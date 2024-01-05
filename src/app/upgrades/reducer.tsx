interface State {
  mineralPrice: number
  eronPrice: number
  isFWC: boolean
  lowSpro: boolean
  helmetUpgrade: number
  chestUpgrade: number
  glovesUpgrade: number
  bootsUpgrade: number
  helmetGoal: number
  chestGoal: number
  glovesGoal: number
  bootsGoal: number
  totalErons: number
  totalMinerals: number
  totalTries: number
  rawPenya: number
}

type Action =
  | { type: 'SET_MINERAL_PRICE'; value: number }
  | { type: 'SET_ERON_PRICE'; value: number }
  | { type: 'SET_IS_FWC'; value: boolean }
  | { type: 'SET_LOW_SPRO'; value: boolean }
  | { type: 'SET_HELMET_UPGRADE'; value: number }
  | { type: 'SET_CHEST_UPGRADE'; value: number }
  | { type: 'SET_GLOVES_UPGRADE'; value: number }
  | { type: 'SET_BOOTS_UPGRADE'; value: number }
  | { type: 'SET_HELMET_GOAL'; value: number }
  | { type: 'SET_CHEST_GOAL'; value: number }
  | { type: 'SET_GLOVES_GOAL'; value: number }
  | { type: 'SET_BOOTS_GOAL'; value: number }
  | { type: 'SET_TOTAL_ERONS'; value: number }
  | { type: 'SET_TOTAL_MINERALS'; value: number }
  | { type: 'SET_TOTAL_TRIES'; value: number }
  | { type: 'SET_RAW_PENYA'; value: number }
  | { type: 'RESET_TOTALS' }

// Define the initial state
export const initialState = {
  mineralPrice: 0,
  eronPrice: 0,
  isFWC: false,
  lowSpro: false,
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
  totalTries: 0,
  rawPenya: 0,
}

// Define the reducer function
export function upgradeReducer(state: State, action: Action) {
  switch (action.type) {
    case 'SET_MINERAL_PRICE':
      return { ...state, mineralPrice: action.value }
    case 'SET_ERON_PRICE':
      return { ...state, eronPrice: action.value }
    case 'SET_IS_FWC':
      return { ...state, isFWC: action.value }
    case 'SET_LOW_SPRO':
      return { ...state, lowSpro: action.value }
    case 'SET_HELMET_UPGRADE':
      return { ...state, helmetUpgrade: action.value }
    case 'SET_CHEST_UPGRADE':
      return { ...state, chestUpgrade: action.value }
    case 'SET_GLOVES_UPGRADE':
      return { ...state, glovesUpgrade: action.value }
    case 'SET_BOOTS_UPGRADE':
      return { ...state, bootsUpgrade: action.value }
    case 'SET_HELMET_GOAL':
      return { ...state, helmetGoal: action.value }
    case 'SET_CHEST_GOAL':
      return { ...state, chestGoal: action.value }
    case 'SET_GLOVES_GOAL':
      return { ...state, glovesGoal: action.value }
    case 'SET_BOOTS_GOAL':
      return { ...state, bootsGoal: action.value }
    case 'SET_TOTAL_ERONS':
      return { ...state, totalErons: state.totalErons + action.value }
    case 'SET_TOTAL_MINERALS':
      return { ...state, totalMinerals: state.totalMinerals + action.value }
    case 'SET_TOTAL_TRIES':
      return { ...state, totalTries: state.totalTries + action.value }
    case 'SET_RAW_PENYA':
      return { ...state, rawPenya: state.rawPenya + action.value }
    case 'RESET_TOTALS':
      return { ...state, totalTries: 0, totalMinerals: 0, totalErons: 0, rawPenya: 0 }
    default:
      return state
  }
}
