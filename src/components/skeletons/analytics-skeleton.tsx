export default function AnalyticsSkeleton() {
  return (
    <div className='grid grid-cols-2 md:grid-cols-5 gap-4 mb-6'>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className='p-4 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 animate-pulse'>
          <div className='flex items-center gap-3 mb-2'>
            <div className='p-2 bg-gray-200 dark:bg-zinc-800 rounded-lg w-8 h-8' />
            <div className='h-3 bg-gray-200 dark:bg-zinc-800 rounded w-12' />
          </div>
          <div className='h-8 bg-gray-200 dark:bg-zinc-800 rounded w-16' />
        </div>
      ))}
    </div>
  )
}

