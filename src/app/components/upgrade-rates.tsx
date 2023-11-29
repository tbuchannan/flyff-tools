const UpgradeRates = ({ rates }: { rates: number[] }) => (
  <div className='flex flex-col justify-center items-center mt-auto'>
    <div>UPGRADE RATES?</div>
    {rates.map((rate, index) => (
      <div key={`${rate}-${index}`} className='flex justify-between w-36'>
        <span>(+{index + 1})</span>
        <span>{(rate * 100).toFixed(4)}%</span>
      </div>
    ))}
  </div>
)

export default UpgradeRates
