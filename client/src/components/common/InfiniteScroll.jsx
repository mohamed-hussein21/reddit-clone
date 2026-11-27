import { useEffect, useRef } from 'react';

// Shows its children, and calls onLoadMore when the user scrolls near the end.
// Works by watching an invisible div at the bottom (IntersectionObserver),
// so we don't need to listen to every scroll event.
export default function InfiniteScroll({ children, onLoadMore, hasMore, loading }) {
  const sentinelRef = useRef(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading) {
          onLoadMore();
        }
      },
      { rootMargin: '300px' } // start loading a bit before the real end
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [onLoadMore, hasMore, loading]);

  return (
    <>
      {children}
      <div ref={sentinelRef} aria-hidden="true" />
    </>
  );
}