export default function Loading() {
  return (
    <div className="container-x py-12">
      <div className="skeleton h-5 w-32" />
      <div className="skeleton mt-4 h-16 w-2/3" />
      <div className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => <div key={i} className="skeleton aspect-[3/4]" />)}
      </div>
    </div>
  );
}
