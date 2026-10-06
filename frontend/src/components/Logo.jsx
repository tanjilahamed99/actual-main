import Image from "next/image";
import React from "react";

const Logo = () => {
  return (
    <Image
      src="/logo.png"
      alt="Actual IELTS Questions"
      width={500}
      height={500}
      className="h-8 w-auto sm:h-10"
    />
  );
};

export default Logo;
