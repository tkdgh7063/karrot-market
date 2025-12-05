export default async function ExtrasPage(
  props: PageProps<"/extras/[[...slug]]">,
) {
  const { slug } = await props.params;

  return (
    <div className="flex flex-col gap-3 py-10">
      <h1 className="font-rubik text-6xl">Extras</h1>
      <div>
        {slug ? (
          slug?.map((s, index) => (
            <div key={index}>
              Slug {index + 1}: {s}
            </div>
          ))
        ) : (
          <div className="font-roboto text-2xl">No Slugs</div>
        )}
      </div>
    </div>
  );
}
