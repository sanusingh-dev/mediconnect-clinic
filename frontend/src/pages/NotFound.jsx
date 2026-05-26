import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-170px)] max-w-4xl flex-col items-center justify-center px-6 text-center">
      <h1 className="text-6xl font-semibold text-slate-900">404</h1>
      <p className="mt-4 text-xl text-slate-600">Page not found. The resource you are looking for does not exist.</p>
      <Link to="/" className="mt-6 inline-flex rounded-full bg-brand px-6 py-3 text-white hover:bg-blue-600">
        Return home
      </Link>
    </div>
  );
};

export default NotFound;
