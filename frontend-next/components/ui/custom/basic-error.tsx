export default function BasicError({ error }: { error: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-zinc-800">
        <div className="text-center text-red-600 dark:text-red-400">
          {error}
        </div>
      </div>
    </div>
  );
}
