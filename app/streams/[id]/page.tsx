export default async function StreamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const streamId = (await params).id;
  return <div>STREAM #{streamId}</div>;
}
