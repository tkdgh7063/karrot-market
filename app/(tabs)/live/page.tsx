import AddIconBtn from "@/components/add-icon-btn";

export default function Live() {
  return (
    <div>
      <h1 className="text-4xl text-white">Live!</h1>
      <AddIconBtn href={`/streams/add`} />
    </div>
  );
}
