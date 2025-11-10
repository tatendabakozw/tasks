export default function TaskCardSkeleton() {
  return (
    <div className='flex flex-col p-5 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 animate-pulse'>
      {/* Header */}
      <div className='flex items-start justify-between mb-3'>
        <div className='flex-1'>
          <div className='h-5 bg-gray-200 dark:bg-zinc-800 rounded w-3/4 mb-2' />
          <div className='h-4 bg-gray-200 dark:bg-zinc-800 rounded w-1/2' />
        </div>
        <div className='h-6 w-6 bg-gray-200 dark:bg-zinc-800 rounded' />
      </div>

      {/* Description */}
      <div className='mb-4 space-y-2'>
        <div className='h-4 bg-gray-200 dark:bg-zinc-800 rounded w-full' />
        <div className='h-4 bg-gray-200 dark:bg-zinc-800 rounded w-5/6' />
      </div>

      {/* Badges */}
      <div className='flex items-center gap-2 mb-3'>
        <div className='h-6 bg-gray-200 dark:bg-zinc-800 rounded-full w-16' />
        <div className='h-6 bg-gray-200 dark:bg-zinc-800 rounded-full w-20' />
      </div>

      {/* Progress Bar */}
      <div className='mb-3'>
        <div className='flex items-center justify-between mb-1.5'>
          <div className='h-3 bg-gray-200 dark:bg-zinc-800 rounded w-16' />
          <div className='h-3 bg-gray-200 dark:bg-zinc-800 rounded w-20' />
        </div>
        <div className='h-1.5 bg-gray-200 dark:bg-zinc-800 rounded-full w-full' />
      </div>

      {/* Metadata */}
      <div className='mt-auto space-y-2 pt-3 border-t border-zinc-200 dark:border-zinc-800'>
        <div className='h-3 bg-gray-200 dark:bg-zinc-800 rounded w-24' />
        <div className='h-3 bg-gray-200 dark:bg-zinc-800 rounded w-32' />
      </div>
    </div>
  )
}

