'use client';

import { Button, Input, Textarea } from '@heroui/react';
import { Check } from '@phosphor-icons/react';
import { type FieldValues, useForm } from 'react-hook-form';
import React from 'react';
import type Mail from 'nodemailer/lib/mailer';
import { enqueueSnackbar } from 'notistack';
import createContactMail from './create-contact-mail';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

export type ContactFormFields = {
  subject: string;
  message: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
};

type ContactFormProps = React.HTMLAttributes<HTMLElement> & {
  defaultValues?: Partial<ContactFormFields>;
  to?: string | Mail.Address | (Mail.Address | string)[];
};

const ContactForm = ({ defaultValues, to = 'tobias@hybit.media', ...props }: ContactFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const { executeRecaptcha } = useGoogleReCaptcha();

  const [isSubmitSuccessful, setIsSubmitSuccessful] = React.useState(false);

  const onSubmit = async (data: FieldValues) => {
    try {
      if (!executeRecaptcha) throw new Error('Failed to load captcha');
      const token = await executeRecaptcha('contact_form');
      const isHuman = await fetch('/api/dont-bother-me', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!isHuman.ok) {
        throw new Error('Failed to validate captcha');
      }

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          createContactMail({
            contactFormData: data as ContactFormFields,
            to: to as string,
            bcc: (to as string).includes('info@nanotest.eu') ? undefined : 'info@nanotest.eu',
            siteUrl: window.location.pathname,
          }),
        ),
      });

      if (!response.ok) {
        throw new Error(
          'Failed to send email. Please try again or contact us through other channels.',
        );
      }
      setIsSubmitSuccessful(true);
    } catch (error) {
      setIsSubmitSuccessful(false);
      enqueueSnackbar(
        <div className="flex flex-col items-start">
          <h2 className="block mb-1 text-kg font-bold">Failed to send email</h2>
          <p className="block mb-1">
            ${error instanceof Error ? error.message : 'An unknown error occurred'}
          </p>
          <p>:-((</p>
        </div>,
        { variant: 'error', hideIconVariant: true },
      );
    }
  };

  return (
    <section {...props} className={`${props.className}`}>
      <h2 className="text-3xl text-center font-bold text-transparent bg-clip-text bg-gradient-to-t from-primary-200 to-black dark:to-primary-300 dark:from-white mb-4">
        Contact us
      </h2>
      <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit(onSubmit)}>
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
          {...register('email', {
            required: true,
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          })}
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
        <div className="flex flex-col col-span-full mt-4">
          <Button
            className={`${isSubmitSuccessful || isSubmitting ? 'pointer-events-none' : ''}`}
            type="submit"
            formNoValidate
            size="lg"
            radius="md"
            variant="solid"
            color={isSubmitSuccessful ? 'success' : 'secondary'}
            isLoading={isSubmitting}
            disabled={isSubmitSuccessful}
          >
            {isSubmitSuccessful ? (
              <React.Fragment key="success">
                <Check size={28} /> We will be in touch
              </React.Fragment>
            ) : (
              'Hear back from us'
            )}
          </Button>
          <small className="col-span-full text-pretty ms-2 mt-2 text-xs text-primary text-center">
            This site is protected by reCAPTCHA and the Google
            <a className="inline-block underline px-1" href="https://policies.google.com/privacy">
              Privacy Policy
            </a>
            and
            <a className="inline-block underline px-1" href="https://policies.google.com/terms">
              Terms of Service
            </a>
            apply.
          </small>
        </div>
      </form>
    </section>
  );
};

export default ContactForm;
