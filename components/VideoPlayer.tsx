export default function VideoPlayer({ kinescopeVideoId }: { kinescopeVideoId: string | null }) {
  if (!kinescopeVideoId) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-2xl bg-muted text-sm opacity-60">
        Видео скоро появится
      </div>
    );
  }

  return (
    <div className="aspect-video overflow-hidden rounded-xl">
      <iframe
        src={`https://kinescope.io/embed/${kinescopeVideoId}`}
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        allowFullScreen
        className="h-full w-full"
      />
    </div>
  );
}
