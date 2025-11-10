export default function TaskDetailSkeleton() {
  return (
    <div className='max-w-7xl mx-auto w-full'>
      {/* Back Button Skeleton */}
      <div className='mb-6'>
        <div className='h-4 bg-gray-200 dark:bg-zinc-800 rounded w-24 animate-pulse' />
      </div>

      {/* Task Card Skeleton */}
      <div className='bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6 md:p-8 animate-pulse'>
        {/* Header */}
        <div className='flex items-start justify-between mb-6'>
          <div className='flex-1'>
            <div className='h-8 bg-gray-200 dark:bg-zinc-800 rounded w-3/4 mb-4' />
            <div className='h-4 bg-gray-200 dark:bg-zinc-800 rounded w-48' />
          </div>
          <div className='h-10 w-10 bg-gray-200 dark:bg-zinc-800 rounded-lg' />
        </div>

        {/* Badges */}
        <div className='flex items-center gap-3 mb-6'>
          <div className='h-7 bg-gray-200 dark:bg-zinc-800 rounded-full w-20' />
          <div className='h-7 bg-gray-200 dark:bg-zinc-800 rounded-full w-24' />
        </div>

        {/* Progress Bar */}
        <div className='mb-6'>
          <div className='flex items-center justify-between mb-2'>
            <div className='h-4 bg-gray-200 dark:bg-zinc-800 rounded w-16' />
            <div className='h-4 bg-gray-200 dark:bg-zinc-800 rounded w-32' />
          </div>
          <div className='h-2.5 bg-gray-200 dark:bg-zinc-800 rounded-full w-full' />
        </div>

        {/* Description */}
        <div className='mb-6'>
          <div className='h-4 bg-gray-200 dark:bg-zinc-800 rounded w-24 mb-2' />
          <div className='space-y-2'>
            <div className='h-4 bg-gray-200 dark:bg-zinc-800 rounded w-full' />
            <div className='h-4 bg-gray-200 dark:bg-zinc-800 rounded w-5/6' />
            <div className='h-4 bg-gray-200 dark:bg-zinc-800 rounded w-4/6' />
          </div>
        </div>

        {/* Task Details */}
        <div className='space-y-4 pt-6 border-t border-zinc-200 dark:border-zinc-800'>
          <div className='flex items-center gap-3'>
            <div className='h-5 w-5 bg-gray-200 dark:bg-zinc-800 rounded' />
            <div className='flex-1'>
              <div className='h-3 bg-gray-200 dark:bg-zinc-800 rounded w-16 mb-1' />
              <div className='h-4 bg-gray-200 dark:bg-zinc-800 rounded w-32' />
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <div className='h-5 w-5 bg-gray-200 dark:bg-zinc-800 rounded' />
            <div className='flex-1'>
              <div className='h-3 bg-gray-200 dark:bg-zinc-800 rounded w-20 mb-1' />
              <div className='h-4 bg-gray-200 dark:bg-zinc-800 rounded w-40' />
            </div>
          </div>
        </div>

        {/* Status Change Actions */}
        <div className='mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800'>
          <div className='h-4 bg-gray-200 dark:bg-zinc-800 rounded w-24 mb-3' />
          <div className='flex items-center gap-2'>
            <div className='h-10 bg-gray-200 dark:bg-zinc-800 rounded-lg w-24' />
            <div className='h-10 bg-gray-200 dark:bg-zinc-800 rounded-lg w-24' />
            <div className='h-10 bg-gray-200 dark:bg-zinc-800 rounded-lg w-24' />
          </div>
        </div>
      </div>

      {/* Todos Kanban Board Skeleton */}
      <div className='mt-8'>
        <div className='h-7 bg-gray-200 dark:bg-zinc-800 rounded w-24 mb-6' />
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className='flex flex-col'>
              <div className='bg-gray-100 dark:bg-zinc-800 rounded-t-lg px-4 py-3 border-b border-zinc-200 dark:border-zinc-700'>
                <div className='h-4 bg-gray-200 dark:bg-zinc-700 rounded w-20 mb-1' />
                <div className='h-3 bg-gray-200 dark:bg-zinc-700 rounded w-16' />
              </div>
              <div className='bg-gray-50 dark:bg-zinc-900 rounded-b-lg p-3 space-y-3 min-h-[200px]'>
                {[1, 2].map((j) => (
                  <div key={j} className='bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4'>
                    <div className='h-4 bg-gray-200 dark:bg-zinc-700 rounded w-3/4 mb-2' />
                    <div className='h-3 bg-gray-200 dark:bg-zinc-700 rounded w-full mb-2' />
                    <div className='h-6 bg-gray-200 dark:bg-zinc-700 rounded-full w-20' />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

