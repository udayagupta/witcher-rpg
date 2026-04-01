import React from 'react'

const StatsTable = ({ tableObject, isMonsterBased = false }) => {
  return (
    <div className=' bg-neutral-950/50 rounded-md border border-neutral-700 overflow-auto max-h-[400px] mt-2'>
      <table className='w-full text-left border-collapse'>
        <caption className='sticky caption-top bg-neutral-900/80 py-4 px-4 text-left text-2xl text-amber-500 border-b border-neutral-700 witcher-font tracking-wide'>
          {tableObject.caption}
        </caption>
        <thead className='sticky bg-neutral-900'>
          <tr className='text-neutral-400 text-xs uppercase tracking-widest border-b border-neutral-700'>
            <td className='py-2 px-3 font-medium'>{tableObject?.theads[0]}</td>
            <td className='py-2 px-3 font-medium text-right'>{tableObject?.theads[1]}</td>
          </tr>
        </thead>
        <tbody>
          {tableObject.trows.length === 0 ? (
            (
              <tr className='border-b border-neutral-800/50 last:border-0 hover:bg-neutral-800/50 transition-colors'>
                <td className='py-2 px-3 flex items-center gap-3'>Kill some monsters first...</td>
                <td className='py-2 px-3 text-right'></td>
              </tr>
            )
          ) : (
            tableObject.trows.map((row) => (
              <tr key={row.name} className='border-b border-neutral-800/50 last:border-0 hover:bg-neutral-800/50 transition-colors'>
                <td className='py-2 px-3 flex items-center gap-3'>
                  {isMonsterBased ? (
                    <div className='flex gap-2 items-center'>
                      <img src={`./images/${row.monsterId}.png`} className='h-[80px]' alt="" />
                      <p>{row.name}</p>
                    </div>
                  ) : `${row.name}`}
                </td>
                <td className='py-2 px-3 text-right'>{row.value}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default StatsTable