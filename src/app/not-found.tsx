import React from "react";
import Link from "next/link";
import { PhoenixMark } from "@/components/BrandMarks";

export default function NotFound() {
  return (
    <div className="bg-[#000000] py-28">
      <div className="mx-auto max-w-[640px] px-6 text-center">
        <PhoenixMark size={32} />
        <p className="mt-5 label-track text-[#C5A059]">404 · Record Not Found</p>
        <h1 className="mt-3 font-display text-5xl text-[#F5F5F0]">Lost the thread?</h1>
        <p className="mt-4 text-sm text-[#8E8E8A]">
          This page doesn&apos;t exist, but your story isn&apos;t over.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/"
            className="label-track border border-[#C5A059] bg-[#C5A059] px-6 py-3.5 text-[#000000] hover:bg-[#000000] hover:text-[#C5A059]"
          >
            Return to Screening Room
          </Link>
          <Link
            href="/stories"
            className="label-track border border-[#444444] px-6 py-3.5 text-[#F5F5F0] hover:border-[#C5A059] hover:text-[#C5A059]"
          >
            Browse Stories
          </Link>
        </div>
      </div>
    </div>
  );
}
