"use client";

import { useState } from "react";
import Image from "next/image";

import { instagramPosts } from "@/types/instagram-data";
import { instagramBio } from "@/types/site-content";
import { CarouselBadgeIcon } from "@/components/icons";

const POSTS_PER_PAGE = 6;

export function InstagramSection() {
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  const visiblePosts = instagramPosts.slice(0, visibleCount);
  const hasMore = visibleCount < instagramPosts.length;

  const handleLoadMore = () => {
    setVisibleCount((count) =>
      Math.min(count + POSTS_PER_PAGE, instagramPosts.length)
    );
  };

  return (
    <section id="instagram" className="py-16 px-6">
      <a
        href={instagramBio.profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center gap-3 text-center mb-10"
      >
        <Image
          src="/images/instagram/avatar.webp"
          alt={instagramBio.handle}
          width={56}
          height={56}
          className="rounded-full object-cover"
        />
        <div>
          <h3 className="font-bold text-foreground">{instagramBio.handle}</h3>
          {instagramBio.lines.map((line) => (
            <p key={line} className="text-muted-foreground text-sm">
              {line}
            </p>
          ))}
        </div>
      </a>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-px">
        {visiblePosts.map((post) => (
          <a
            key={post.id}
            href={post.href}
            target="_blank"
            rel="noopener noreferrer"
            className="relative aspect-square block overflow-hidden"
          >
            <Image src={post.image} alt="" fill className="object-cover" />
            {post.isCarousel && (
              <CarouselBadgeIcon className="absolute top-2 right-2 w-4 h-4 text-white drop-shadow" />
            )}
          </a>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            type="button"
            onClick={handleLoadMore}
            className="bg-[#333333] text-white text-[13px] px-[14px] py-[7px] rounded-sm"
          >
            More
          </button>
        </div>
      )}
    </section>
  );
}
