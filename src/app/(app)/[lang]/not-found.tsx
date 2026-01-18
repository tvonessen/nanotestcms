import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container mx-auto my-24 flex flex-col items-center">
      <h1 className="text-2xl text-center">404 - Page Not Found</h1>
      <Link className="btn btn-primary btn-lg mt-12" href="/public">
        Return home
      </Link>
    </div>
  );
}
