import { Skeleton, Stack } from '@chakra-ui/react'
import React from 'react'

const SkeletonCmp = () => {
  return (
    <div>
      <Stack>
  <Skeleton height='20px' />
  <Skeleton height='20px' />
  <Skeleton height='20px' />
  <Skeleton height='20px' />
  <Skeleton height='20px' />
  <Skeleton height='20px' />
  <Skeleton height='20px' />
  <Skeleton height='20px' />
</Stack>
    </div>
  )
}

export default SkeletonCmp
