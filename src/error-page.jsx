import { Link, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center gap-10">
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-3xl text-destructive">Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p className="text-muted">
          <i>{error.statusText || error.message}</i>
        </p>
      </div>
      <Link to="/" className="underline">
        Go back to the dashboard
      </Link>
    </div>
  );
}
