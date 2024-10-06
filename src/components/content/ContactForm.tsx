'use client';

import { Button, Input, Textarea } from '@nextui-org/react';
import { Check, EnvelopeSimple } from '@phosphor-icons/react';
import { enqueueSnackbar } from 'notistack';
import React from 'react';
import { FieldValues, useForm } from 'react-hook-form';

type ContactFormProps = React.HTMLAttributes<HTMLElement> & {
  defaultValues?: {
    subject?: string;
    message?: string;
    name?: string;
    company?: string;
    email?: string;
    phone?: string;
  };
};

const ContactForm = ({ defaultValues, ...props }: ContactFormProps) => {
  const [triedOnce, setTriedOnce] = React.useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm();

  const submit = (data: FieldValues) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (triedOnce) {
          resolve(data);
        } else {
          enqueueSnackbar('Submission failed. Please try again.', { variant: 'error' });
          reject('An error occurred');
          setTriedOnce(true);
        }
      }, 2000);
    });
  };

  return (
    <section {...props} className={`${props.className}`}>
      <h2 className="text-3xl text-center font-bold text-transparent bg-clip-text bg-gradient-to-t from-primary-200 to-black dark:to-primary-300 dark:from-white mb-4">
        Contact us
      </h2>
      <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit(submit)}>
        <h3 className="col-span-2 -mb-2 text-lg font-medium text-secondary mt-2">Your message</h3>
        <Input
          {...register('subject', { required: true })}
          className="col-span-2"
          variant="underlined"
          isRequired
          isInvalid={!!errors.subject}
          errorMessage="Please enter a subject"
          label="Subject"
          type="text"
          defaultValue={defaultValues?.subject}
          isDisabled={isSubmitting || isSubmitSuccessful}
        />
        <Textarea
          {...register('message', { required: true })}
          className="col-span-2"
          variant="underlined"
          isRequired
          isInvalid={!!errors.message}
          errorMessage="Please enter a message"
          label="Message"
          type="textarea"
          defaultValue={defaultValues?.message}
          isDisabled={isSubmitting || isSubmitSuccessful}
        />
        <h3 className="col-span-2 -mb-2 text-lg font-medium text-secondary mt-2">About you</h3>
        <Input
          {...register('name', { required: true })}
          className="col-span-2 sm:col-span-1"
          variant="underlined"
          isRequired
          label="Your name"
          type="text"
          isInvalid={!!errors.name}
          errorMessage="Please enter your name"
          defaultValue={defaultValues?.name}
          isDisabled={isSubmitting || isSubmitSuccessful}
        />
        <Input
          {...register('company')}
          className="col-span-2 sm:col-span-1"
          variant="underlined"
          label="Company"
          type="text"
          isInvalid={!!errors.company}
          errorMessage="Please enter a company name"
          defaultValue={defaultValues?.phone}
          isDisabled={isSubmitting || isSubmitSuccessful}
        />
        <Input
          {...register('email', { required: true })}
          className="col-span-2 sm:col-span-1"
          variant="underlined"
          isRequired
          label="Email"
          type="email"
          isInvalid={!!errors.email}
          errorMessage="Please enter a valid email"
          defaultValue={defaultValues?.email}
          isDisabled={isSubmitting || isSubmitSuccessful}
        />
        <Input
          {...register('phone', { pattern: /^[0-9\+\s]+$/ })}
          className="col-span-2 sm:col-span-1"
          variant="underlined"
          label="Phone"
          type="tel"
          isInvalid={!!errors.phone}
          errorMessage="Please enter a valid phone number"
          isDisabled={isSubmitting || isSubmitSuccessful}
        />
        <Button
          className="mt-4 col-span-2"
          type="submit"
          size="lg"
          radius="md"
          variant="solid"
          color={isSubmitSuccessful ? 'success' : 'secondary'}
          isLoading={isSubmitting}
          disabled={isSubmitSuccessful}
        >
          {isSubmitSuccessful ? (
            <>
              <Check size={28} /> We will be in touch
            </>
          ) : (
            'Hear back from us'
          )}
        </Button>
      </form>
    </section>
  );
};

export default ContactForm;
