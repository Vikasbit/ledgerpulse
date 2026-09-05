// app/exceptions/[id]/page.tsx
import { redirect } from 'next/navigation';

export default async function ExceptionDetailRedirect({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/dashboard/exceptions/${id}`);
}
