"use client";

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type FormData = {
  name: string;
  email: string;
  message: string;
};

export default function ContactForm(): React.ReactElement {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ mode: 'onTouched' });

  function onSubmit(data: FormData) {
    // Frontend demo only — normally we'd send this to an API
    console.log('Contact form submitted:', data);
    alert('Tack! Vi har mottagit ditt meddelande (simulerat).');
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm text-muted-foreground mb-1">Namn</label>
        <Input {...register('name', { required: 'Namn krävs' })} />
        {errors.name && <p className="text-xs text-destructive">{String(errors.name.message)}</p>}
      </div>

      <div>
        <label className="block text-sm text-muted-foreground mb-1">E-post</label>
        <Input type="email" {...register('email', { required: 'E-post krävs', pattern: { value: /\S+@\S+\.\S+/, message: 'Ogiltig e-post' } })} />
        {errors.email && <p className="text-xs text-destructive">{String(errors.email.message)}</p>}
      </div>

      <div>
        <label className="block text-sm text-muted-foreground mb-1">Meddelande</label>
        <textarea {...register('message', { required: 'Meddelande krävs' })} className="w-full rounded-md border border-border p-2 bg-background text-foreground" rows={6} />
        {errors.message && <p className="text-xs text-destructive">{String(errors.message.message)}</p>}
      </div>

      <div className="pt-2">
        <Button type="submit" className="w-full" disabled={isSubmitting}>Skicka</Button>
      </div>
    </form>
  );
}
