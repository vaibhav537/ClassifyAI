import { LogoProps } from "@/lib/types";
import Image from "next/image";
import React from "react";

const Logo = ({
  width = 220,
  height = 72,
  className = "",
  imageClassName = "",
}: LogoProps) => {
  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src="/logo-nobg.png"
        alt="Classify AI"
        width={width}
        height={height}
        priority
        className={`h-auto w-[150px] object-contain drop-shadow-[0_0_22px_rgba(34,211,238,0.16)] sm:w-[180px] lg:w-[210px] 2xl:w-[260px] ${imageClassName}`}
      />
    </div>
  );
};

export default Logo;