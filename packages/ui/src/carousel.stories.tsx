import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { useTranslations } from 'next-intl'
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from './carousel'
import { Card, CardContent } from './card'

const meta: Meta = {
  title: 'UI/Carousel',
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj

function LocalizedDefault() {
  const t = useTranslations('ui')
  return (
    <div className="w-[300px]">
      <Carousel>
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, i) => (
            <CarouselItem key={i}>
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{i + 1}</span>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious label={t('previousSlide')} />
        <CarouselNext label={t('nextSlide')} />
      </Carousel>
    </div>
  )
}

export const Default: Story = {
  render: () => <LocalizedDefault />,
}

function LocalizedMultipleItems() {
  const t = useTranslations('ui')
  return (
    <div className="w-[600px]">
      <Carousel opts={{ align: 'start' }}>
        <CarouselContent>
          {Array.from({ length: 8 }).map((_, i) => (
            <CarouselItem key={i} className="basis-1/3">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-2xl font-semibold">{i + 1}</span>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious label={t('previousSlide')} />
        <CarouselNext label={t('nextSlide')} />
      </Carousel>
    </div>
  )
}

export const MultipleItems: Story = {
  render: () => <LocalizedMultipleItems />,
}

function LocalizedVertical() {
  const t = useTranslations('ui')
  return (
    <div className="h-[300px] w-[200px]">
      <Carousel orientation="vertical">
        <CarouselContent className="-mt-1 h-[250px]">
          {Array.from({ length: 5 }).map((_, i) => (
            <CarouselItem key={i} className="pt-1">
              <Card>
                <CardContent className="flex items-center justify-center p-6">
                  <span className="text-2xl font-semibold">{i + 1}</span>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious label={t('previousSlide')} />
        <CarouselNext label={t('nextSlide')} />
      </Carousel>
    </div>
  )
}

export const Vertical: Story = {
  render: () => <LocalizedVertical />,
}
