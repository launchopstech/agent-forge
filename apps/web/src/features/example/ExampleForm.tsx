'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Button } from '@forge/ui/src/button'
import { Input } from '@forge/ui/src/input'
import { Textarea } from '@forge/ui/src/textarea'
import { Spinner } from '@forge/ui/src/spinner'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@forge/ui/src/form'

const exampleFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ExampleFormValues = z.infer<typeof exampleFormSchema>

interface ExampleFormProps {
  onSubmit?: (values: ExampleFormValues) => Promise<void>
}

function ExampleForm({ onSubmit }: ExampleFormProps) {
  const [isSuccess, setIsSuccess] = React.useState(false)

  const form = useForm<ExampleFormValues>({
    resolver: zodResolver(exampleFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  })

  const { isSubmitting } = form.formState

  async function handleSubmit(values: ExampleFormValues) {
    if (onSubmit) {
      await onSubmit(values)
    } else {
      await new Promise((resolve) => setTimeout(resolve, 1500))
    }
    setIsSuccess(true)
    form.reset()
  }

  if (isSuccess) {
    return (
      <div
        role="status"
        className="rounded-xl border bg-card p-8 text-center flex flex-col gap-3 items-center"
      >
        <p className="text-lg font-semibold text-foreground">Message sent!</p>
        <p className="text-sm text-muted-foreground">We&apos;ll get back to you shortly.</p>
        <Button variant="outline" size="sm" onClick={() => setIsSuccess(false)}>
          Send another
        </Button>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write your message here..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="self-end">
          {isSubmitting && <Spinner className="mr-2" />}
          {isSubmitting ? 'Sending...' : 'Send message'}
        </Button>
      </form>
    </Form>
  )
}

export { ExampleForm, exampleFormSchema }
export type { ExampleFormValues }
