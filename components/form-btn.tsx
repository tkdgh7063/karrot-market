interface FormButtonProps {
  text: string;
  loading: boolean;
}

export default function FormButton({ text, loading }: FormButtonProps) {
  return (
    <button
      className="primary-btn h-10 w-full self-center font-semibold disabled:cursor-not-allowed disabled:bg-neutral-400 disabled:text-neutral-300 disabled:hover:bg-neutral-400"
      disabled={loading}
    >
      {loading ? "Loading..." : text}
    </button>
  );
}
