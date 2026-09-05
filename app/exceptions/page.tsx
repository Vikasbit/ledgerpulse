// app/exceptions/page.tsx
import { redirect } from 'next/navigation';

export default function ExceptionsRedirect() {
  redirect('/dashboard/exceptions');
}
