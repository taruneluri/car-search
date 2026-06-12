import EmptyState from "../components/EmptyState.jsx";

export default function NotFoundPage() {
  return (
    <section className="page-shell py-12">
      <EmptyState
        title="Page not found"
        message="The page you are looking for does not exist."
        actionLabel="Go home"
        actionTo="/"
      />
    </section>
  );
}
