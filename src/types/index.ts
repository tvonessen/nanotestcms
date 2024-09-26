import { IconProps } from "@phosphor-icons/react";
import React from "react";

export type ProductProps = {
  title: string;
  subtitle: string;
  description: string;
  article: React.ReactNode;
  image: { url: string; width?: number; height?: number };
  href: string;
  categoryId: number;
  new?: boolean;
};

export type ProductCategoryProps = {
  id: number;
  title: string;
  description: React.ReactNode;
  icon: (props: IconProps) => JSX.Element;
};
